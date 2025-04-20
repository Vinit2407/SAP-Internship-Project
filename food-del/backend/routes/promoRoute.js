import express from "express";
import { validatePromoCode } from "../controllers/promoController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";

const router = express.Router();

router.post("/validate", userAuthMiddleware, validatePromoCode);

export default router;