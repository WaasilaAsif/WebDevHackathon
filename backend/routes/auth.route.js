import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetForgotPassword,
  getMe,
  googleCallback
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetForgotPassword);
router.get("/me", protectRoute, getMe);
//router.get("/google/callback", googleCallback);

export default router;

