// Resume Analysis Types
export const ResumeAnalysis = {
  id: '',
  userId: '',
  fileName: '',
  uploadedAt: '',
  status: '', // processing, completed, failed
  extractedData: {
    skills: [],
    experience: [],
    education: [],
    projects: [],
    summary: ''
  },
  insights: {
    strengthAreas: [],
    gapAreas: [],
    suggestions: []
  }
};

export const SkillAnalysis = {
  skillName: '',
  category: '',
  proficiency: '',
  demandLevel: '', // high, medium, low
  relatedJobs: []
};

export const ResumeUploadStatus = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
};