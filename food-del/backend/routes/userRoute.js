import express from "express";
import { 
  loginUser, 
  registeruser, 
  getProfile, 
  updateProfile, 
  getUser 
} from "../controllers/userController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registeruser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.get("/", userAuthMiddleware, getUser);
userRouter.get("/profile", userAuthMiddleware, getProfile);
userRouter.put("/profile", userAuthMiddleware, updateProfile);

export default userRouter;