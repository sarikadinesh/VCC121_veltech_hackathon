import express from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import Allocation from "../models/Allocation.js";
import Resource from "../models/Resource.js";
import Venue from "../models/Venue.js";
import Event from "../models/Event.js";

const router = express.Router();

router.use(authenticate);

router.get("/summary", authorize("Dean", "InstitutionalHead", "AdminITC"), async (req, res) => {
  const [mostUsedVenue] = await Allocation.aggregate([
    { $group: { _id: "$venueId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  const [mostRequestedResource] = await Allocation.aggregate([
    { $unwind: "$resources" },
    { $group: { _id: "$resources.resourceId", qty: { $sum: "$resources.quantity" } } },
    { $sort: { qty: -1 } },
    { $limit: 1 }
  ]);

  const peakHours = await Event.aggregate([
    { $project: { hour: { $hour: "$startTime" } } },
    { $group: { _id: "$hour", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const venueDoc = mostUsedVenue?._id ? await Venue.findById(mostUsedVenue._id).lean() : null;
  const resourceDoc = mostRequestedResource?._id
    ? await Resource.findById(mostRequestedResource._id).lean()
    : null;

  return res.json({
    mostUsedVenue: venueDoc?.name || "",
    mostRequestedEquipment: resourceDoc?.name || "",
    peakHours,
    resourceUtilizationTrends: [],
    departmentComparison: []
  });
});

export default router;
