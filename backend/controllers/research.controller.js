import researchService from '../services/researchService.js';

// Get company research
export const getCompanyResearch = async (req, res) => {
  try {
    const { companyName } = req.params;
    
    if (!companyName) {
      return res.status(400).json({
        success: false,
        error: 'Company name is required'
      });
    }
    
    const research = researchService.getCompanyResearch(companyName);
    
    res.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Company research error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company research'
    });
  }
};

// Get role research
export const getRoleResearch = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'Role is required'
      });
    }
    
    const research = researchService.getRoleResearch(role);
    
    res.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Role research error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch role research'
    });
  }
};

// Get industry trends
export const getIndustryTrends = async (req, res) => {
  try {
    const { industry } = req.params;
    
    if (!industry) {
      return res.status(400).json({
        success: false,
        error: 'Industry is required'
      });
    }
    
    const trends = researchService.getIndustryTrends(industry);
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Industry trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch industry trends'
    });
  }
};

// Get deep research (company + role combined)
export const getDeepResearch = async (req, res) => {
  try {
    const { companyName, role } = req.query;
    
    if (!companyName || !role) {
      return res.status(400).json({
        success: false,
        error: 'Company name and role are required'
      });
    }
    
    const research = researchService.getDeepResearch(companyName, role);
    
    res.json({
      success: true,
      data: research
    });
  } catch (error) {
    console.error('Deep research error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deep research'
    });
  }
};

