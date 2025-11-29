import api, { apiUtils } from './api';

// MOCK MODE
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Mock data storage
const mockStorage = {
  preps: [],
};

// Generate mock prep ID
const generateMockPrepId = () => `prep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate mock interview prep data
const generateMockPrep = (interviewData) => {
  const prepId = generateMockPrepId();
  const company = interviewData.company || 'Tech Company';
  const role = interviewData.role || 'Software Engineer';
  const technologies = interviewData.techTags || interviewData.technologies || ['JavaScript', 'React'];
  
  return {
    id: prepId,
    prepId,
    userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '1',
    company,
    role,
    technologies,
    createdAt: new Date().toISOString(),
    status: 'generating',
    materials: {
      technicalQuestions: [
        {
          id: 'q1',
          question: `Design a scalable system for ${company}'s main product`,
          type: 'technical',
          difficulty: 'hard',
          topics: ['System Design', 'Scalability'],
          hints: ['Consider microservices architecture', 'Think about database sharding', 'Plan for load balancing'],
          sampleAnswer: 'A scalable system would involve...'
        },
        {
          id: 'q2',
          question: `Implement a ${technologies[0] || 'JavaScript'} function to reverse a linked list`,
          type: 'technical',
          difficulty: 'medium',
          topics: ['Data Structures', technologies[0] || 'JavaScript'],
          hints: ['Use two pointers', 'Handle edge cases', 'Consider recursion'],
          sampleAnswer: 'function reverseLinkedList(head) { ... }'
        },
        {
          id: 'q3',
          question: `Explain how you would optimize a ${technologies[0] || 'React'} application for performance`,
          type: 'technical',
          difficulty: 'medium',
          topics: ['Performance', technologies[0] || 'React'],
          hints: ['Code splitting', 'Memoization', 'Virtual DOM optimization'],
          sampleAnswer: 'Performance optimization involves...'
        }
      ],
      behavioralQuestions: [
        {
          id: 'b1',
          question: 'Tell me about a time you had to work under pressure',
          type: 'behavioral',
          difficulty: 'easy',
          topics: ['Teamwork', 'Problem Solving'],
          hints: ['Use STAR method', 'Be specific', 'Show results'],
          sampleAnswer: 'Situation: ... Task: ... Action: ... Result: ...'
        },
        {
          id: 'b2',
          question: 'Describe a challenging technical problem you solved',
          type: 'behavioral',
          difficulty: 'medium',
          topics: ['Problem Solving', 'Technical Skills'],
          hints: ['Focus on your process', 'Explain the solution clearly', 'Highlight learning'],
          sampleAnswer: 'I encountered a performance issue where...'
        }
      ],
      studyGuide: {
        keyTopics: technologies,
        resources: [
          `Company culture at ${company}`,
          `${role} interview best practices`,
          'System design fundamentals',
          'Data structures and algorithms'
        ],
        tips: [
          'Review the company\'s tech stack',
          'Practice coding problems daily',
          'Prepare questions about the team',
          'Research recent company news'
        ]
      },
      keyTopics: technologies
    }
  };
};

const interviewService = {
  // Generate interview preparation materials
  generateInterviewPrep: async (interviewData) => {
    if (USE_MOCK_DATA) {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const prep = generateMockPrep(interviewData);
      prep.status = 'generating';
      mockStorage.preps.push(prep);
      
      return {
        prepId: prep.prepId,
        status: 'generating',
        message: 'Interview prep generation started'
      };
    }
    
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
    if (USE_MOCK_DATA) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prep = mockStorage.preps.find(p => p.prepId === prepId || p.id === prepId);
      if (prep) {
        prep.status = 'completed';
        return {
          ...prep,
          status: 'completed'
        };
      }
      throw new Error('Interview prep not found');
    }
    
    try {
      const result = await apiUtils.pollStatus(`/interview/prep/${prepId}/status`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get interview prep details
  getInterviewPrep: async (prepId) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const prep = mockStorage.preps.find(p => p.prepId === prepId || p.id === prepId);
      if (prep) {
        return prep;
      }
      // If not found, generate a default one
      const defaultPrep = generateMockPrep({ company: 'Tech Company', role: 'Software Engineer' });
      defaultPrep.status = 'completed';
      mockStorage.preps.push(defaultPrep);
      return defaultPrep;
    }
    
    try {
      const response = await api.get(`/interview/prep/${prepId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get interview history
  getInterviewHistory: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        company: companyName,
        summary: `${companyName} is a technology company known for innovation and strong engineering culture.`,
        interviewProcess: [
          'Initial phone screen (30-45 minutes)',
          'Technical interview (1-2 hours)',
          'System design round (1 hour)',
          'Behavioral interview (45 minutes)',
          'Final round with hiring manager'
        ],
        commonQuestions: [
          'Why do you want to work here?',
          'Tell me about a challenging project',
          'How do you handle conflicts in a team?'
        ],
        techStack: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        culture: 'Fast-paced, collaborative, innovation-focused',
        tips: [
          'Research the company\'s recent projects',
          'Prepare questions about team structure',
          'Show enthusiasm for the company\'s mission'
        ]
      };
    }
    
    try {
      const response = await api.get(`/interview/company/${encodeURIComponent(companyName)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default interviewService;