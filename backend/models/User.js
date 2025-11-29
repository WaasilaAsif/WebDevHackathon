import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },

  password: {
    type: String,
    minlength: 8,
  },

  username: {
    type: String,
    unique: true,
    sparse: true, // allows username to be empty initially
  },

  profilePic: {
    type: String,
    default: "",
  },

  profilePicId: {
    type: String,
  },

  isOnboarded: {
    type: Boolean,
    default: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: String,
  verificationTokenExpires: Date,

  googleId: {
    type: String,
  },

  passwordResetToken: String,
  passwordResetExpires: Date,



  // User's main university
  university: {
    type: String,
    trim: true,
  },

  // GPA (supports decimal values like 3.87)
  gpa: {
    type: Number,
    min: 0,
    max: 4.0,
  },

  // List of education entries (useful for resumes)
  education: [
    {
      degree: { type: String, trim: true },
      fieldOfStudy: { type: String, trim: true },
      institution: { type: String, trim: true },
      startYear: Number,
      endYear: Number,
    }
  ],

  // User's skills as tags (ex: ["React", "Node.js", "MongoDB"])
  skills: {
    type: [String],
    default: [],
  },


  resumeProfile: {
  skills: [String],
  topSkills: [String],
  experienceYears: Number,
  recommendedRoles: [String],
  technicalDomains: [String], // e.g. Backend / Mobile / Cloud
},
}, { timestamps: true });


// Hash password before saving (only if password exists and is modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false; // Google users have no password
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields when returning user object
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
