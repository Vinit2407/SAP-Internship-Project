// import jwt from "jsonwebtoken"

// const authMiddleware = async (req, res, next) => {
//     const token = req.headers.token || req.cookies.adminToken;
      
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not Authorized" });
//     }
  
//     try {
//       const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//       const admin = await AdminModel.findById(token_decode.id);
      
//       if (!admin) {
//         return res.status(401).json({ success: false, message: "Admin not found" });
//       }
  
//       req.admin = admin;
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// }

// export default authMiddleware;

import jwt from "jsonwebtoken";
import AdminModel from "../models/adminModel.js";

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.cookies.adminToken;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Admin not authorized" 
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminModel.findById(token_decode.id);
    
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Admin not found" 
      });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid admin token" 
    });
  }
}

export default adminAuthMiddleware;