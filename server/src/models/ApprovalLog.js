import mongoose from "mongoose";

const approvalLogSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    role: {
      type: String,
      required: true,
      enum: ["EventCoordinator", "HOD", "Dean", "InstitutionalHead"]
    },
    decision: { type: String, required: true, enum: ["Approved", "Rejected", "Returned"] },
    timestamp: { type: Date, default: Date.now },
    justification: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("ApprovalLog", approvalLogSchema);
