<<<<<<< HEAD
import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resume.controller.js";

// Multer config: store files in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const router = express.Router();

// field name must match Postman key
router.post("/upload", upload.single("resume"), uploadResume);

export default router;
=======
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadResume } = require("../controllers/resume.controller.js");
const { protect } = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
>>>>>>> origin/waasila-branch
