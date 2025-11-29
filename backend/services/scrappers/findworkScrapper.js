import axios from "axios";
import { normalizeJob } from "./normalizeJob.js";

const FINDWORK_API_BASE = "https://findwork.dev/api/jobs/";

export const fetchFindworkJobs = async (search = "", location = "", remote = false, page = 1) => {
  try {
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (remote) params.remote = true;
    params.page = page;

    const res = await axios.get(FINDWORK_API_BASE, {
      params,
      headers: {
        Authorization: `Token ${process.env.FINDWORK_API_KEY}`, // updated variable
      },
      timeout: 10000
    });

    const jobs = res.data.results || [];
    return jobs.map(job => normalizeJob({
      title: job.role || job.title,
      company: job.company_name || job.company || "",
      location: job.location || "",
      remote: job.remote || false,
      employmentType: (job.job_type || job.employment_type || "full-time").toLowerCase(),
      description: job.description || job.text || "",
      url: job.url || job.job_url || "",
      datePosted: job.date_posted || job.published_at || undefined,
    }, "Findwork"));

  } catch (err) {
    console.error("Error fetching Findwork jobs:", err.message);
    return [];
  }
};
