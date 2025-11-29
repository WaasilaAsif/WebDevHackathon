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

// Note: Using APILayer parsed data directly, no need for additional extraction

// Backend route
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No PDF uploaded" });

    console.log("📄 Processing resume:", req.file.originalname);

    // 1️⃣ Parse using APILayer
    const parsedResume = await parseResumeAPI(req.file.buffer);
    console.log("✅ Parsed resume data:", parsedResume);

    // 2️⃣ Extract skills from parsed resume
    const textContent = parsedResume.text || ""; // APILayer usually returns text
    
    // Extract skills from APILayer response - handle different formats
    let skillsArray = [];
    if (parsedResume.skills && Array.isArray(parsedResume.skills)) {
      // If skills are already an array of strings
      skillsArray = parsedResume.skills.map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name || skill,
        proficiency: 'intermediate',
        confidenceScore: 0.8
      }));
    } else if (parsedResume.skills && typeof parsedResume.skills === 'object') {
      // If skills is an object, convert to array
      skillsArray = Object.keys(parsedResume.skills).map(skill => ({
        name: skill,
        proficiency: 'intermediate',
        confidenceScore: 0.8
      }));
    }

    // Extract experience from parsed resume
    const experienceArray = (parsedResume.experience || []).map(exp => ({
      company: exp.organization || exp.company || '',
      position: exp.title || exp.position || '',
      startDate: exp.dates?.[0] || exp.startDate || '',
      endDate: exp.dates?.[1] || exp.endDate || '',
      duration: '',
      description: exp.description || '',
      techUsed: []
    }));

    // Extract education from parsed resume
    const educationArray = (parsedResume.education || []).map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || edu.organization || '',
      fieldOfStudy: edu.field || edu.fieldOfStudy || '',
      startYear: edu.startYear || null,
      endYear: edu.endYear || null,
      gpa: edu.gpa || null
    }));

    // Generate insights
    const topSkills = skillsArray.slice(0, 5).map(s => s.name);
    const recommendedRoles = ['Software Developer', 'Full Stack Developer']; // Default roles
    const primaryDomains = ['Web Development', 'Software Engineering']; // Default domains

    console.log("✅ Processed skills:", skillsArray.length);

    // 3️⃣ Save in MongoDB with correct schema structure
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      originalFileUrl: null, // Can be updated if file is stored
      extractedText: textContent,
      parsed: {
        skills: skillsArray,
        experience: experienceArray,
        education: educationArray,
        projects: []
      },
      insights: {
        primaryDomains,
        skillStrengths: topSkills,
        missingSkills: [],
        recommendedRoles
      }
    });

    // 4️⃣ Update user's profile
    await User.findByIdAndUpdate(req.user._id, {
      resumeProfile: {
        skills: skillsArray.map(s => s.name),
        topSkills: topSkills,
        recommendedRoles: recommendedRoles,
        technicalDomains: primaryDomains,
        experienceYears: experienceArray.length
      }
    });

    res.json({
      success: true,
      message: "Resume parsed, enriched, and saved successfully",
      data: {
        resumeId: resume._id,
        parsedResume,
        parsed: resume.parsed,
        insights: resume.insights
      }
    });

  } catch (error) {
    console.error("❌ Resume processing error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
