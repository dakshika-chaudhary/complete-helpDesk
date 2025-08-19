import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  ticketId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Ticket" 
  }, // optional now
  rating: { 
    type: Number, 
    min: 1, 
    max: 5,
    required: true
  },
  comments: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  role: String
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
