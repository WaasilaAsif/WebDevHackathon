import { dummyUsers } from "../../dummyData/dummyUsers.js";
import { dummyJobs } from "../../dummyData/dummyJobs.js";

// ------------------------------
// In-memory matching engine
// ------------------------------
const computeSkillScore = (jobSkills, userSkills) => {
  if (!jobSkills || jobSkills.length === 0) return 0;
  const matchedSkills = jobSkills.filter(skill =>
    userSkills.includes(skill.toLowerCase())
  );
  return (matchedSkills.length / jobSkills.length);
};

const getMatchedJobsInMemory = (userId, users, jobs) => {
  const user = users.find(u => u._id === userId);
  if (!user) throw new Error("User not found");

  const userSkills = user.parsedResume.skills.map(s => s.name.toLowerCase());

  const rankedJobs = jobs.map(job => {
    const score = computeSkillScore(job.skills, userSkills);
    return { ...job, relevanceScore: score };
  });

  // Sort descending by relevance
  rankedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return rankedJobs;
};

// ------------------------------
// Run test for Alice
// ------------------------------
const matches = getMatchedJobsInMemory(
  "64f1a1f1e1f1a1f1a1f1a1f1",
  dummyUsers,
  dummyJobs
);

console.log("Top matches for Alice:\n", matches);
