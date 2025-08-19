import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/agents", auth, async (req, res) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const agents = await User.find({ role: "agent" }).select("-password");
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;