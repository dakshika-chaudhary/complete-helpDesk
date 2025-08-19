import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export default async function auth(req,res,next){
     const authHeader = req.headers.authorization || "";
     const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
     if (!token) return res.status(401).json({ message: "No token provided" });

     try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Invalid token" });
        req.user = user;
        next();
     }
     catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }

}