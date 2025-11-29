import { fetchRemotiveJobs } from "./remotiveScrapper.js";
import { fetchArbeitNowJobs } from "./arbeitNowScrapper.js";
import { fetchFindworkJobs } from "./findworkScrapper.js";

// Simulate Job model structure
const mapToJobModel = (job) => ({
  title: job.title || "",
  company: job.company || "",
  location: job.location || "",
  remote: job.remote || false,
  employmentType: job.employmentType || "full-time",
  description: job.description || "",
  url: job.url || "",
  datePosted: job.datePosted || null,
  skills: job.skills || [] // optional, can be empty
});

const TSMJ = async () => {
  try {
    console.log("Fetching Remotive jobs...");
    const remotiveJobs = await fetchRemotiveJobs("python");
    const remotiveJobsMapped = remotiveJobs.map(mapToJobModel);
    console.log(`Remotive jobs mapped: ${remotiveJobsMapped.length}`);
    console.log("Sample job object:", remotiveJobsMapped[0]);

    console.log("\nFetching ArbeitNow jobs...");
    const arbeitJobs = await fetchArbeitNowJobs();
    const arbeitJobsMapped = arbeitJobs.map(mapToJobModel);
    console.log(`ArbeitNow jobs mapped: ${arbeitJobsMapped.length}`);
    console.log("Sample job object:", arbeitJobsMapped[0]);

    console.log("\nFetching Findwork jobs...");
    const findworkJobs = await fetchFindworkJobs("python", "", true); // example: remote Python jobs
    const findworkJobsMapped = findworkJobs.map(mapToJobModel);
    console.log(`Findwork jobs mapped: ${findworkJobsMapped.length}`);
    console.log("Sample job object:", findworkJobsMapped[0]);

    console.log("\n✅ All scrapers returned jobs in Job module format.");
  } catch (err) {
    console.error("Error in job module test:", err);
  }
};

TSMJ();
