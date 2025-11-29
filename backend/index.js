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


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
