import React, { useState } from 'react';
import { Download, Edit2, Save, Briefcase, GraduationCap, Code, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SkillChart from '../../components/dashboard/SkillChart';

const ResumeResult = () => {
  // Mock data - Developer B will fetch from API based on resume ID
  const [resumeData, setResumeData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    summary: 'Full-stack developer with 5 years of experience in building scalable web applications',
    skills: [
      { name: 'React', proficiency: 90, level: 'Expert' },
      { name: 'Node.js', proficiency: 85, level: 'Advanced' },
      { name: 'Python', proficiency: 75, level: 'Intermediate' },
      { name: 'AWS', proficiency: 70, level: 'Intermediate' },
      { name: 'MongoDB', proficiency: 80, level: 'Advanced' },
    ],
    experiences: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        startDate: '2021-01',
        endDate: '2024-01',
        bullets: [
          'Led development of microservices architecture',
          'Reduced API response time by 40%',
          'Mentored junior developers',
        ],
        techTags: ['React', 'Node.js', 'AWS', 'Docker'],
      },
      {
        id: '2',
        title: 'Software Engineer',
        company: 'StartupXYZ',
        startDate: '2019-06',
        endDate: '2021-01',
        bullets: [
          'Built RESTful APIs using Express.js',
          'Implemented CI/CD pipelines',
        ],
        techTags: ['Node.js', 'MongoDB', 'React'],
      },
    ],
    education: [
      {
        school: 'State University',
        degree: 'B.Sc. Computer Science',
        startDate: '2015',
        endDate: '2019',
      },
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution with payment integration',
        techTags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
        link: 'https://github.com/johndoe/ecommerce',
      },
      {
        title: 'Task Management App',
        description: 'Real-time collaborative task management application',
        techTags: ['React', 'Socket.io', 'MongoDB'],
      },
    ],
    inferredRoles: [
      { role: 'Full Stack Developer', score: 92 },
      { role: 'Backend Engineer', score: 88 },
      { role: 'Frontend Developer', score: 85 },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Developer B will implement save functionality
    console.log('Saving profile:', resumeData);
    setIsEditing(false);
  };

  const handleExport = () => {
    // Export as JSON
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'resume-analysis.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analysis</h1>
          <p className="text-gray-600">AI-powered insights from your resume</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline">
            <Download size={20} />
            Export
          </Button>
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            variant={isEditing ? 'success' : 'primary'}
          >
            {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      <Card>
        <div className="text-center pb-4 border-b border-gray-200 mb-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
            {resumeData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{resumeData.name}</h2>
          <p className="text-gray-600">{resumeData.email}</p>
        </div>
        <p className="text-gray-700 text-center">{resumeData.summary}</p>
      </Card>

      {/* Inferred Roles */}
      <Card title="Recommended Roles" icon={Award}>
        <div className="space-y-3">
          {resumeData.inferredRoles.map((role, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-800">{role.role}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${role.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-blue-600">{role.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Skills Chart */}
      <SkillChart skills={resumeData.skills} />

      {/* Experience */}
      <Card title="Work Experience" icon={Briefcase}>
        <div className="space-y-6">
          {resumeData.experiences.map((exp) => (
            <div key={exp.id} className="border-l-4 border-blue-600 pl-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{exp.title}</h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              <ul className="space-y-1 mb-3">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {exp.techTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Education */}
      <Card title="Education" icon={GraduationCap}>
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                <p className="text-gray-600">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects */}
      <Card title="Projects" icon={Code}>
        <div className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-1">{project.title}</h3>
              <p className="text-gray-700 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResumeResult;