import api, { apiUtils } from './api';

const resumeService = {
  // Upload and analyze resume
  uploadResume: async (file, onProgress) => {
    try {
      const response = await apiUtils.uploadFile('/resume/upload', file, onProgress);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get resume analysis status
  getAnalysisStatus: async (analysisId) => {
    try {
      const response = await api.get(`/resume/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Poll for analysis completion
  waitForAnalysis: async (analysisId) => {
    try {
      const result = await apiUtils.pollStatus(`/resume/analysis/${analysisId}/status`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get user's resume profile
  getResumeProfile: async () => {
    try {
      const response = await api.get('/resume/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get skill analysis
  getSkillAnalysis: async () => {
    try {
      const response = await api.get('/resume/skills/analysis');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update resume profile manually
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/resume/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get resume history
  getResumeHistory: async () => {
    try {
      const response = await api.get('/resume/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a resume analysis
  deleteAnalysis: async (analysisId) => {
    try {
      const response = await api.delete(`/resume/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default resumeService;