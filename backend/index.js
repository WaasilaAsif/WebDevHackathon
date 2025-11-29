import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { connectDB } from "./config/dbconfig.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
connectDB();
app.use(cors());

// Import all routes
import jobRoutes from "./routes/job.routes.js";
import matchRoutes from "./routes/match.routes.js";
import resumeRoutes from "./routes/resume.route.js";
import researchRoutes from "./routes/research.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import authRoutes from "./routes/auth.route.js";

// Register all routes
app.use("/api/jobs", jobRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
