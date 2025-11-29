const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadResume } = require("../controllers/resume.controller.js");
const { protect } = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
