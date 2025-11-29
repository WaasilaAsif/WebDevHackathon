import api, { apiUtils } from './api';

// MOCK MODE
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Mock storage (only for frontend-only mode)
const mockStorage = {
  preps: [],
};

// Generate mock prep ID
const generateMockPrepId = () => `prep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Simple mock prep generator (fallback only)
const generateSimpleMockPrep = (interviewData) => {
  const prepId = generateMockPrepId();
  return {
    id: prepId,
    prepId,
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '1',
    company: interviewData.company || 'Tech Company',
    role: interviewData.role || 'Software Engineer',
    technologies: interviewData.technologies || interviewData.techTags || [],
    createdAt: new Date().toISOString(),
    status: 'completed',
    materials: {
      technicalQuestions: [
        {
          id: 'q1',
          question: `Design a scalable system`,
          type: 'technical',
          difficulty: 'Hard',
          topic: 'System Design',
          topics: ['System Design'],
          hints: ['Consider microservices', 'Think about scalability'],
          sampleAnswer: 'A scalable system would involve...',
        },
      ],
      behavioralQuestions: [
        {
          id: 'b1',
          question: 'Tell me about a time you worked under pressure',
          type: 'behavioral',
          category: 'Time Management',
          starGuidance: {
            Situation: 'Describe the situation',
            Task: 'What was your task?',
            Action: 'What actions did you take?',
            Result: 'What were the results?',
          },
        },
      ],
      studyGuide: [],
    },
  };
};

const interviewService = {
  // Generate interview preparation - calls backend API
  generateInterviewPrep: async (interviewData, onProgress) => {
    if (USE_MOCK_DATA) {
      // Fallback: simple mock generation
      if (onProgress) {
        onProgress(50, 'Generating...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        onProgress(100, 'Complete!');
      }
      
      const prep = generateSimpleMockPrep(interviewData);
      mockStorage.preps.push(prep);
      
      return {
        prepId: prep.prepId,
        status: 'completed',
        message: 'Interview prep generated',
        data: prep,
      };
    }
    
    try {
      // Call backend API
      const response = await api.post('/interview/generate', interviewData);
      const result = response.data;
      
      if (result.success && result.data) {
        // Store in mock storage for retrieval
        if (result.data.prep) {
          mockStorage.preps.push(result.data.prep);
        }
        
        return {
          prepId: result.data.prepId,
          status: result.data.status || 'completed',
          message: result.data.message || 'Interview prep generated',
          data: result.data.prep || result.data,
        };
      }
      
      throw new Error(result.error || 'Failed to generate interview prep');
    } catch (error) {
      console.error('❌ Generate prep API error:', error);
      
      // Fallback to simple mock if API fails
      if (USE_MOCK_DATA || error.response?.status >= 500) {
        console.warn('⚠️ Using fallback mock generation');
        const prep = generateSimpleMockPrep(interviewData);
        mockStorage.preps.push(prep);
        return {
          prepId: prep.prepId,
          status: 'completed',
          message: 'Generated with fallback',
          data: prep,
        };
      }
      
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
  waitForPrep: async (prepId, onProgress) => {
    if (USE_MOCK_DATA) {
      // Check mock storage
      const prep = mockStorage.preps.find(p => p.prepId === prepId || p.id === prepId);
      if (prep) {
        return prep;
      }
      throw new Error('Interview prep not found');
    }
    
    try {
      const result = await apiUtils.pollStatus(`/interview/prep/${prepId}/status`, 2000, 30, onProgress);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get interview prep details - calls backend API
  getInterviewPrep: async (prepId) => {
    // Check mock storage first (for frontend-only mode)
    const mockPrep = mockStorage.preps.find(p => p.prepId === prepId || p.id === prepId);
    if (USE_MOCK_DATA && mockPrep) {
      return mockPrep;
    }
    
    try {
      const response = await api.get(`/interview/prep/${prepId}`);
      return response.data?.data || response.data;
    } catch (error) {
      // Fallback to mock if available
      if (mockPrep) {
        console.warn('⚠️ API failed, using mock data');
        return mockPrep;
      }
      throw error;
    }
  },

  // Get interview history - calls backend API
  getInterviewHistory: async () => {
    if (USE_MOCK_DATA) {
      return {
        preps: mockStorage.preps.map(p => ({
          id: p.id,
          prepId: p.prepId,
          company: p.company,
          role: p.role,
          createdAt: p.createdAt,
          status: p.status
        })),
        total: mockStorage.preps.length
      };
    }
    
    try {
      const response = await api.get('/interview/history');
      return response.data?.data || response.data;
    } catch (error) {
      // Fallback to mock
      if (USE_MOCK_DATA) {
        return {
          preps: mockStorage.preps.map(p => ({
            id: p.id,
            prepId: p.prepId,
            company: p.company,
            role: p.role,
            createdAt: p.createdAt,
            status: p.status
          })),
          total: mockStorage.preps.length
        };
      }
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

  // Delete interview prep - calls backend API
  deleteInterviewPrep: async (prepId) => {
    // Remove from mock storage
    if (USE_MOCK_DATA) {
      mockStorage.preps = mockStorage.preps.filter(p => p.prepId !== prepId && p.id !== prepId);
    }
    
    try {
      const response = await api.delete(`/interview/prep/${prepId}`);
      return response.data;
    } catch (error) {
      // If delete succeeded in mock, return success
      if (USE_MOCK_DATA) {
        return { success: true };
      }
      throw error;
    }
  },

  // Get company insights - calls backend research API
  getCompanyInsights: async (companyName) => {
    try {
      // Use research service which calls backend
      const researchService = (await import('./researchService.js')).default;
      return await researchService.researchCompany(companyName);
    } catch (error) {
      console.error('Company insights error:', error);
      // Return basic fallback
      return {
        company: companyName,
        summary: `${companyName} is a technology company.`,
        interviewProcess: ['Phone screen', 'Technical interview'],
        commonQuestions: ['Why this company?'],
        techStack: [],
        culture: 'Innovation-focused',
        tips: ['Research the company'],
      };
    }
  },

  // Get deep research - calls backend research API
  getDeepResearch: async (companyName, role) => {
    try {
      const researchService = (await import('./researchService.js')).default;
      return await researchService.deepResearch(companyName, role);
    } catch (error) {
      console.error('Deep research error:', error);
      throw error;
    }
  },
};

export default interviewService;
