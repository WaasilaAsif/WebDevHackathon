import axios from "axios";
import { normalizeJob } from "./normalizeJob.js";

export const fetchRemotiveJobs = async (searchTerm) => {
  try {
    const res = await axios.get(`https://remotive.com/api/remote-jobs?search=${searchTerm}`);
    const jobs = res.data.jobs || [];
    return jobs.map(job => normalizeJob({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      remote: job.job_type.toLowerCase().includes("remote"),
      employmentType: job.job_type.toLowerCase(),
      description: job.description,
      url: job.url
    }, "Remotive"));
  } catch (err) {
    console.error("Error fetching Remotive jobs:", err.message);
    return [];
  }
};
