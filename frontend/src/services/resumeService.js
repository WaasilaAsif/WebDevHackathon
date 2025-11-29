import api, { apiUtils } from './api';

// MOCK MODE - Set to true when backend is not available
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Mock data storage (simulates backend)
const mockStorage = {
  analyses: [],
  profile: null,
  skills: null,
};

// Generate mock analysis ID
const generateMockId = () => `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const resumeService = {
  // Upload and analyze resume
  uploadResume: async (file, onProgress) => {
    if (USE_MOCK_DATA) {
      // Simulate upload progress
      if (onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          onProgress(i);
        }
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysisId = generateMockId();
      const mockAnalysis = {
        analysisId,
        status: 'processing',
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      };
      
      mockStorage.analyses.push({
        id: analysisId,
        ...mockAnalysis,
        extractedData: {
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS'],
          experience: [
            {
              company: 'Tech Corp',
              position: 'Senior Software Engineer',
              startDate: '2020-01',
              endDate: '2024-01',
              current: true,
              description: 'Led development of multiple web applications',
              technologies: ['React', 'TypeScript', 'Node.js']
            }
          ],
          education: [
            {
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2016-09',
              endDate: '2020-05',
              gpa: '3.8'
            }
          ],
          projects: [
            {
              name: 'E-commerce Platform',
              description: 'Full-stack e-commerce solution',
              technologies: ['React', 'Node.js', 'MongoDB'],
              highlights: ['Scaled to 10k+ users', '99.9% uptime']
            }
          ],
          summary: 'Experienced software engineer with expertise in modern web technologies'
        },
        insights: {
          strengthAreas: ['Frontend Development', 'JavaScript/TypeScript', 'API Design'],
          gapAreas: ['Cloud Architecture', 'DevOps'],
          suggestions: ['Consider learning Docker and Kubernetes', 'Explore AWS certifications']
        }
      });
      
      return mockAnalysis;
    }
    
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
    if (USE_MOCK_DATA) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = mockStorage.analyses.find(a => a.id === analysisId);
      if (analysis) {
        return {
          ...analysis,
          status: 'completed'
        };
      }
      throw new Error('Analysis not found');
    }
    
    try {
      const result = await apiUtils.pollStatus(`/resume/analysis/${analysisId}/status`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get user's resume profile
  getResumeProfile: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!mockStorage.profile) {
        mockStorage.profile = {
          userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '1',
          skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'SQL'],
          experience: [
            {
              company: 'Tech Corp',
              position: 'Senior Software Engineer',
              startDate: '2020-01',
              endDate: '2024-01',
              current: true,
              description: 'Led development of multiple web applications',
              technologies: ['React', 'TypeScript', 'Node.js']
            }
          ],
          education: [
            {
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              startDate: '2016-09',
              endDate: '2020-05',
              gpa: '3.8'
            }
          ],
          projects: [],
          technicalExpertise: {
            'Frontend': ['React', 'JavaScript', 'TypeScript'],
            'Backend': ['Node.js', 'Python'],
            'Database': ['SQL', 'MongoDB']
          },
          proficiencyLevels: {
            'React': 'advanced',
            'JavaScript': 'expert',
            'TypeScript': 'advanced',
            'Node.js': 'intermediate',
            'Python': 'intermediate',
            'SQL': 'intermediate'
          },
          lastUpdated: new Date().toISOString()
        };
      }
      
      return mockStorage.profile;
    }
    
    try {
      const response = await api.get('/resume/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get skill analysis
  getSkillAnalysis: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!mockStorage.skills) {
        mockStorage.skills = {
          skills: [
            { skillName: 'React', category: 'Frontend', proficiency: 'advanced', demandLevel: 'high', relatedJobs: 1250 },
            { skillName: 'JavaScript', category: 'Frontend', proficiency: 'expert', demandLevel: 'high', relatedJobs: 2100 },
            { skillName: 'TypeScript', category: 'Frontend', proficiency: 'advanced', demandLevel: 'high', relatedJobs: 890 },
            { skillName: 'Node.js', category: 'Backend', proficiency: 'intermediate', demandLevel: 'high', relatedJobs: 1100 },
            { skillName: 'Python', category: 'Backend', proficiency: 'intermediate', demandLevel: 'high', relatedJobs: 1800 },
            { skillName: 'SQL', category: 'Database', proficiency: 'intermediate', demandLevel: 'high', relatedJobs: 1500 },
          ],
          summary: {
            totalSkills: 6,
            highDemandSkills: 6,
            averageProficiency: 'advanced',
            topCategories: ['Frontend', 'Backend', 'Database']
          }
        };
      }
      
      return mockStorage.skills;
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        analyses: mockStorage.analyses.map(a => ({
          id: a.id,
          fileName: a.fileName || 'resume.pdf',
          uploadedAt: a.uploadedAt,
          status: a.status || 'completed'
        }))
      };
    }
    
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