import express from "express";
import Resource from "../models/Resource.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("EventCoordinator", "HOD", "Dean", "InstitutionalHead", "AdminITC"), async (req, res) => {
  const resources = await Resource.find().lean();
  return res.json(resources);
});

router.post("/", authorize("AdminITC"), async (req, res) => {
  const resource = await Resource.create(req.body);
  return res.status(201).json(resource);
});

router.patch("/:id", authorize("AdminITC"), async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }
  return res.json(resource);
});

export default router;
