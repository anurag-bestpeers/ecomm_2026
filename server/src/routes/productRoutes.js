import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, uploadProductImage } from "../controllers/productController.js";
import { authorize, protect } from "../middleware/auth.js";
export const productRoutes = express.Router();

// Public Routes

productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProductById);

// Admin Routes

productRoutes.post("/", protect, authorize("admin"), createProduct);
productRoutes.put("/:id", protect, authorize("admin"), updateProduct);
productRoutes.delete("/:id", protect, authorize("admin"), deleteProduct);
productRoutes.post("/upload", protect, authorize("admin"), uploadProductImage);