import axios from "axios";
import { normalizeJob } from "./normalizeJob.js";

export const fetchArbeitNowJobs = async () => {
  try {
    const res = await axios.get("https://api.arbeitnow.com/api/job-board-api");
    const jobs = res.data.data || [];
    return jobs.map(job => normalizeJob({
      title: job.title,
      company: job.company,
      location: job.location,
      remote: job.remote ? true : false,
      employmentType: job.tags?.[0] || "full-time",
      description: job.description,
      url: job.url
    }, "ArbeitNow"));
  } catch (err) {
    console.error("Error fetching ArbeitNow jobs:", err.message);
    return [];
  }
};
