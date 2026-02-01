import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update cart item quantity
router.put("/item/:productId", updateCartItem);

// Remove item from cart
router.delete("/item/:productId", removeFromCart);

// Clear cart
router.delete("/", clearCart);

export default router;
