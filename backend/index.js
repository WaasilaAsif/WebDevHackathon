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
import jobRoutes from "./routes/job.routes.js";
import matchRoutes from "./routes/match.routes.js";
import researchRoutes from "./routes/research.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

app.use("/api/jobs", jobRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/interview", interviewRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
