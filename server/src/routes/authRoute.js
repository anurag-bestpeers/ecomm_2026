import express from "express";
import { getMe, loginController, registerController } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", protect, getMe);