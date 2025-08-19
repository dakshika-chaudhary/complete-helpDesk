import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, default: "General" } 
  },
  { timestamps: true }
);

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);

export default Announcement;