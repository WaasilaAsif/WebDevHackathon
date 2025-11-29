import api from './api';

// MOCK MODE
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Mock data storage
const mockStorage = {
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
};

// Generate mock jobs
const generateMockJobs = () => {
  if (mockStorage.jobs.length === 0) {
    mockStorage.jobs = [
      {
        id: 'job_1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'Remote',
        remote: true,
        salary: { min: 120000, max: 160000, currency: 'USD' },
        description: 'We are looking for an experienced frontend developer to join our team...',
        requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
        technologies: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'AWS'],
        experienceLevel: 'senior',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'LinkedIn',
        url: 'https://linkedin.com/jobs/view/123456',
        matchScore: 92,
        matchReasons: ['Strong React experience', 'TypeScript expertise', 'Node.js background'],
        alignedSkills: ['React', 'TypeScript', 'JavaScript'],
        missingSkills: ['AWS Certification']
      },
      {
        id: 'job_2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        remote: false,
        salary: { min: 100000, max: 140000, currency: 'USD' },
        description: 'Join our fast-growing startup as a full stack engineer...',
        requirements: ['React', 'Node.js', 'MongoDB', 'Docker'],
        technologies: ['React', 'Node.js', 'MongoDB', 'Docker', 'Kubernetes'],
        experienceLevel: 'mid',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Indeed',
        url: 'https://indeed.com/job/789012',
        matchScore: 85,
        matchReasons: ['Full-stack background', 'React and Node.js experience'],
        alignedSkills: ['React', 'Node.js', 'JavaScript'],
        missingSkills: ['Docker', 'Kubernetes']
      },
      {
        id: 'job_3',
        title: 'Python Developer',
        company: 'DataTech Solutions',
        location: 'San Francisco, CA',
        remote: true,
        salary: { min: 110000, max: 150000, currency: 'USD' },
        description: 'Looking for a Python developer with data science experience...',
        requirements: ['Python', 'SQL', 'Machine Learning', 'AWS'],
        technologies: ['Python', 'SQL', 'Machine Learning', 'AWS', 'Docker'],
        experienceLevel: 'mid',
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Glassdoor',
        url: 'https://glassdoor.com/job/345678',
        matchScore: 78,
        matchReasons: ['Python experience', 'SQL knowledge'],
        alignedSkills: ['Python', 'SQL'],
        missingSkills: ['Machine Learning', 'AWS']
      }
    ];
  }
  return mockStorage.jobs;
};

const jobService = {
  // Get matched jobs for user
  getMatchedJobs: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const jobs = generateMockJobs();
      return {
        jobs: jobs.map(job => ({
          ...job,
          compatibilityScore: job.matchScore,
          recommendations: `Based on your skills, you're a strong match for this ${job.experienceLevel} level position.`
        })),
        total: jobs.length,
        filters: filters
      };
    }
    
    try {
      const response = await api.post('/jobs/matches', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job details
  getJobDetails: async (jobId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobs = generateMockJobs();
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        return job;
      }
      throw new Error('Job not found');
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const jobs = generateMockJobs();
      const job = jobs.find(j => j.id === jobId);
      if (job && !mockStorage.savedJobs.includes(jobId)) {
        mockStorage.savedJobs.push(jobId);
      }
      return { success: true, jobId };
    }
    
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove saved job
  unsaveJob: async (jobId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockStorage.savedJobs = mockStorage.savedJobs.filter(id => id !== jobId);
      return { success: true, jobId };
    }
    
    try {
      const response = await api.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobs = generateMockJobs();
      return {
        jobs: jobs.filter(j => mockStorage.savedJobs.includes(j.id)),
        total: mockStorage.savedJobs.length
      };
    }
    
    try {
      const response = await api.get('/jobs/saved');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark job as applied
  markAsApplied: async (jobId, notes = '') => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const jobs = generateMockJobs();
      const job = jobs.find(j => j.id === jobId);
      if (job && !mockStorage.appliedJobs.includes(jobId)) {
        mockStorage.appliedJobs.push(jobId);
      }
      return { success: true, jobId, notes, appliedAt: new Date().toISOString() };
    }
    
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, { notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get application history
  getApplicationHistory: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobs = generateMockJobs();
      return {
        applications: jobs
          .filter(j => mockStorage.appliedJobs.includes(j.id))
          .map(job => ({
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            appliedAt: new Date().toISOString(),
            status: 'pending'
          })),
        total: mockStorage.appliedJobs.length
      };
    }
    
    try {
      const response = await api.get('/jobs/applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job statistics
  getJobStats: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const jobs = generateMockJobs();
      return {
        totalMatched: jobs.length,
        averageMatchScore: Math.round(jobs.reduce((sum, j) => sum + j.matchScore, 0) / jobs.length),
        topSkills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python'],
        experienceLevels: {
          entry: 0,
          mid: 2,
          senior: 1,
          lead: 0
        },
        remoteJobs: jobs.filter(j => j.remote).length,
        totalJobs: jobs.length
      };
    }
    
    try {
      const response = await api.get('/jobs/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default jobService;