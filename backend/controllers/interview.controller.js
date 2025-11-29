import researchService from '../services/researchService.js';

// Generate interview prep questions based on research
const generateTechnicalQuestions = (company, role, technologies, roleResearch, companyResearch) => {
  const questions = [];
  const difficulty = roleResearch.difficulty || 'medium';
  
  // System Design questions (for senior roles)
  if (difficulty === 'hard' || role.toLowerCase().includes('senior')) {
    questions.push({
      id: 'q1',
      question: `Design a scalable system for ${company}'s ${companyResearch.techStack?.[0] || 'main'} service`,
      type: 'technical',
      difficulty: 'Hard',
      topic: 'System Design',
      topics: ['System Design', 'Scalability', 'Architecture'],
      hints: [
        'Consider microservices architecture',
        'Think about database sharding and replication',
        'Plan for load balancing and caching',
        'Design for high availability',
      ],
      sampleAnswer: `A scalable system for ${company} would involve: 1) Microservices architecture for independent scaling, 2) Load balancers to distribute traffic, 3) Caching layer (Redis) for frequently accessed data, 4) Database sharding for horizontal scaling, 5) CDN for static content, 6) Message queues for async processing.`,
      estimatedTime: '45-60 minutes',
    });
  }
  
  // Algorithm questions
  const algoQuestions = [
    {
      id: 'q2',
      question: `Implement a function to ${technologies[0] ? `reverse a linked list in ${technologies[0]}` : 'reverse a linked list'}`,
      type: 'technical',
      difficulty: 'Medium',
      topic: 'Data Structures',
      topics: ['Data Structures', 'Algorithms', technologies[0] || 'Programming'],
      hints: ['Use two pointers approach', 'Handle edge cases (null, single node)', 'Consider iterative and recursive solutions'],
      sampleAnswer: technologies[0] === 'JavaScript' 
        ? 'function reverseLinkedList(head) { let prev = null; let curr = head; while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next; } return prev; }'
        : 'Use two pointers: prev and curr. Iterate through the list, reversing pointers.',
      estimatedTime: '20-30 minutes',
    },
    {
      id: 'q3',
      question: 'Find the longest palindromic substring in a string',
      type: 'technical',
      difficulty: 'Medium',
      topic: 'Algorithms',
      topics: ['Algorithms', 'String Manipulation', 'Dynamic Programming'],
      hints: [
        'Consider expand around center approach',
        'Or use dynamic programming',
        'Handle edge cases (single character, all same characters)',
      ],
      sampleAnswer: 'Use expand around center: for each position, expand left and right to find longest palindrome. Time: O(n²), Space: O(1).',
      estimatedTime: '25-35 minutes',
    },
  ];
  
  questions.push(...algoQuestions);
  
  // Technology-specific questions
  if (technologies.length > 0) {
    technologies.slice(0, 2).forEach((tech, idx) => {
      questions.push({
        id: `q-tech-${idx + 4}`,
        question: `Explain how you would optimize a ${tech} application for performance`,
        type: 'technical',
        difficulty: 'Medium',
        topic: tech,
        topics: ['Performance', tech, 'Optimization'],
        hints: [
          tech === 'React' ? 'Code splitting, memoization, virtual DOM optimization' : '',
          tech === 'Node.js' ? 'Async operations, clustering, caching' : '',
          tech === 'Python' ? 'List comprehensions, generators, profiling' : '',
          'Measure before optimizing',
        ].filter(Boolean),
        sampleAnswer: `For ${tech}: Use profiling tools to identify bottlenecks, implement caching strategies, optimize database queries, use lazy loading, and consider code splitting.`,
        estimatedTime: '15-25 minutes',
      });
    });
  }
  
  return questions;
};

// Generate behavioral questions
const generateBehavioralQuestions = (company, role, companyResearch) => {
  const baseQuestions = [
    {
      id: 'b1',
      question: 'Tell me about a time you had to work under pressure to meet a deadline',
      type: 'behavioral',
      category: 'Time Management',
      difficulty: 'Easy',
      topics: ['Time Management', 'Stress Handling'],
      starGuidance: {
        Situation: 'Describe the project context and why the deadline was tight',
        Task: 'What was your specific responsibility?',
        Action: 'How did you prioritize tasks and manage your time?',
        Result: 'Did you meet the deadline? What was the outcome?',
      },
      hints: ['Use STAR method', 'Be specific with timelines', 'Show problem-solving approach', 'Highlight results'],
      sampleAnswer: 'Situation: We had a critical bug in production... Task: I was responsible for... Action: I prioritized by impact, worked extra hours, and coordinated with team... Result: We fixed it 2 hours before deadline, preventing major customer impact.',
    },
    {
      id: 'b2',
      question: 'Describe a challenging technical problem you solved',
      type: 'behavioral',
      category: 'Problem Solving',
      difficulty: 'Medium',
      topics: ['Problem Solving', 'Technical Skills'],
      starGuidance: {
        Situation: 'Set the context of the technical challenge',
        Task: 'What needed to be solved?',
        Action: 'What was your approach? What technologies did you use?',
        Result: 'What was the solution and impact?',
      },
      hints: ['Focus on your problem-solving process', 'Explain the technical details clearly', 'Highlight what you learned'],
      sampleAnswer: 'Situation: Our API was experiencing high latency... Task: I needed to identify and fix the bottleneck... Action: I used profiling tools, identified N+1 query problem, implemented caching... Result: Reduced latency by 70%, improved user experience.',
    },
  ];
  
  // Add company-specific questions based on values
  if (companyResearch.values && companyResearch.values.length > 0) {
    companyResearch.values.slice(0, 2).forEach((value, idx) => {
      baseQuestions.push({
        id: `b-company-${idx + 3}`,
        question: `Tell me about a time you demonstrated ${value}`,
        type: 'behavioral',
        category: value,
        difficulty: 'Medium',
        topics: [value, 'Company Values'],
        starGuidance: {
          Situation: `Describe a situation where ${value} was important`,
          Task: 'What was your role?',
          Action: `How did you demonstrate ${value}?`,
          Result: 'What was the impact?',
        },
        hints: [`Connect your example to ${value}`, 'Be specific', 'Show impact'],
        sampleAnswer: `Situation: [Context]... Task: [Your role]... Action: I demonstrated ${value} by... Result: [Outcome]...`,
      });
    });
  }
  
  return baseQuestions;
};

// Generate study guide
const generateStudyGuide = (company, role, companyResearch, roleResearch, technologies) => {
  return [
    {
      topic: 'Company-Specific Preparation',
      concepts: [
        `Research ${company}'s recent products and initiatives`,
        `Understand ${company}'s tech stack: ${companyResearch.techStack?.join(', ') || 'Various technologies'}`,
        `Study ${company}'s values: ${companyResearch.values?.join(', ') || 'Innovation, Quality'}`,
        `Review ${company}'s interview process`,
        'Prepare questions about the team and culture',
        ...(companyResearch.recentNews || []).map(news => `Research: ${news}`),
      ],
    },
    {
      topic: roleResearch.keyTopics?.[0] || 'Technical Fundamentals',
      concepts: roleResearch.keyTopics || [
        'Data structures and algorithms',
        'System design principles',
        'Object-oriented design',
      ],
    },
    {
      topic: 'Key Technologies',
      concepts: [
        ...technologies,
        ...(companyResearch.techStack || []).slice(0, 3),
      ],
    },
    {
      topic: 'Interview Strategy',
      concepts: [
        'Practice coding problems daily (LeetCode, HackerRank)',
        'Review system design fundamentals',
        'Prepare STAR method stories',
        'Practice explaining your thought process',
        'Prepare questions to ask the interviewer',
        ...(companyResearch.interviewTips || []),
      ],
    },
  ];
};

// Generate interview prep
export const generateInterviewPrep = async (req, res) => {
  try {
    const { company, role, technologies = [], interviewDate, jobDescription, useResume } = req.body;
    
    if (!company || !role) {
      return res.status(400).json({
        success: false,
        error: 'Company and role are required'
      });
    }
    
    // Get deep research
    const deepResearch = researchService.getDeepResearch(company, role);
    const { company: companyResearch, role: roleResearch } = deepResearch;
    
    // Generate questions
    const technicalQuestions = generateTechnicalQuestions(
      company,
      role,
      technologies,
      roleResearch,
      companyResearch
    );
    
    const behavioralQuestions = generateBehavioralQuestions(
      company,
      role,
      companyResearch
    );
    
    const studyGuide = generateStudyGuide(
      company,
      role,
      companyResearch,
      roleResearch,
      technologies
    );
    
    // Create prep object
    const prepId = `prep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const prep = {
      id: prepId,
      prepId,
      userId: req.user?.id || '1', // From auth middleware
      company,
      role,
      technologies,
      interviewDate: interviewDate || null,
      jobDescription: jobDescription || null,
      useResume: useResume || false,
      createdAt: new Date().toISOString(),
      status: 'completed',
      companyResearch,
      roleResearch,
      materials: {
        technicalQuestions,
        behavioralQuestions,
        studyGuide,
        keyTopics: [...technologies, ...(roleResearch.keyTopics || [])],
      },
    };
    
    res.json({
      success: true,
      data: {
        prepId: prep.prepId,
        status: 'completed',
        message: 'Interview prep generated successfully',
        prep: prep,
      }
    });
  } catch (error) {
    console.error('Generate interview prep error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate interview prep'
    });
  }
};

// Get interview prep
export const getInterviewPrep = async (req, res) => {
  try {
    const { prepId } = req.params;
    
    // In real implementation, fetch from database
    // For now, return error (should be stored in DB)
    res.status(404).json({
      success: false,
      error: 'Interview prep not found. Please generate a new one.'
    });
  } catch (error) {
    console.error('Get interview prep error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interview prep'
    });
  }
};

// Get interview history
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user?.id || '1';
    
    // In real implementation, fetch from database
    res.json({
      success: true,
      data: {
        preps: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interview history'
    });
  }
};

// Delete interview prep
export const deleteInterviewPrep = async (req, res) => {
  try {
    const { prepId } = req.params;
    
    // In real implementation, delete from database
    res.json({
      success: true,
      message: 'Interview prep deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview prep error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete interview prep'
    });
  }
};

