import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
    resources: [
      {
        resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
        quantity: { type: Number, min: 0 }
      }
    ],
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["Reserved", "Locked", "Released"],
      default: "Reserved"
    }
  },
  { timestamps: true }
);

allocationSchema.index({ venueId: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Allocation", allocationSchema);
