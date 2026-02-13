import mongoose from "mongoose";

const occupancyStateSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["Venue", "Resource"] },
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    timeSlot: {
      startTime: { type: Date },
      endTime: { type: Date }
    },
    allocatedParticipants: { type: Number, default: 0 },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    totalQuantity: { type: Number, default: 0 },
    allocatedQuantity: { type: Number, default: 0 },
    availabilityWindow: {
      startTime: { type: Date },
      endTime: { type: Date }
    }
  },
  { timestamps: true }
);

occupancyStateSchema.index({ venueId: 1, "timeSlot.startTime": 1, "timeSlot.endTime": 1 });
occupancyStateSchema.index({ resourceId: 1, "availabilityWindow.startTime": 1, "availabilityWindow.endTime": 1 });

export default mongoose.model("OccupancyState", occupancyStateSchema);
