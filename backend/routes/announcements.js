import express from "express";
import Announcement from "../models/Announcement.js";
const router = express.Router();

// GET all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 }); // newest first
    res.status(200).json(announcements); // return array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const newAnnouncement = new Announcement({ title, description, type });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;