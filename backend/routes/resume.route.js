import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resume.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

// Multer config: store files in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const router = express.Router();

// field name must match Postman key
router.post("/upload", protectRoute, upload.single("resume"), uploadResume);

export default router;
