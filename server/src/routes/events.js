import express from "express";
import Event from "../models/Event.js";
import Allocation from "../models/Allocation.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import { calculatePriorityScore } from "../services/priority.js";
import { buildConflictExplanation } from "../services/conflictDetection.js";
import { allocateResources, releaseAllocation, suggestAlternatives } from "../services/allocationEngine.js";
import { processDecision } from "../services/workflow.js";
import { calculateHealthScore, detectRisks } from "../services/healthScore.js";

const router = express.Router();

router.use(authenticate);

router.post("/", authorize("EventCoordinator"), async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      coordinatorId: req.user._id,
      department: req.user.department,
      status: "Draft",
      approvalStage: "EventCoordinator"
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create event" });
  }
});

router.get("/my", authorize("EventCoordinator"), async (req, res) => {
  const events = await Event.find({ coordinatorId: req.user._id }).sort({ startTime: 1 }).lean();
  return res.json(events);
});

router.get("/pending", authorize("HOD", "Dean", "InstitutionalHead"), async (req, res) => {
  const events = await Event.find({ approvalStage: req.user.role, status: "Pending" })
    .populate("coordinatorId", "name email")
    .lean();
  return res.json(events);
});

router.post("/:id/submit", authorize("EventCoordinator"), async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (String(event.coordinatorId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  event.status = "Pending";
  event.approvalStage = "HOD";
  event.priorityScore = calculatePriorityScore({
    eventType: event.eventType,
    importance: event.importance,
    department: event.department,
    approvalStage: event.approvalStage
  });
  await event.save();
  return res.json(event);
});

router.post("/:id/allocate", authorize("EventCoordinator"), async (req, res) => {
  const event = await Event.findById(req.params.id).lean();
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (String(event.coordinatorId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const result = await allocateResources({
    eventId: req.params.id,
    venueId: req.body.venueId,
    resources: req.body.resources || []
  });
  if (!result.ok) {
    const explanation = buildConflictExplanation({
      conflict: result.conflict,
      startTime: event.startTime,
      endTime: event.endTime
    });
    const alternatives = await suggestAlternatives({
      eventId: req.params.id,
      venueId: req.body.venueId,
      resources: req.body.resources || []
    });
    return res.status(409).json({ message: "Allocation conflict", explanation, alternatives });
  }
  return res.json(result.allocation);
});

router.post("/:id/decision", authorize("HOD", "Dean", "InstitutionalHead"), async (req, res) => {
  try {
    const { decision, justification, allocationInput } = req.body;
    const result = await processDecision({
      eventId: req.params.id,
      role: req.user.role,
      decision,
      justification,
      allocationInput
    });
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/:id/complete", authorize("EventCoordinator", "AdminITC"), async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  if (req.user.role === "EventCoordinator" && String(event.coordinatorId) !== String(req.user._id)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  event.status = "Completed";
  await event.save();
  await releaseAllocation(event._id);
  return res.json({ message: "Event closed and resources released" });
});

router.get("/:id/health", authorize("EventCoordinator", "HOD", "Dean", "InstitutionalHead", "AdminITC"), async (req, res) => {
  const event = await Event.findById(req.params.id).lean();
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  const approvalDelayHours = Math.max(0, (Date.now() - new Date(event.createdAt).getTime()) / 3600000);
  const allocation = await Allocation.findOne({ eventId: event._id, status: { $ne: "Released" } }).lean();
  const utilizationRatio = allocation?.resources?.length ? Math.min(1, allocation.resources.length / 5) : 0.2;
  const conflictLikelihood = event.status === "Pending" ? 0.3 : 0.1;
  const riskFlags = detectRisks({
    foodShortage: false,
    equipmentMaxed: utilizationRatio > 0.8,
    venueNearCapacity: event.participants > 0.8 * (event.participants || 1),
    delayedApprovals: approvalDelayHours > 24
  });
  const healthScore = calculateHealthScore({
    approvalDelayHours,
    conflictLikelihood,
    utilizationRatio,
    riskFlags
  });
  return res.json({ healthScore, riskFlags });
});

export default router;
