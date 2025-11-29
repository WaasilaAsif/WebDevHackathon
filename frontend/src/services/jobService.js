import api from './api';

const jobService = {
  // Get matched jobs for user
  getMatchedJobs: async (filters = {}) => {
    try {
      const response = await api.post('/jobs/matches', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job details
  getJobDetails: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Trigger job discovery (scraping)
  discoverJobs: async () => {
    try {
      const response = await api.post('/jobs/discover');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job discovery status
  getDiscoveryStatus: async (discoveryId) => {
    try {
      const response = await api.get(`/jobs/discover/${discoveryId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Save a job for later
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove saved job
  unsaveJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await api.get('/jobs/saved');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark job as applied
  markAsApplied: async (jobId, notes = '') => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, { notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get application history
  getApplicationHistory: async () => {
    try {
      const response = await api.get('/jobs/applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job statistics
  getJobStats: async () => {
    try {
      const response = await api.get('/jobs/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default jobService;