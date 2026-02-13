import Allocation from "../models/Allocation.js";
import Event from "../models/Event.js";
import Resource from "../models/Resource.js";
import Venue from "../models/Venue.js";
import { detectResourceConflict, detectVenueConflict } from "./conflictDetection.js";
import { calculatePriorityScore } from "./priority.js";
import { setResourceAvailability, setVenueOccupancy } from "./cache.js";

const overlaps = (startA, endA, startB, endB) => startA < endB && startB < endA;

export const allocateResources = async ({ eventId, venueId, resources }) => {
  const event = await Event.findById(eventId).lean();
  if (!event) {
    throw new Error("Event not found");
  }

  const venue = await Venue.findById(venueId).lean();
  if (!venue || venue.maintenanceMode || !venue.available) {
    throw new Error("Venue unavailable");
  }

  if (venue.capacity < event.participants) {
    return { ok: false, reason: "Venue capacity too small" };
  }

  const venueConflict = await detectVenueConflict({
    venueId,
    startTime: event.startTime,
    endTime: event.endTime
  });
  if (venueConflict) {
    return { ok: false, conflict: venueConflict };
  }

  for (const resource of resources) {
    const conflict = await detectResourceConflict({
      resourceId: resource.resourceId,
      quantity: resource.quantity,
      startTime: event.startTime,
      endTime: event.endTime
    });
    if (conflict) {
      return { ok: false, conflict };
    }
  }

  const allocation = await Allocation.create({
    eventId,
    venueId,
    resources,
    startTime: event.startTime,
    endTime: event.endTime,
    status: "Reserved"
  });

  for (const resource of resources) {
    await Resource.findByIdAndUpdate(resource.resourceId, {
      $inc: { allocatedQuantity: resource.quantity }
    });
    setResourceAvailability(resource.resourceId, event.startTime, event.endTime, {
      resourceId: resource.resourceId,
      allocatedQuantity: resource.quantity,
      availabilityWindow: { startTime: event.startTime, endTime: event.endTime },
      eventId
    });
  }

  setVenueOccupancy(venueId, event.startTime, event.endTime, {
    venueId,
    timeSlot: { startTime: event.startTime, endTime: event.endTime },
    allocatedParticipants: event.participants,
    eventId
  });

  return { ok: true, allocation };
};

export const lockAllocation = async (eventId) => {
  await Allocation.updateMany({ eventId }, { status: "Locked" });
};

export const releaseAllocation = async (eventId) => {
  const allocations = await Allocation.find({ eventId, status: { $ne: "Released" } }).lean();
  for (const allocation of allocations) {
    for (const resource of allocation.resources) {
      await Resource.findByIdAndUpdate(resource.resourceId, {
        $inc: { allocatedQuantity: -resource.quantity }
      });
    }
  }
  await Allocation.updateMany({ eventId }, { status: "Released" });
};

export const suggestAlternatives = async ({ eventId, venueId, resources }) => {
  const event = await Event.findById(eventId).lean();
  if (!event) {
    return [];
  }
  const venues = await Venue.find({ capacity: { $gte: event.participants }, maintenanceMode: false }).lean();
  const alternateVenues = venues.filter((venue) => String(venue._id) !== String(venueId));

  const alternatives = [];

  for (const venue of alternateVenues) {
    const conflict = await detectVenueConflict({
      venueId: venue._id,
      startTime: event.startTime,
      endTime: event.endTime
    });
    if (!conflict) {
      alternatives.push({ type: "AlternateVenue", venueId: venue._id, venueName: venue.name });
    }
  }

  const reducedResourceSuggestions = resources.map((resource) => ({
    type: "ReduceQuantity",
    resourceId: resource.resourceId,
    suggestedQuantity: Math.max(1, Math.floor(resource.quantity * 0.8))
  }));

  alternatives.push(...reducedResourceSuggestions);

  const eventPriority = calculatePriorityScore({
    eventType: event.eventType,
    importance: event.importance,
    department: event.department,
    approvalStage: event.approvalStage
  });

  alternatives.push({ type: "PriorityScore", score: eventPriority });

  return alternatives;
};
