import api from './api';

// Helper to get current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return null;
};

const jobService = {
  // Get matched jobs for user
  getMatchedJobs: async (filters = {}) => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.get(`/match/match/${userId}`);
      const matches = response.data.matches || [];
      
      // Transform backend response to match frontend expectations
      return {
        jobs: matches.map(job => ({
          id: job._id || job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          remote: job.remote || false,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements || [],
          technologies: job.technologies || job.skills || [],
          experienceLevel: job.experienceLevel,
          postedDate: job.postedDate || job.createdAt,
          source: job.source,
          url: job.url || job.link,
          matchScore: Math.round((job.relevanceScore || 0) * 100),
          compatibilityScore: Math.round((job.relevanceScore || 0) * 100),
          matchReasons: job.matchReasons || [],
          alignedSkills: job.alignedSkills || [],
          missingSkills: job.missingSkills || []
        })),
        total: response.data.matchCount || matches.length,
        filters: filters
      };
    } catch (error) {
      console.error('Error fetching matched jobs:', error);
      throw error;
    }
  },

  // Get job details - fetch from all jobs
  getJobDetails: async (jobId) => {
    try {
      // Get all jobs and find the one with matching ID
      const response = await api.get('/jobs/all');
      const jobs = response.data || [];
      const job = jobs.find(j => (j._id || j.id) === jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      return {
        id: job._id || job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote || false,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements || [],
        technologies: job.technologies || job.skills || [],
        experienceLevel: job.experienceLevel,
        postedDate: job.postedDate || job.createdAt,
        source: job.source,
        url: job.url || job.link
      };
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Trigger job discovery (scraping)
  discoverJobs: async (searchTerm = '') => {
    try {
      const response = await api.get(`/jobs/scrape${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error discovering jobs:', error);
      throw error;
    }
  },

  // Get job discovery status - not implemented in backend yet
  getDiscoveryStatus: async (discoveryId) => {
    try {
      // Backend doesn't have this endpoint yet, return a mock response
      return {
        status: 'completed',
        message: 'Job discovery completed'
      };
    } catch (error) {
      throw error;
    }
  },

  // Save a job for later - not implemented in backend yet
  saveJob: async (jobId) => {
    try {
      // Store in localStorage as fallback until backend implements this
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      }
      return { success: true, jobId };
    } catch (error) {
      throw error;
    }
  },

  // Remove saved job - not implemented in backend yet
  unsaveJob: async (jobId) => {
    try {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const updated = savedJobs.filter(id => id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(updated));
      return { success: true, jobId };
    } catch (error) {
      throw error;
    }
  },

  // Get saved jobs - not implemented in backend yet
  getSavedJobs: async () => {
    try {
      const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const allJobsResponse = await api.get('/jobs/all');
      const allJobs = allJobsResponse.data || [];
      
      const savedJobs = allJobs
        .filter(job => savedJobIds.includes(job._id || job.id))
        .map(job => ({
          id: job._id || job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          remote: job.remote || false,
          salary: job.salary,
          description: job.description,
          requirements: job.requirements || [],
          technologies: job.technologies || job.skills || [],
          experienceLevel: job.experienceLevel,
          postedDate: job.postedDate || job.createdAt,
          source: job.source,
          url: job.url || job.link
        }));
      
      return {
        jobs: savedJobs,
        total: savedJobs.length
      };
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return { jobs: [], total: 0 };
    }
  },

  // Mark job as applied - not implemented in backend yet
  markAsApplied: async (jobId, notes = '') => {
    try {
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (!appliedJobs.find(app => app.jobId === jobId)) {
        appliedJobs.push({
          jobId,
          notes,
          appliedAt: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      }
      return { success: true, jobId, notes, appliedAt: new Date().toISOString() };
    } catch (error) {
      throw error;
    }
  },

  // Get application history - not implemented in backend yet
  getApplicationHistory: async () => {
    try {
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      const allJobsResponse = await api.get('/jobs/all');
      const allJobs = allJobsResponse.data || [];
      
      const applications = appliedJobs.map(app => {
        const job = allJobs.find(j => (j._id || j.id) === app.jobId);
        return {
          jobId: app.jobId,
          jobTitle: job?.title || 'Unknown',
          company: job?.company || 'Unknown',
          appliedAt: app.appliedAt,
          status: app.status || 'pending',
          notes: app.notes
        };
      });
      
      return {
        applications,
        total: applications.length
      };
    } catch (error) {
      console.error('Error fetching application history:', error);
      return { applications: [], total: 0 };
    }
  },

  // Get job statistics
  getJobStats: async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.get(`/match/match/${userId}`);
      const matches = response.data.matches || [];
      
      const experienceLevels = matches.reduce((acc, job) => {
        const level = job.experienceLevel || 'unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});
      
      const avgScore = matches.length > 0
        ? Math.round(matches.reduce((sum, j) => sum + (j.relevanceScore || 0) * 100, 0) / matches.length)
        : 0;
      
      return {
        totalMatched: matches.length,
        averageMatchScore: avgScore,
        topSkills: [], // Could be extracted from resume
        experienceLevels: {
          entry: experienceLevels.entry || 0,
          mid: experienceLevels.mid || 0,
          senior: experienceLevels.senior || 0,
          lead: experienceLevels.lead || 0
        },
        remoteJobs: matches.filter(j => j.remote).length,
        totalJobs: matches.length
      };
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  },
};

export default jobService;