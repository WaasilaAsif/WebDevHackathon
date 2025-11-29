import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },

  // NEW FIELD — Remote / Onsite / Hybrid
  workMode: {
    type: String,
    enum: ["remote", "onsite", "hybrid"],
    default: "onsite",
  },

  // NEW FIELD — Full-time / Part-time / Contract / Internship
  employmentType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "internship"],
    default: "full-time",
  },

  description: {
    type: String,
  },
  requirements: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  salaryRange: {
    min: Number,
    max: Number,
  },
  source: {
    type: String, // e.g., "LinkedIn", "Indeed", "Scraped"
  },
  url: {
    type: String,
  },

  relevanceScore: {
    type: Number,
    default: 0,
  },

  datePosted: {
    type: Date,
    default: Date.now,
  }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
