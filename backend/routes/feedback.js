import express from "express";
import auth from "../middleware/auth.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// POST feedback
router.post("/", auth, async (req, res) => {
  try {
    const { ticketId, rating, comments } = req.body;
    if (!rating || !comments) {
      return res.status(400).json({ message: "Missing rating or comments" });
    }

    const fb = await Feedback.create({
      ticketId: ticketId || null,
      rating,
      comments,
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role
    });

    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all feedbacks (admin only)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view feedbacks" });
    }

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
