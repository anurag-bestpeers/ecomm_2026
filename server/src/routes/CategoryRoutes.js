import express from "express";
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/categoryController.js";
import { authorize, protect } from "../middleware/auth.js";
export const categoryRoute = express.Router();

// Public Route

categoryRoute.get("/", getCategory);
categoryRoute.get("/:id", getCategoryById);

// Admin Route

categoryRoute.post("/", protect, authorize('admin'), createCategory);
categoryRoute.put("/:id", protect, authorize('admin'), updateCategory);
categoryRoute.delete("/:id", protect, authorize('admin'), deleteCategory);