import express from "express";
import { scrapeJobs, getAllJobs } from "../controllers/job.controller.js";

const router = express.Router();

router.get("/scrape", scrapeJobs); // e.g., /api/jobs/scrape?search=python
router.get("/all", getAllJobs);   // get all jobs in DB

export default router;
