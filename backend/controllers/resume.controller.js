import Resume from "../models/Resume.js";
import User from "../models/User.js";

// Rule-based entity extraction
const extractEntitiesRuleBased = (text) => {
  const nerEntities = {};

  // 1️⃣ Name (first line with capitalized words)
  const nameMatch = text.match(/^([A-Z][a-z]+(?: [A-Z][a-z]+)+)/m);
  nerEntities.name = nameMatch ? nameMatch[1] : "";

  // 2️⃣ Email
  const emailMatch = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  nerEntities.email = emailMatch ? emailMatch[0] : "";

  // 3️⃣ Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  nerEntities.phone = phoneMatch ? phoneMatch[0] : "";

  // 4️⃣ Skills
  const skillKeywords = [
    "JavaScript","Python","Java","Node.js","React","MongoDB","SQL","AWS","Docker",
    "TensorFlow","Kubernetes","HTML","CSS","Express","Redux","PostgreSQL"
  ];
  const foundSkills = skillKeywords.filter(skill => new RegExp(`\\b${skill}\\b`, "i").test(text));

  // Assign a score based on frequency in text
  const skillsWithScore = foundSkills.map(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, "gi");
    const matches = text.match(regex) || [];
    return { name: skill, score: matches.length };
  });

  nerEntities.skills = skillsWithScore;

  // 5️⃣ Companies
  const companyMatches = text.match(/\b[A-Z][a-zA-Z0-9& ]+(?:Inc|LLC|Ltd|Corp)\b/g);
  nerEntities.companies = companyMatches || [];

  return nerEntities;
};

// Rule-based inference of roles, domains, and seniority
const inferRolesAndDomains = (skills, text) => {
  const domains = [];
  const roles = [];
  let seniority = "Junior";

  const skillNames = skills.map(s => s.name);

  // Technical Domains
  if (skillNames.some(s => ["React","HTML","CSS","Redux"].includes(s))) domains.push("Frontend");
  if (skillNames.some(s => ["Node.js","Express","Java"].includes(s))) domains.push("Backend");
  if (skillNames.some(s => ["MongoDB","SQL","PostgreSQL"].includes(s))) domains.push("Database");
  if (skillNames.some(s => ["AWS","Docker","Kubernetes"].includes(s))) domains.push("Cloud/DevOps");
  if (skillNames.some(s => ["TensorFlow"].includes(s))) domains.push("AI/ML");

  // Recommended Roles
  if (domains.includes("Frontend")) roles.push("Frontend Developer");
  if (domains.includes("Backend")) roles.push("Backend Developer");
  if (domains.includes("Database")) roles.push("Database Engineer");
  if (domains.includes("Cloud/DevOps")) roles.push("DevOps Engineer");
  if (domains.includes("AI/ML")) roles.push("ML Engineer");

  // Seniority (basic based on experience keywords)
  if (/5\+|senior|lead|manager/i.test(text)) seniority = "Senior";
  else if (/3\+|mid-level|experienced/i.test(text)) seniority = "Mid-level";

  // Score roles based on matched skill scores
  const roleScores = {};
  roles.forEach(role => {
    let score = 0;
    if (role === "Frontend Developer") score = skills.filter(s => ["React","HTML","CSS","Redux"].includes(s.name)).reduce((a,b) => a+b.score,0);
    if (role === "Backend Developer") score = skills.filter(s => ["Node.js","Express","Java"].includes(s.name)).reduce((a,b) => a+b.score,0);
    if (role === "Database Engineer") score = skills.filter(s => ["MongoDB","SQL","PostgreSQL"].includes(s.name)).reduce((a,b) => a+b.score,0);
    if (role === "DevOps Engineer") score = skills.filter(s => ["AWS","Docker","Kubernetes"].includes(s.name)).reduce((a,b) => a+b.score,0);
    if (role === "ML Engineer") score = skills.filter(s => ["TensorFlow"].includes(s.name)).reduce((a,b) => a+b.score,0);
    roleScores[role] = score;
  });

  // Sort roles by score descending
  const recommendedRoles = Object.entries(roleScores)
    .sort((a,b) => b[1]-a[1])
    .map(r => r[0]);

  return { domains, recommendedRoles, seniority };
};

// Backend now expects extractedText from frontend
export const uploadResume = async (req, res) => {
  try {
    const { extractedText, originalFilename, fileSize } = req.body;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ success: false, error: "No text provided for processing" });
    }

    console.log("📄 Processing resume text from frontend:", extractedText.substring(0, 100) + "...");

    // 1️⃣ Rule-based NER
    const nerEntities = extractEntitiesRuleBased(extractedText);

    // 2️⃣ Infer roles, domains, and seniority with scoring
    const { domains, recommendedRoles, seniority } = inferRolesAndDomains(nerEntities.skills, extractedText);

    const aiParsed = {
      skills: nerEntities.skills,
      topSkills: nerEntities.skills.sort((a,b) => b.score - a.score).slice(0,5),
      recommendedRoles,
      technicalDomains: domains,
      seniority
    };
    console.log(aiParsed);

    // 3️⃣ Save resume to MongoDB
    const resume = await Resume.create({
     userId: req.body.userId || req.user?._id,

      originalFilename: originalFilename || "unknown.pdf",
      fileSize: fileSize || 0,
      extractedText,
      nerEntities,
      parsedData: aiParsed,
      metadata: { processedAt: new Date() }
    });

    // 4️⃣ Update user's profile
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
      message: "Resume processed successfully",
      data: {
        filename: originalFilename,
        textPreview: extractedText.substring(0, 300) + "...",
        nerEntities,
        aiParsed,
        resumeId: resume._id
      }
    });

  } catch (error) {
    console.error("❌ Resume processing error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
