// import express from "express";
// import { adminLogin, checkAdminAuth } from "../controllers/adminController.js";
// import { addFood, listFood, removeFood } from "../controllers/foodController.js";
// import { listOrders, updateStatus } from "../controllers/orderController.js";
// import multer from "multer";

// // Multer setup
// const storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const adminRouter = express.Router();

// adminRouter.post("/login", adminLogin);

// // Protected routes
// adminRouter.post("/add-food", checkAdminAuth, upload.single("image"), addFood);
// adminRouter.get("/list-food", checkAdminAuth, listFood);
// adminRouter.post("/remove-food", checkAdminAuth, removeFood);
// adminRouter.get("/list-orders", checkAdminAuth, listOrders);
// adminRouter.post("/update-status", checkAdminAuth, updateStatus);

// // Add this route for admin frontend to check auth
// adminRouter.get("/check-auth", checkAdminAuth, (req, res) => {
//   res.json({ success: true, message: "Authorized" });
// });

// export default adminRouter;


import express from "express";
import { adminLogin, checkAdminAuth } from "../controllers/adminController.js";
import { addFood, listFood, removeFood, getFoodById, updateFood } from "../controllers/foodController.js";
import { listOrders, updateStatus } from "../controllers/orderController.js";
import multer from "multer";
import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/check-auth", checkAdminAuth);

// Protected admin routes
adminRouter.post("/add-food", adminAuthMiddleware, upload.single("image"), addFood);
adminRouter.get("/list-food", adminAuthMiddleware, listFood);
adminRouter.post("/remove-food", adminAuthMiddleware, removeFood);
adminRouter.get("/food/:id", adminAuthMiddleware, getFoodById);
adminRouter.put("/update-food", adminAuthMiddleware, upload.single("image"), updateFood);

adminRouter.get("/list-orders", adminAuthMiddleware, listOrders);
adminRouter.post("/update-status", adminAuthMiddleware, updateStatus);

export default adminRouter;