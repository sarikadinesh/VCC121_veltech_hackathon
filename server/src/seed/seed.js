import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import Resource from "../models/Resource.js";
import Event from "../models/Event.js";

dotenv.config();

const run = async () => {
  await connectDb();
  await Promise.all([User.deleteMany({}), Venue.deleteMany({}), Resource.deleteMany({}), Event.deleteMany({})]);

  const passwordHash = await bcrypt.hash("Password@123", 10);

  await User.insertMany([
    { name: "Coord One", email: "coord@uni.edu", passwordHash, role: "EventCoordinator", department: "CSE" },
    { name: "HOD One", email: "hod@uni.edu", passwordHash, role: "HOD", department: "CSE" },
    { name: "Dean One", email: "dean@uni.edu", passwordHash, role: "Dean", department: "Admin" },
    { name: "Head One", email: "head@uni.edu", passwordHash, role: "InstitutionalHead", department: "Admin" },
    { name: "Admin One", email: "admin@uni.edu", passwordHash, role: "AdminITC", department: "ITC" }
  ]);

  const venues = await Venue.insertMany([
    { name: "Main Auditorium", location: "Block A", capacity: 300 },
    { name: "Seminar Hall", location: "Block B", capacity: 120 },
    { name: "Conference Room", location: "Block C", capacity: 60 }
  ]);

  const resources = await Resource.insertMany([
    { name: "Projector", category: "Equipment", totalQuantity: 4 },
    { name: "Microphone", category: "Equipment", totalQuantity: 10 },
    { name: "Laptop", category: "Equipment", totalQuantity: 6 },
    { name: "Tables", category: "Facility", totalQuantity: 50 },
    { name: "Food Packs", category: "Food", totalQuantity: 400 }
  ]);

  await Event.insertMany([
    {
      title: "AI Symposium",
      description: "CSE annual symposium",
      department: "CSE",
      eventType: "Conference",
      importance: 5,
      participants: 200,
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 86400000 + 3 * 3600000),
      status: "Draft",
      approvalStage: "EventCoordinator"
    }
  ]);

  console.log("Seed data inserted");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
