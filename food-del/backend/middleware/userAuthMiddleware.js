// middleware/userAuthMiddleware.js

import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuthMiddleware = async (req, res, next) => {
  // Check for token in headers, cookies, or query
  const token = req.headers.authorization?.split(' ')[1] || 
                req.cookies.token || 
                req.query.token;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required"
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(token_decode.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default userAuthMiddleware;