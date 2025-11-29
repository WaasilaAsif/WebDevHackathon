import { fetchRemotiveJobs } from "../../services/scrappers/remotiveScrapper.js";
import { fetchArbeitNowJobs } from "../../services/scrappers/arbeitNowScrapper.js";
import { fetchFindworkJobs } from "../../services/scrappers/findworkScrapper.js";

const srcTest = async () => {
  try {
    console.log("Fetching Remotive jobs...");
    const remotiveJobs = await fetchRemotiveJobs("python");
    console.log(`Remotive jobs fetched: ${remotiveJobs.length}`);
    console.log("Sample URLs:", remotiveJobs.slice(0, 5).map(j => j.url));

    console.log("\nFetching ArbeitNow jobs...");
    const arbeitJobs = await fetchArbeitNowJobs();
    console.log(`ArbeitNow jobs fetched: ${arbeitJobs.length}`);
    console.log("Sample URLs:", arbeitJobs.slice(0, 5).map(j => j.url));

    console.log("\nFetching Findwork jobs...");
    const findworkJobs = await fetchFindworkJobs("python", "", true); // example: remote Python jobs
    console.log(`Findwork jobs fetched: ${findworkJobs.length}`);
    console.log("Sample URLs:", findworkJobs.slice(0, 5).map(j => j.url));

    console.log("\n✅ All scrapers ran successfully and URLs generated.");
  } catch (err) {
    console.error("Error in scraper test:", err);
  }
};

srcTest();
