import https from 'https';
import Resume from "../models/Resume.js";
import User from "../models/User.js";

// APILayer API key
const API_KEY = 'KfpjRE60dXHtg34VJwyFoB89ZBXaThUm';

// Parse resume using APILayer
const parseResumeAPI = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'api.apilayer.com',
      path: '/resume_parser/upload',
      headers: {
        'Content-Type': 'application/octet-stream',
        'apikey': API_KEY
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Failed to parse API response'));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
};

// Rule-based entity extraction (same as your previous code)
const extractEntitiesRuleBased = (text) => { /* ...code from previous snippet... */ };
const inferRolesAndDomains = (skills, text) => { /* ...code from previous snippet... */ };

// Backend route
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No PDF uploaded" });

    console.log("📄 Processing resume:", req.file.originalname);

    // 1️⃣ Parse using APILayer
    const parsedResume = await parseResumeAPI(req.file.buffer);
    console.log("✅ Parsed resume data:", parsedResume);

    // 2️⃣ Rule-based enrichment
    const textContent = parsedResume.text || ""; // APILayer usually returns text
    const nerEntities = extractEntitiesRuleBased(textContent);
    const { domains, recommendedRoles, seniority } = inferRolesAndDomains(nerEntities.skills, textContent);

    const aiParsed = {
      skills: nerEntities.skills,
      topSkills: nerEntities.skills.sort((a,b)=>b.score-a.score).slice(0,5),
      recommendedRoles,
      technicalDomains: domains,
      seniority
    };
    console.log("✅ Enriched profile:", aiParsed);

    // 3️⃣ Save in MongoDB
    const resume = await Resume.create({
      userId: req.user?._id || null,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      extractedText: textContent,
      nerEntities,
      parsedData: aiParsed,
      metadata: { processedAt: new Date() }
    });

    // 4️⃣ Update user's profile if user exists
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        resumeProfile: {
          skills: aiParsed.skills.map(s => s.name),
          topSkills: aiParsed.topSkills.map(s => s.name),
          recommendedRoles: aiParsed.recommendedRoles,
          technicalDomains: aiParsed.technicalDomains,
          seniority
        },
        $addToSet: { resumes: resume._id }
      });
    }

    res.json({
      success: true,
      message: "Resume parsed, enriched, and saved successfully",
      data: {
        resumeId: resume._id,
        parsedResume,
        nerEntities,
        aiParsed
      }
    });

  } catch (error) {
    console.error("❌ Resume processing error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
