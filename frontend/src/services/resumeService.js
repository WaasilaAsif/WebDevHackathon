import api, { apiUtils } from './api';

const resumeService = {
  // Upload and analyze resume
  uploadResume: async (file, onProgress) => {
    try {
      // Backend expects field name "resume" for the file
      const formData = new FormData();
      formData.append('resume', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      };

      const response = await api.post('/resume/upload', formData, config);
      
      if (response.data && response.data.success) {
        const analysisId = response.data.data.resumeId;
        
        // Store analysis in localStorage for retrieval
        const analysis = {
          id: analysisId,
          analysisId,
          status: 'completed',
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          extractedData: response.data.data.parsedResume || {},
          nerEntities: response.data.data.nerEntities || {},
          aiParsed: response.data.data.aiParsed || {}
        };
        
        const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
        analyses.push(analysis);
        localStorage.setItem('resumeAnalyses', JSON.stringify(analyses));
        
        return {
          analysisId,
          status: 'completed',
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        };
      }
      
      throw new Error(response.data.error || 'Upload failed');
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    }
  },

  // Get resume analysis status - get from localStorage or return completed
  getAnalysisStatus: async (analysisId) => {
    try {
      const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
      const analysis = analyses.find(a => a.id === analysisId || a.analysisId === analysisId);
      
      if (analysis) {
        return {
          status: 'completed',
          analysisId: analysis.analysisId || analysis.id,
          data: analysis
        };
      }
      
      // If not found, assume it's completed (backend processes immediately)
      return {
        status: 'completed',
        analysisId
      };
    } catch (error) {
      throw error;
    }
  },

  // Poll for analysis completion - backend processes immediately
  waitForAnalysis: async (analysisId) => {
    try {
      // Backend processes resume immediately, so just return the stored analysis
      const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
      const analysis = analyses.find(a => a.id === analysisId || a.analysisId === analysisId);
      
      if (analysis) {
        return {
          ...analysis,
          status: 'completed'
        };
      }
      
      // If not found, return a basic structure
      return {
        id: analysisId,
        analysisId,
        status: 'completed',
        extractedData: {},
        nerEntities: {},
        aiParsed: {}
      };
    } catch (error) {
      throw error;
    }
  },

  // Get user's resume profile - get from latest analysis
  getResumeProfile: async () => {
    try {
      const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
      const latestAnalysis = analyses[analyses.length - 1];
      
      if (!latestAnalysis) {
        // Try to get from user profile via /auth/me
        try {
          const userResponse = await api.get('/auth/me');
          const user = userResponse.data?.user;
          
          if (user && user.resumeProfile) {
            return {
              userId: user._id || user.id,
              skills: user.resumeProfile.skills || [],
              topSkills: user.resumeProfile.topSkills || [],
              recommendedRoles: user.resumeProfile.recommendedRoles || [],
              technicalDomains: user.resumeProfile.technicalDomains || [],
              seniority: user.resumeProfile.seniority,
              lastUpdated: new Date().toISOString()
            };
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
        
        return null;
      }
      
      // Extract profile from latest analysis
      const aiParsed = latestAnalysis.aiParsed || {};
      const nerEntities = latestAnalysis.nerEntities || {};
      
      return {
        userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null,
        skills: aiParsed.skills?.map(s => typeof s === 'string' ? s : s.name) || nerEntities.skills?.map(s => s.name) || [],
        topSkills: aiParsed.topSkills?.map(s => typeof s === 'string' ? s : s.name) || [],
        recommendedRoles: aiParsed.recommendedRoles || [],
        technicalDomains: aiParsed.technicalDomains || [],
        seniority: aiParsed.seniority,
        experience: latestAnalysis.extractedData?.experience || [],
        education: latestAnalysis.extractedData?.education || [],
        projects: latestAnalysis.extractedData?.projects || [],
        summary: latestAnalysis.extractedData?.summary || '',
        lastUpdated: latestAnalysis.uploadedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching resume profile:', error);
      throw error;
    }
  },

  // Get skill analysis - extract from resume profile
  getSkillAnalysis: async () => {
    try {
      const profile = await resumeService.getResumeProfile();
      
      if (!profile || !profile.skills) {
        return {
          skills: [],
          summary: {
            totalSkills: 0,
            highDemandSkills: 0,
            averageProficiency: 'intermediate',
            topCategories: []
          }
        };
      }
      
      // Transform skills into analysis format
      const skills = profile.skills.map(skillName => ({
        skillName: typeof skillName === 'string' ? skillName : skillName.name,
        category: 'General', // Could be enhanced with category detection
        proficiency: 'intermediate', // Could be extracted from profile
        demandLevel: 'high',
        relatedJobs: 0
      }));
      
      return {
        skills,
        summary: {
          totalSkills: skills.length,
          highDemandSkills: skills.length,
          averageProficiency: 'intermediate',
          topCategories: profile.technicalDomains || []
        }
      };
    } catch (error) {
      console.error('Error fetching skill analysis:', error);
      throw error;
    }
  },

  // Update resume profile manually - store in localStorage
  updateProfile: async (profileData) => {
    try {
      // Store updated profile in localStorage
      const updatedProfile = {
        ...profileData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('resumeProfile', JSON.stringify(updatedProfile));
      return { success: true, data: updatedProfile };
    } catch (error) {
      throw error;
    }
  },

  // Get resume history - get from localStorage
  getResumeHistory: async () => {
    try {
      const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
      return {
        analyses: analyses.map(a => ({
          id: a.id || a.analysisId,
          fileName: a.fileName || 'resume.pdf',
          uploadedAt: a.uploadedAt,
          status: a.status || 'completed'
        }))
      };
    } catch (error) {
      console.error('Error fetching resume history:', error);
      return { analyses: [] };
    }
  },

  // Delete a resume analysis - remove from localStorage
  deleteAnalysis: async (analysisId) => {
    try {
      const analyses = JSON.parse(localStorage.getItem('resumeAnalyses') || '[]');
      const filtered = analyses.filter(a => a.id !== analysisId && a.analysisId !== analysisId);
      localStorage.setItem('resumeAnalyses', JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default resumeService;