import api from './api';

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
