import ApprovalLog from "../models/ApprovalLog.js";
import Event from "../models/Event.js";
import { auditLog } from "../utils/auditLogger.js";
import { allocateResources, lockAllocation, releaseAllocation } from "./allocationEngine.js";

const ORDER = ["EventCoordinator", "HOD", "Dean", "InstitutionalHead"];

export const getNextStage = (currentStage) => {
  const idx = ORDER.indexOf(currentStage);
  return idx >= 0 && idx < ORDER.length - 1 ? ORDER[idx + 1] : null;
};

export const processDecision = async ({ eventId, role, decision, justification, allocationInput }) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.approvalStage !== role) {
    throw new Error("Invalid approval stage");
  }

  await ApprovalLog.create({
    eventId,
    role,
    decision,
    justification
  });

  auditLog("approval-decision", { eventId, role, decision, justification });

  if (decision === "Rejected") {
    event.status = "Rejected";
    event.approvalStage = "EventCoordinator";
    await releaseAllocation(eventId);
    await event.save();
    return event;
  }

  if (decision === "Returned") {
    event.status = "Draft";
    event.approvalStage = "EventCoordinator";
    await releaseAllocation(eventId);
    await event.save();
    return event;
  }

  const nextStage = getNextStage(role);
  if (nextStage) {
    event.status = "Pending";
    event.approvalStage = nextStage;
    await event.save();
    return event;
  }

  event.status = "Approved";
  event.approvalStage = "InstitutionalHead";
  await event.save();

  if (allocationInput) {
    const allocationResult = await allocateResources(allocationInput);
    if (!allocationResult.ok) {
      event.status = "Rejected";
      event.approvalStage = "EventCoordinator";
      await event.save();
      return { event, allocationResult };
    }
  }

  await lockAllocation(eventId);

  return event;
};
