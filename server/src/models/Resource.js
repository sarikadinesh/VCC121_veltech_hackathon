import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ["Equipment", "Food", "Facility", "ITC"]
    },
    totalQuantity: { type: Number, required: true, min: 0 },
    allocatedQuantity: { type: Number, default: 0 },
    maintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

resourceSchema.index({ category: 1, name: 1 });

export default mongoose.model("Resource", resourceSchema);
