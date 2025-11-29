import Job from "../models/Job.js";
import Resume from "../models/Resume.js";

// Compute skill-based match percentage
const computeSkillScore = (jobSkills, userSkills) => {
  if (!jobSkills || jobSkills.length === 0) return 0;
  const matchedSkills = jobSkills.filter(skill =>
    userSkills.includes(skill.toLowerCase())
  );
  return (matchedSkills.length / jobSkills.length);
};

// Main function to fetch ranked jobs for a user
export const getMatchedJobs = async (userId) => {
  // 1️⃣ Fetch user resume
  const resume = await Resume.findOne({ userId });
  
  // If no resume found, return empty array or all jobs without matching
  if (!resume || !resume.parsed || !resume.parsed.skills) {
    console.log("⚠️ No resume found for user, returning all jobs without matching");
    const jobs = await Job.find();
    return jobs.map(job => ({ 
      ...job.toObject(), 
      relevanceScore: 0,
      matchNote: "Upload a resume to see job matches"
    }));
  }

  // Extract user skills from resume
  const userSkills = (resume.parsed.skills || []).map(s => {
    const skillName = typeof s === 'string' ? s : (s.name || s);
    return skillName.toLowerCase();
  });

  if (userSkills.length === 0) {
    console.log("⚠️ No skills found in resume, returning all jobs");
    const jobs = await Job.find();
    return jobs.map(job => ({ 
      ...job.toObject(), 
      relevanceScore: 0,
      matchNote: "No skills found in resume"
    }));
  }

  // 2️⃣ Fetch all jobs from DB
  const jobs = await Job.find();

  // 3️⃣ Compute relevance score for each job
  const rankedJobs = jobs.map(job => {
    const jobSkills = (job.skills || []).map(s => typeof s === 'string' ? s : s.name || s);
    const score = computeSkillScore(jobSkills, userSkills);
    return { ...job.toObject(), relevanceScore: score };
  });

  // 4️⃣ Sort descending by relevance score
  rankedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return rankedJobs;
};
