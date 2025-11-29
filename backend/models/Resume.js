import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalFileUrl: String,
    extractedText: String,
    parsed: {
      skills: [
        { name: String, proficiency: String, confidenceScore: Number }
      ],
      experience: [
        { company: String, position: String, startDate: String, endDate: String, duration: String, description: String, techUsed: [String] }
      ],
      education: [
        { degree: String, institution: String, fieldOfStudy: String, startYear: Number, endYear: Number, gpa: Number }
      ],
      projects: [
        { name: String, description: String, technologies: [String], link: String }
      ]
    },
    insights: {
      primaryDomains: [String],
      skillStrengths: [String],
      missingSkills: [String],
      recommendedRoles: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);
