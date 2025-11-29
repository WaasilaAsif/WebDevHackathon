// Job Matching Types
export const JobListing = {
  id: '',
  title: '',
  company: '',
  location: '',
  remote: false,
  salary: {
    min: 0,
    max: 0,
    currency: 'USD'
  },
  description: '',
  requirements: [],
  technologies: [],
  experienceLevel: '',
  postedDate: '',
  source: '',
  url: ''
};

export const JobMatch = {
  job: {},
  compatibilityScore: 0,
  matchReasons: [],
  alignedSkills: [],
  missingSkills: [],
  recommendations: ''
};

export const InterviewPrep = {
  id: '',
  userId: '',
  company: '',
  role: '',
  technologies: [],
  createdAt: '',
  status: '', // generating, completed, failed
  materials: {
    technicalQuestions: [],
    behavioralQuestions: [],
    studyGuide: {},
    keyTopics: []
  }
};

export const Question = {
  id: '',
  question: '',
  type: '', // technical, behavioral, situational
  difficulty: '', // easy, medium, hard
  topics: [],
  hints: [],
  sampleAnswer: ''
};