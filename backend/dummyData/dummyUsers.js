export const dummyUsers = [
  {
    _id: "64f1a1f1e1f1a1f1a1f1a1f1", // sample Mongo ObjectId
    fullName: "Alice Johnson",
    email: "alice@example.com",
    skills: ["node.js", "react", "mongodb", "express", "docker"],
    parsedResume: {
      skills: [
        { name: "Node.js", proficiency: "advanced" },
        { name: "React", proficiency: "intermediate" },
        { name: "MongoDB", proficiency: "advanced" },
        { name: "Express", proficiency: "advanced" },
        { name: "Docker", proficiency: "intermediate" }
      ],
      experience: [
        { company: "TechCorp", position: "Backend Developer", techUsed: ["Node.js","MongoDB","Docker"], duration: "2 years" },
      ],
      education: [
        { degree: "BSc Computer Science", institution: "MIT", gpa: 3.8, startYear: 2015, endYear: 2019 }
      ],
      insights: {
        primaryDomains: ["Software Development", "Web Development"],
        recommendedRoles: ["Backend Developer", "Full Stack Developer"]
      }
    }
  },
  {
    _id: "64f1a2f2e2f2a2f2a2f2a2f2",
    fullName: "Bob Smith",
    email: "bob@example.com",
    skills: ["python", "django", "aws", "docker"],
    parsedResume: {
      skills: [
        { name: "Python", proficiency: "advanced" },
        { name: "Django", proficiency: "advanced" },
        { name: "AWS", proficiency: "intermediate" },
        { name: "Docker", proficiency: "intermediate" }
      ],
      experience: [
        { company: "CloudCorp", position: "Backend Developer", techUsed: ["Python","Django","AWS"], duration: "3 years" }
      ],
      education: [
        { degree: "BSc Information Technology", institution: "Stanford", gpa: 3.6, startYear: 2014, endYear: 2018 }
      ],
      insights: {
        primaryDomains: ["Cloud Computing", "Backend Development"],
        recommendedRoles: ["Backend Developer", "Cloud Engineer"]
      }
    }
  }
];
