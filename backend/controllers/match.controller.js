import { getMatchedJobs } from "../services/matchingEngine.js";

export const getMatches = async (req, res) => {
  try {
    const userId = req.params.userId;
    const jobs = await getMatchedJobs(userId);

    res.json({
      matchCount: jobs.length,
      matches: jobs.slice(0, 20) // return top 20 matches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching matched jobs", error: err.message });
  }
};
