import { dummyUsers } from "./dummyData.js";
import { dummyJobs } from "./dummyData.js";
import { getMatchedJobs } from "../services/matchingEngine.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

// Example: insert dummy jobs
await Job.insertMany(dummyJobs);

// Example: insert dummy resumes
await Resume.insertMany(dummyUsers.map(u => ({
  userId: u._id,
  parsed: u.parsedResume
})));

// Example: get matches for Alice
const matches = await getMatchedJobs("64f1a1f1e1f1a1f1a1f1a1f1");
console.log(matches);
