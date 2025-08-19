import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/tickets.js";
import kbRoutes from "./routes/kb.js";
import announcementsRoutes from "./routes/announcements.js";
import feedbackRoutes from "./routes/feedback.js";
import  agentsRoutes from "./routes/agents.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api", agentsRoutes);
app.use("/api/faqs", faqRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
   console.log("MongoDB connected");
   app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
})
.catch((err)=>{
    console.error("Mongo connection error:", err);
})