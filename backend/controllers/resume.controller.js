import Resume from "../models/Resume.js";
import User from "../models/User.js";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    // 1️⃣ Extract PDF text
    const { text: extractedText } = await pdfParse(req.file.buffer);

    // 2️⃣ AI Resume Parsing
    const prompt = `
Extract the following from this resume:
- Skills with proficiency levels (Beginner/Intermediate/Advanced)
- Work experience with company, position, duration, tech used
- Education (degree, institution, field, GPA)
- Projects (name, description, tech stack, link)
- Technical domains and skill strengths
- Suggested missing skills and recommended roles
Return JSON only.
Resume Text:
${extractedText}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const parsedJSON = JSON.parse(aiResponse.choices[0].message.content);

    // 3️⃣ Save Resume
    const resume = await Resume.create({
      userId: req.user._id,
      extractedText,
      parsed: parsedJSON,
      insights: {
        primaryDomains: parsedJSON.primaryDomains || [],
        skillStrengths: parsedJSON.skillStrengths || [],
        missingSkills: parsedJSON.missingSkills || [],
        recommendedRoles: parsedJSON.recommendedRoles || []
      }
    });

    // 4️⃣ Update User Profile
    await User.findByIdAndUpdate(req.user._id, {
      resumeProfile: {
        skills: parsedJSON.skills.map(s => s.name),
        topSkills: parsedJSON.skillStrengths,
        recommendedRoles: parsedJSON.recommendedRoles,
        technicalDomains: parsedJSON.primaryDomains
      }
    });

    res.json({ message: "Resume processed with AI successfully", resume });

  } catch (err) {
    console.error("AI Resume Error:", err);
    res.status(500).json({ error: "Resume AI processing failed" });
  }
};
