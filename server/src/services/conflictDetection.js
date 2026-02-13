import Allocation from "../models/Allocation.js";
import Event from "../models/Event.js";
import Resource from "../models/Resource.js";
import Venue from "../models/Venue.js";

const overlaps = (startA, endA, startB, endB) => startA < endB && startB < endA;

export const detectVenueConflict = async ({ venueId, startTime, endTime }) => {
  const allocations = await Allocation.find({
    venueId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $ne: "Released" }
  })
    .populate("eventId")
    .lean();

  if (allocations.length === 0) {
    return null;
  }

  const venue = await Venue.findById(venueId).lean();
  const conflicts = allocations.map((allocation) => ({
    eventId: allocation.eventId?._id,
    eventTitle: allocation.eventId?.title,
    department: allocation.eventId?.department,
    startTime: allocation.startTime,
    endTime: allocation.endTime
  }));

  return {
    resourceType: "Venue",
    resourceName: venue?.name,
    conflicts
  };
};

export const detectResourceConflict = async ({ resourceId, quantity, startTime, endTime }) => {
  const resource = await Resource.findById(resourceId).lean();
  if (!resource) {
    return null;
  }

  const allocations = await Allocation.find({
    "resources.resourceId": resourceId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $ne: "Released" }
  })
    .populate("eventId")
    .lean();

  const totalAllocated = allocations.reduce((sum, allocation) => {
    const item = allocation.resources.find((res) => String(res.resourceId) === String(resourceId));
    return sum + (item?.quantity ?? 0);
  }, 0);

  if (totalAllocated + quantity <= resource.totalQuantity) {
    return null;
  }

  const conflicts = allocations.map((allocation) => {
    const item = allocation.resources.find((res) => String(res.resourceId) === String(resourceId));
    return {
      eventId: allocation.eventId?._id,
      eventTitle: allocation.eventId?.title,
      department: allocation.eventId?.department,
      startTime: allocation.startTime,
      endTime: allocation.endTime,
      allocatedQuantity: item?.quantity ?? 0
    };
  });

  return {
    resourceType: "Resource",
    resourceName: resource.name,
    totalQuantity: resource.totalQuantity,
    requestedQuantity: quantity,
    allocatedQuantity: totalAllocated,
    conflicts
  };
};

export const buildConflictExplanation = ({ conflict, startTime, endTime }) => {
  if (!conflict) {
    return null;
  }
  if (conflict.resourceType === "Venue") {
    const first = conflict.conflicts[0];
    return `${conflict.resourceName} unavailable from ${new Date(startTime).toLocaleTimeString()}–${
      new Date(endTime).toLocaleTimeString()
    } because Event ${first.eventTitle} (${first.department} Dept) already allocated the venue.`;
  }
  const first = conflict.conflicts[0];
  const available = conflict.totalQuantity - conflict.allocatedQuantity;
  return `${conflict.resourceName} unavailable from ${new Date(startTime).toLocaleTimeString()}–${
    new Date(endTime).toLocaleTimeString()
  } because Event ${first.eventTitle} (${first.department} Dept) already allocated ${
    first.allocatedQuantity
  } units. Only ${available} units exist.`;
};
