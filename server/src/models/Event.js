import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    department: { type: String, required: true, index: true },
    eventType: { type: String, required: true },
    importance: { type: Number, required: true, min: 1, max: 5 },
    participants: { type: Number, required: true, min: 1 },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Pending", "Approved", "Rejected", "Completed"],
      default: "Draft"
    },
    coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalStage: {
      type: String,
      enum: ["EventCoordinator", "HOD", "Dean", "InstitutionalHead"],
      default: "EventCoordinator"
    },
    priorityScore: { type: Number, default: 0 },
    riskFlags: { type: [String], default: [] },
    healthScore: { type: String, enum: ["Green", "Yellow", "Red"], default: "Green" }
  },
  { timestamps: true }
);

eventSchema.index({ startTime: 1, endTime: 1 });

eventSchema.index({ department: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Event", eventSchema);
