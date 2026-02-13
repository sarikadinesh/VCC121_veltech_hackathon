import express from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import Event from "../models/Event.js";
import Resource from "../models/Resource.js";
import Venue from "../models/Venue.js";
import Allocation from "../models/Allocation.js";
import { releaseAllocation } from "../services/allocationEngine.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize("AdminITC"));

router.post("/force-release/:eventId", async (req, res) => {
  await releaseAllocation(req.params.eventId);
  await Event.findByIdAndUpdate(req.params.eventId, { status: "Completed" });
  return res.json({ message: "Resources released" });
});

router.post("/simulate", async (req, res) => {
  const { venueId, resourceId, reducedQuantity, timeExtensionMinutes } = req.body;
  const impactedEvents = [];

  if (venueId) {
    const allocations = await Allocation.find({ venueId, status: { $ne: "Released" } }).lean();
    impactedEvents.push(...allocations.map((a) => a.eventId));
  }

  if (resourceId) {
    const allocations = await Allocation.find({ "resources.resourceId": resourceId, status: { $ne: "Released" } }).lean();
    impactedEvents.push(...allocations.map((a) => a.eventId));
  }

  const events = await Event.find({ _id: { $in: impactedEvents } }).lean();

  return res.json({
    simulated: true,
    reducedQuantity: reducedQuantity ?? null,
    timeExtensionMinutes: timeExtensionMinutes ?? null,
    impactedEvents: events
  });
});

router.patch("/resource/:id/maintenance", async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, { maintenanceMode: req.body.maintenanceMode }, { new: true });
  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }
  return res.json(resource);
});

router.patch("/venue/:id/maintenance", async (req, res) => {
  const venue = await Venue.findByIdAndUpdate(req.params.id, { maintenanceMode: req.body.maintenanceMode }, { new: true });
  if (!venue) {
    return res.status(404).json({ message: "Venue not found" });
  }
  return res.json(venue);
});

export default router;
