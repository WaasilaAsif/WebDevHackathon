import axios from "axios";
import { normalizeJob } from "./normalizeJob.js";

export const fetchGithubJobs = async (searchTerm) => {
  try {
    const res = await axios.get(`https://jobs.github.com/positions.json?description=${searchTerm}&location=remote`);
    const jobs = res.data || [];
    return jobs.map(job => normalizeJob({
      title: job.title,
      company: job.company,
      location: job.location,
      remote: job.location.toLowerCase().includes("remote"),
      employmentType: job.type || "full-time",
      description: job.description,
      url: job.url
    }, "GitHub"));
  } catch (err) {
    console.error("Error fetching GitHub jobs:", err.message);
    return [];
  }
};
