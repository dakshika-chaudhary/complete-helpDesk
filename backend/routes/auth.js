import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/register",async(req,res)=>{
    try{
        const {name,email,password,role} = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({message: "Email already in use"});
        const hashed = await bcrypt.hash(password, 10);

       const user = await User.create({ 
        name,
        email,
        password: hashed,
        role: role || "customer" 
    });
       
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
     res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    }
    catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login",async(req,res)=>{
    try{
        const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });

    }
    catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


export default router;