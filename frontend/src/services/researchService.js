import api from './api';

// MOCK MODE - Use mock data only if backend is not available
const USE_MOCK_DATA = !import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Simple cache for performance (24 hour TTL)
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000;

const isCacheValid = (key) => {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
};

const researchService = {
  // Get company research from backend
  researchCompany: async (companyName) => {
    const cacheKey = `company_${companyName}`;
    
    // Check cache
    if (isCacheValid(cacheKey)) {
      console.log('✅ Using cached company research');
      return cache.get(cacheKey).data;
    }
    
    if (USE_MOCK_DATA) {
      // Fallback mock data (should not be used if backend is available)
      await new Promise(resolve => setTimeout(resolve, 300));
      const fallback = {
        company: companyName,
        summary: `${companyName} is a technology company.`,
        interviewProcess: ['Phone screen', 'Technical interview', 'Final round'],
        commonQuestions: ['Why this company?'],
        techStack: [],
        culture: 'Innovation-focused',
        tips: ['Research the company'],
      };
      cache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }
    
    try {
      const response = await api.get(`/research/company/${encodeURIComponent(companyName)}`);
      const data = response.data?.data || response.data;
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Fallback to cache if available
      if (cache.has(cacheKey)) {
        console.warn('⚠️ API failed, using cached data');
        return cache.get(cacheKey).data;
      }
      throw error;
    }
  },

  // Get role research from backend
  researchRole: async (role) => {
    const cacheKey = `role_${role}`;
    
    if (isCacheValid(cacheKey)) {
      return cache.get(cacheKey).data;
    }
    
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const fallback = {
        role: role,
        keyTopics: ['Technical Skills'],
        difficulty: 'medium',
        focusAreas: ['Problem-solving'],
      };
      cache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }
    
    try {
      const response = await api.get(`/research/role/${encodeURIComponent(role)}`);
      const data = response.data?.data || response.data;
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey).data;
      }
      throw error;
    }
  },

  // Get industry trends from backend
  researchIndustryTrends: async (industry) => {
    const cacheKey = `industry_${industry}`;
    
    if (isCacheValid(cacheKey)) {
      return cache.get(cacheKey).data;
    }
    
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const fallback = {
        industry: industry,
        trends: ['Digital transformation'],
        skills: ['Technical skills'],
        growth: 'Medium',
      };
      cache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }
    
    try {
      const response = await api.get(`/research/industry/${encodeURIComponent(industry)}`);
      const data = response.data?.data || response.data;
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get deep research (company + role) from backend
  deepResearch: async (companyName, role) => {
    if (USE_MOCK_DATA) {
      // Fallback: call individual services
      const [company, roleData] = await Promise.all([
        researchService.researchCompany(companyName),
        researchService.researchRole(role),
      ]);
      
      return {
        company,
        role: roleData,
        combined: {
          keyFocusAreas: [...(roleData.focusAreas || []), ...(company.techStack || []).slice(0, 3)],
          interviewStrategy: {
            technical: roleData.keyTopics || [],
            behavioral: company.values || [],
            systemDesign: [],
          },
        },
      };
    }
    
    try {
      const response = await api.get('/research/deep', {
        params: { companyName, role }
      });
      return response.data?.data || response.data;
    } catch (error) {
      // Fallback to individual calls
      console.warn('⚠️ Deep research API failed, using individual calls');
      const [company, roleData] = await Promise.all([
        researchService.researchCompany(companyName),
        researchService.researchRole(role),
      ]);
      
      return {
        company,
        role: roleData,
        combined: {
          keyFocusAreas: [...(roleData.focusAreas || []), ...(company.techStack || []).slice(0, 3)],
          interviewStrategy: {
            technical: roleData.keyTopics || [],
            behavioral: company.values || [],
            systemDesign: [],
          },
        },
      };
    }
  },

  // Clear cache
  clearCache: (type = 'all') => {
    if (type === 'all') {
      cache.clear();
    } else {
      // Clear specific type
      for (const [key] of cache) {
        if (key.startsWith(type)) {
          cache.delete(key);
        }
      }
    }
  },
};

export default researchService;
