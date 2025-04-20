import express from "express"
import userAuthMiddleware from "../middleware/userAuthMiddleware.js"
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", userAuthMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", userAuthMiddleware, userOrders);
orderRouter.get("/list", listOrders); // This might need admin auth if only admins should see all orders
orderRouter.post("/status", updateStatus); // This should probably have admin auth

export default orderRouter;