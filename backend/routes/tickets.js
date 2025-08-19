import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
const router = express.Router();

//auto assignment function
async function assignAgentAutomatically(){
  const agents = await User.find({ role: "agent" });
   let selectedAgent = null;
  let minTickets = Infinity;

  for(const agent of agents){
    const count = await Ticket.countDocuments({ agentId: agent._id, status: "Open" });
    if(count<minTickets){
      minTickets = count;
      selectedAgent = agent;
    }
  }
  return selectedAgent?._id || null; 
}

router.post("/",auth,async(req,res)=>{
   try{
    const {title,description,priority}=req.body;

    // Auto-assign agent
    const assignedAgentId = await assignAgentAutomatically();

    const ticket = await Ticket.create({
         title, description, priority: priority || "Low",
         customerId: req.user._id,
          agentId: assignedAgentId,
    })
     res.status(201).json(ticket);
   }
   catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/",auth,async(req,res)=>{
    try{
        let query = {};
        if(req.user.role === "customer")
          query.customerId = req.user._id;
        else if (req.user.role === "agent") {
      // Agent sees only tickets assigned to them
      query.agentId = req.user._id;
    }
         const tickets = await Ticket.find(query).populate("customerId", "name email").populate("agentId", "name email").sort({ createdAt: -1 });
        // res.json(tickets);
         res.json(Array.isArray(tickets) ? tickets : []);
    }
    catch (err) {
       res.status(500).json([]);
        // res.status(500).json({ message: err.message });
    }
})

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get single ticket as per id
router.get("/:id",auth,async(req,res)=>{
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }
    try{
        const ticket = await Ticket.findById(req.params.id)
        .populate("customerId", "name email")
        .populate("agentId", "name email")
         .populate("comments.authorId", "name email role")
         

         if (!ticket) return res.status(404).json({ message: "Ticket not found" });

           if (
            req.user.role === "customer" && 
            ticket.customerId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
    }
    res.json(ticket);
    }
    catch(err){
          res.status(500).json({ message: err.message });
    }
});

router.patch("/:id",auth , async(req,res)=>{
  const { id } = req.params;
  if (!validateObjectId(id)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }
    try{
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

         const { action, message, status, assignAgentId ,title, description } = req.body;

         //comment
          if (action === "comment" && message) {
           ticket.comments.push({ authorId: req.user._id, message });
        }
        //edit 
        if (
      action === "edit" &&
      req.user.role === "customer" &&
      ticket.customerId.toString() === req.user._id.toString()
    ) {
      if (ticket.status === "Resolved") {
        return res.status(400).json({ message: "Cannot edit a resolved ticket" });
      }
      
      if (title) ticket.title = title;
      if (description) ticket.description = description;

    }
    if (status) {
      ticket.status = status;
    }
  // --- ASSIGN AGENT ---
     if (assignAgentId && req.user.role === "agent") {
      const agent = await User.findById(assignAgentId);
      if (!agent || agent.role !== "agent") {
        return res.status(400).json({ message: "No such agent id available" });
      }
      ticket.agentId = assignAgentId;
    }

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate("comments.authorId", "name email")
      .populate("agentId", "name email")
      .populate("customerId", "name email");

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/tickets.js
router.patch("/:id/assign", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") return res.status(404).json({ message: "Agent not found" });

    ticket.agentId = agentId;
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id).populate("agentId");
    res.status(200).json(populatedTicket);
  } catch (err) {
      console.error("Assign agent error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;