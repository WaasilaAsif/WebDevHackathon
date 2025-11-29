// Deep Research Service for Interview Preparation
// This service provides comprehensive company and role research data

// Company research database
const COMPANY_DATABASE = {
  'google': {
    summary: 'Google (Alphabet Inc.) is a multinational technology conglomerate focused on internet-related services and products. Known for innovation, strong engineering culture, and rigorous technical interviews.',
    interviewProcess: [
      'Phone Screen (45 minutes) - Coding and problem-solving',
      'Technical Interview 1 (1 hour) - Algorithms and data structures',
      'Technical Interview 2 (1 hour) - System design or domain-specific',
      'Googleyness Interview (45 minutes) - Cultural fit and behavioral',
      'Hiring Committee Review',
      'Team Matching (if approved)'
    ],
    commonQuestions: [
      'Why do you want to work at Google?',
      'Tell me about a time you solved a complex technical problem',
      'How do you handle ambiguity in projects?',
      'Describe a project where you had to learn something new quickly',
      'How do you ensure code quality in a large codebase?'
    ],
    techStack: ['C++', 'Java', 'Python', 'Go', 'JavaScript', 'TypeScript', 'Kubernetes', 'BigQuery', 'TensorFlow'],
    culture: 'Innovation-driven, data-oriented, collaborative, emphasis on scale and impact',
    values: ['Focus on the user', 'Think big', 'Move fast', 'Be transparent'],
    recentNews: [
      'Focus on AI and machine learning',
      'Cloud infrastructure expansion',
      'Privacy and security initiatives'
    ],
    interviewTips: [
      'Practice coding problems on LeetCode (medium to hard)',
      'Study system design fundamentals',
      'Prepare examples using STAR method',
      'Research Google\'s products and recent launches',
      'Be ready to discuss scalability and performance',
      'Show passion for solving large-scale problems'
    ],
    salaryRange: { min: 150000, max: 300000, currency: 'USD' },
    benefits: ['Excellent health insurance', 'Free meals', 'On-site gym', 'Stock options', 'Learning budget'],
  },
  'amazon': {
    summary: 'Amazon is a global e-commerce and cloud computing company. Known for customer obsession, leadership principles, and diverse technical challenges.',
    interviewProcess: [
      'Phone Screen (1 hour) - Technical and behavioral',
      'On-site Loop (4-5 interviews, 1 hour each)',
      'Bar Raiser Interview - Higher standard evaluation',
      'Hiring Manager Review',
      'Offer Decision'
    ],
    commonQuestions: [
      'Tell me about a time you disagreed with a manager',
      'Describe a situation where you had to deliver results under pressure',
      'How do you handle conflicting priorities?',
      'Give an example of when you simplified a complex process',
      'Tell me about a time you had to learn a new technology quickly'
    ],
    techStack: ['Java', 'Python', 'JavaScript', 'AWS', 'DynamoDB', 'Lambda', 'React', 'Node.js'],
    culture: 'Customer-obsessed, ownership mindset, high standards, bias for action',
    values: ['Customer Obsession', 'Ownership', 'Invent and Simplify', 'Are Right, A Lot'],
    recentNews: [
      'AWS expansion and new services',
      'AI and machine learning integration',
      'Supply chain optimization'
    ],
    interviewTips: [
      'Study Amazon Leadership Principles thoroughly',
      'Prepare STAR stories for each principle',
      'Practice system design (especially distributed systems)',
      'Understand AWS services and architecture',
      'Be ready to discuss trade-offs and decisions',
      'Show customer focus in all answers'
    ],
    salaryRange: { min: 140000, max: 280000, currency: 'USD' },
    benefits: ['Health insurance', '401k matching', 'Stock options', 'Career development programs'],
  },
  'microsoft': {
    summary: 'Microsoft is a technology corporation known for software, cloud services, and enterprise solutions. Emphasizes growth mindset and collaboration.',
    interviewProcess: [
      'Phone Screen (45 minutes)',
      'Technical Interview 1 (1 hour)',
      'Technical Interview 2 (1 hour)',
      'System Design Interview (1 hour)',
      'Behavioral Interview (45 minutes)',
      'Team Fit Discussion'
    ],
    commonQuestions: [
      'Why Microsoft?',
      'Tell me about a challenging project you worked on',
      'How do you approach learning new technologies?',
      'Describe a time you had to work with a difficult team member',
      'What interests you about this specific role?'
    ],
    techStack: ['C#', '.NET', 'TypeScript', 'Azure', 'PowerShell', 'React', 'SQL Server'],
    culture: 'Growth mindset, diversity and inclusion, collaboration, innovation',
    values: ['Respect', 'Integrity', 'Accountability', 'Growth Mindset'],
    recentNews: [
      'Azure cloud growth',
      'AI integration in products',
      'Open source contributions'
    ],
    interviewTips: [
      'Research Microsoft\'s products and services',
      'Practice coding problems (LeetCode medium)',
      'Prepare system design examples',
      'Understand Azure services',
      'Show growth mindset in answers',
      'Be ready to discuss collaboration'
    ],
    salaryRange: { min: 130000, max: 270000, currency: 'USD' },
    benefits: ['Health insurance', 'Stock options', 'Learning resources', 'Flexible work'],
  },
  'meta': {
    summary: 'Meta (Facebook) focuses on social media, virtual reality, and AI. Known for fast-paced environment and cutting-edge technology.',
    interviewProcess: [
      'Phone Screen (1 hour)',
      'On-site (4-5 interviews)',
      'System Design Interview',
      'Coding Interviews (2-3)',
      'Behavioral Interview'
    ],
    commonQuestions: [
      'Why Meta?',
      'Tell me about a time you moved fast',
      'Describe a complex system you designed',
      'How do you handle ambiguity?',
      'Give an example of impact you had'
    ],
    techStack: ['React', 'PHP (Hack)', 'Python', 'C++', 'GraphQL', 'MySQL', 'Cassandra'],
    culture: 'Move fast, be bold, focus on impact, build social value',
    values: ['Move Fast', 'Be Bold', 'Focus on Impact', 'Build Social Value'],
    recentNews: [
      'Metaverse development',
      'AI research and applications',
      'Reels and short-form content'
    ],
    interviewTips: [
      'Practice coding problems (LeetCode hard)',
      'Study system design patterns',
      'Understand distributed systems',
      'Prepare impact-focused examples',
      'Research Meta\'s recent products',
      'Show passion for scale'
    ],
    salaryRange: { min: 160000, max: 320000, currency: 'USD' },
    benefits: ['Free food', 'Health insurance', 'Stock options', 'VR equipment'],
  },
  'apple': {
    summary: 'Apple is known for hardware, software, and services. Emphasizes design, quality, and user experience.',
    interviewProcess: [
      'Phone Screen',
      'Technical Interviews (2-3)',
      'System Design',
      'Behavioral Interview',
      'Team Interview'
    ],
    commonQuestions: [
      'Why Apple?',
      'Tell me about attention to detail',
      'Describe a time you improved user experience',
      'How do you ensure quality?',
      'Give an example of elegant problem-solving'
    ],
    techStack: ['Swift', 'Objective-C', 'Python', 'C++', 'JavaScript', 'Metal'],
    culture: 'Attention to detail, simplicity, innovation, user experience focus',
    values: ['Simplicity', 'Innovation', 'Quality', 'User Experience'],
    recentNews: [
      'Apple Silicon development',
      'Services growth',
      'Privacy features'
    ],
    interviewTips: [
      'Focus on quality and design',
      'Practice iOS/macOS development',
      'Understand Apple ecosystem',
      'Prepare user-focused examples',
      'Show attention to detail',
      'Research Apple\'s design principles'
    ],
    salaryRange: { min: 150000, max: 300000, currency: 'USD' },
    benefits: ['Product discounts', 'Health insurance', 'Stock options', 'On-site facilities'],
  },
};

// Role research database
const ROLE_DATABASE = {
  'software engineer': {
    keyTopics: ['Data Structures', 'Algorithms', 'System Design', 'Object-Oriented Design'],
    commonQuestions: [
      'Reverse a linked list',
      'Find the longest palindromic substring',
      'Design a URL shortener',
      'Implement a rate limiter'
    ],
    difficulty: 'medium-hard',
    focusAreas: ['Problem-solving', 'Code quality', 'Scalability', 'Performance'],
  },
  'senior software engineer': {
    keyTopics: ['System Design', 'Architecture', 'Leadership', 'Mentoring'],
    commonQuestions: [
      'Design a distributed cache',
      'How would you scale a system to 1M users?',
      'Describe a time you led a technical project',
      'How do you mentor junior engineers?'
    ],
    difficulty: 'hard',
    focusAreas: ['System design', 'Technical leadership', 'Architecture decisions', 'Team impact'],
  },
  'data scientist': {
    keyTopics: ['Machine Learning', 'Statistics', 'Data Analysis', 'Python'],
    commonQuestions: [
      'Explain overfitting and how to prevent it',
      'How would you handle missing data?',
      'Describe a machine learning project',
      'Explain bias-variance tradeoff'
    ],
    difficulty: 'medium-hard',
    focusAreas: ['ML algorithms', 'Statistical analysis', 'Data preprocessing', 'Model evaluation'],
  },
  'full stack engineer': {
    keyTopics: ['Frontend', 'Backend', 'Databases', 'APIs'],
    commonQuestions: [
      'Design a RESTful API',
      'How do you optimize frontend performance?',
      'Explain database indexing',
      'Describe a full-stack project'
    ],
    difficulty: 'medium',
    focusAreas: ['Full-stack architecture', 'API design', 'Database optimization', 'Frontend/Backend integration'],
  },
};

// Industry trends database
const INDUSTRY_DATABASE = {
  'technology': {
    trends: ['AI/ML integration', 'Cloud migration', 'Remote work tools', 'Cybersecurity'],
    skills: ['Cloud computing', 'AI/ML', 'DevOps', 'Security'],
    growth: 'High',
  },
  'finance': {
    trends: ['Fintech innovation', 'Blockchain', 'Digital banking', 'RegTech'],
    skills: ['Python', 'Data analysis', 'Blockchain', 'Risk management'],
    growth: 'Medium-High',
  },
};

// Get company research
export const getCompanyResearch = (companyName) => {
  const normalizedName = companyName.toLowerCase().trim();
  const company = COMPANY_DATABASE[normalizedName];
  
  if (company) {
    return {
      ...company,
      company: companyName, // Preserve original casing
    };
  }
  
  // Default fallback
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
    values: ['Innovation', 'Quality', 'Teamwork'],
    recentNews: ['Company growth and expansion', 'Technology innovation'],
    interviewTips: [
      'Research the company\'s recent projects',
      'Prepare questions about team structure',
      'Show enthusiasm for the company\'s mission'
    ],
    salaryRange: { min: 100000, max: 200000, currency: 'USD' },
    benefits: ['Health insurance', 'Stock options', 'Learning resources'],
  };
};

// Get role research
export const getRoleResearch = (role) => {
  const normalizedRole = role.toLowerCase().trim();
  const roleData = ROLE_DATABASE[normalizedRole];
  
  if (roleData) {
    return {
      ...roleData,
      role: role, // Preserve original casing
    };
  }
  
  // Default fallback
  return {
    role: role,
    keyTopics: ['Technical Skills', 'Problem Solving', 'System Design'],
    commonQuestions: ['Technical problem-solving questions', 'System design questions'],
    difficulty: 'medium',
    focusAreas: ['Problem-solving', 'Technical knowledge', 'Communication'],
  };
};

// Get industry trends
export const getIndustryTrends = (industry) => {
  const normalizedIndustry = industry.toLowerCase().trim();
  const trends = INDUSTRY_DATABASE[normalizedIndustry];
  
  if (trends) {
    return {
      ...trends,
      industry: industry,
    };
  }
  
  // Default fallback
  return {
    industry: industry,
    trends: ['Digital transformation', 'Automation', 'Data-driven decisions'],
    skills: ['Technical skills', 'Analytical thinking'],
    growth: 'Medium',
  };
};

// Combined deep research
export const getDeepResearch = (companyName, role) => {
  const companyResearch = getCompanyResearch(companyName);
  const roleResearch = getRoleResearch(role);
  
  return {
    company: companyResearch,
    role: roleResearch,
    combined: {
      keyFocusAreas: [
        ...(roleResearch.focusAreas || []),
        ...(companyResearch.techStack || []).slice(0, 3),
      ],
      interviewStrategy: {
        technical: roleResearch.keyTopics || [],
        behavioral: companyResearch.values || [],
        systemDesign: roleResearch.difficulty === 'hard' ? ['Distributed systems', 'Scalability'] : [],
      },
    },
  };
};

export default {
  getCompanyResearch,
  getRoleResearch,
  getIndustryTrends,
  getDeepResearch,
};

