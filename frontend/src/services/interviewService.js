import api, { apiUtils } from './api';

const interviewService = {
  // Generate interview preparation materials
  generateInterviewPrep: async (interviewData) => {
    try {
      const response = await api.post('/interview/generate', interviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get interview prep status
  getInterviewPrepStatus: async (prepId) => {
    try {
      const response = await api.get(`/interview/prep/${prepId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Wait for interview prep generation
  waitForPrep: async (prepId) => {
    try {
      const result = await apiUtils.pollStatus(`/interview/prep/${prepId}/status`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get interview prep details
  getInterviewPrep: async (prepId) => {
    try {
      const response = await api.get(`/interview/prep/${prepId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get interview history
  getInterviewHistory: async () => {
    try {
      const response = await api.get('/interview/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Save practice session
  savePracticeSession: async (prepId, sessionData) => {
    try {
      const response = await api.post(`/interview/prep/${prepId}/practice`, sessionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get practice sessions
  getPracticeSessions: async (prepId) => {
    try {
      const response = await api.get(`/interview/prep/${prepId}/practice`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete interview prep
  deleteInterviewPrep: async (prepId) => {
    try {
      const response = await api.delete(`/interview/prep/${prepId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get company insights
  getCompanyInsights: async (companyName) => {
    try {
      const response = await api.get(`/interview/company/${encodeURIComponent(companyName)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default interviewService;