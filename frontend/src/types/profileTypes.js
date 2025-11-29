// User Profile Types
export const UserProfile = {
  id: '',
  email: '',
  fullName: '',
  profileComplete: false,
  createdAt: '',
  updatedAt: ''
};

export const ResumeProfile = {
  userId: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  technicalExpertise: {},
  proficiencyLevels: {},
  lastUpdated: ''
};

export const Skill = {
  name: '',
  category: '',
  proficiencyLevel: '', // beginner, intermediate, advanced, expert
  yearsOfExperience: 0
};

export const Experience = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  technologies: []
};

export const Education = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: ''
};

export const Project = {
  name: '',
  description: '',
  technologies: [],
  url: '',
  highlights: []
};