import AdminModel from "./models/adminModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: './.env' }); // adjust path if needed

console.log("Connecting to:", process.env.MONGO_URI); // debug

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminEmail = "vp@gmail.com"; // Change if needed
    const adminPassword = "12345";       // Change if needed
    
    const existingAdmin = await AdminModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const newAdmin = new AdminModel({
      email: adminEmail,
      password: adminPassword 
    });
    
    await newAdmin.save();
    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
