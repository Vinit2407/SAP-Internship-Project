import express from "express"
import { addToCart, removeFromCart, getCart, clearCart  } from "../controllers/cartController.js"
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const cartRouter = express.Router();

cartRouter.get("/get", userAuthMiddleware, getCart); // Changed from POST to GET
cartRouter.post("/add", userAuthMiddleware, addToCart);
cartRouter.post("/remove", userAuthMiddleware, removeFromCart);
cartRouter.post("/clear", userAuthMiddleware, clearCart);

export default cartRouter;