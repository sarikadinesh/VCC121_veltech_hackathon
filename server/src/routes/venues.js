import express from "express";
import Venue from "../models/Venue.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("EventCoordinator", "HOD", "Dean", "InstitutionalHead", "AdminITC"), async (req, res) => {
  const venues = await Venue.find().lean();
  return res.json(venues);
});

router.post("/", authorize("AdminITC"), async (req, res) => {
  const venue = await Venue.create(req.body);
  return res.status(201).json(venue);
});

router.patch("/:id", authorize("AdminITC"), async (req, res) => {
  const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!venue) {
    return res.status(404).json({ message: "Venue not found" });
  }
  return res.json(venue);
});

export default router;
