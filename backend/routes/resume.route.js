import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resume.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", protect, upload.single("resume"), uploadResume);

export default router;
