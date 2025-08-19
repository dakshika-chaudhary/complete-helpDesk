import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  authorId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User" 
    },
  message: String,
  createdAt: { 
    type: Date,
     default: Date.now
     },
});

const ticketSchema = new mongoose.Schema({
  title: {
     type: String, 
     required: true 
    },
  description: String,
  priority: { 
    type: String, 
    enum: ["Low", "Medium", "High"], 
    default: "Low"
 },
  status: { 
    type: String,
     enum: ["Open", "In Progress", "Resolved"], 
     default: "Open" 
    },
  customerId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       required: true
     },
    
  agentId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", 
     default: null
     },
  comments: [commentSchema],
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);