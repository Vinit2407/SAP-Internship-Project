import AdminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";

// Create token function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Admin login
// Update the adminLogin function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(admin._id);
    
    // Set cookie for admin token
    res.cookie('adminToken', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      success: true,
      token,
      message: "Admin logged in successfully"
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Check admin authentication
// In adminController.js - enhance checkAdminAuth
const checkAdminAuth = async (req, res, next) => {
  const token = req.headers.token || req.cookies.adminToken;
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.findById(token_decode.id);
    
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export { adminLogin, checkAdminAuth };