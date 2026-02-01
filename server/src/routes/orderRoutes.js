import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Create new order
router.post("/", createOrder);

// Get logged in user's orders
router.get("/myorders", getMyOrders);

// Get all orders (admin only)
router.get("/", authorize("admin"), getAllOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status (admin only)
router.put("/:id/status", authorize("admin"), updateOrderStatus);

export default router;
