import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";  
import dotenv from "dotenv"; 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));


async function createAdmin() {
  try {
    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const admin = new User({
      name: "Website Owner",
      email: "owner@helpdesk.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
