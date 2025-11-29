import api from './api';

const interviewService = {
  // Generate interview preparation
  generateInterviewPrep: async (interviewData) => {
    try {
      const response = await api.post('/interview/generate', interviewData);
      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate interview prep');
      }

      return result.data; // contains prepId and prep
    } catch (error) {
      console.error('❌ Generate prep API error:', error);
      throw error;
    }
  },

  // Get full interview prep by ID
  getInterviewPrep: async (prepId) => {
    try {
      const response = await api.get(`/interview/prep/${prepId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Get prep error:', error);
      throw error;
    }
  },

  // Get interview prep history
  getInterviewHistory: async () => {
    try {
      const response = await api.get('/interview/history');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ History error:', error);
      throw error;
    }
  },

  // Delete a prep
  deleteInterviewPrep: async (prepId) => {
    try {
      const response = await api.delete(`/interview/prep/${prepId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Delete prep error:', error);
      throw error;
    }
  },

  // WAIT for interview prep (no async generation)
  waitForPrep: async (prepId) => {
    try {
      const response = await api.get(`/interview/prep/${prepId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Wait error:', error);
      throw error;
    }
  },

  // OPTIONAL: fallback static company insights since backend doesn't provide this
  getCompanyInsights: async (companyName) => {
    return {
      company: companyName,
      summary: `${companyName} is a well-known company.`,
      interviewProcess: ['Phone screen', 'Technical interview'],
      commonQuestions: [
        'Tell me about yourself.',
        `Why do you want to work at ${companyName}?`,
      ],
      techStack: [],
      culture: 'Collaborative and growth-oriented',
      tips: ['Research the company website', 'Know the job role'],
    };
  },

  // OPTIONAL: placeholder since backend has no research route
  getDeepResearch: async (companyName, role) => {
    return {
      company: companyName,
      role,
      insights: `Deep research is not enabled on backend yet.`,
    };
  },
};

export default interviewService;
