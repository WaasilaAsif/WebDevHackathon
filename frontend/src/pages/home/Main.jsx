import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, TrendingUp, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUploader from '../../components/upload/FileUploader';
import SkillChart from '../../components/dashboard/SkillChart';
import JobCard from '../../components/jobs/JobCard';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';

const Main = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - Developer B will fetch from API
  const stats = [
    { label: 'Resume Uploaded', value: 'Yes', icon: Upload, color: 'bg-green-50 text-green-600' },
    { label: 'Jobs Matched', value: '12', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Match Score', value: '78%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Interviews Prepped', value: '3', icon: Target, color: 'bg-orange-50 text-orange-600' },
  ];

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      postedDate: '2 days ago',
      matchScore: 92,
      requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
      salary: '$120k - $160k',
      jobType: 'Full-time',
      matchExplanation: 'Excellent match based on your React and TypeScript expertise',
      userSkills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
      missingSkills: ['AWS Certification'],
      description: 'We are looking for an experienced frontend developer...'
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      postedDate: '5 days ago',
      matchScore: 85,
      requirements: ['React', 'Node.js', 'MongoDB', 'Docker'],
      salary: '$100k - $140k',
      jobType: 'Full-time',
      matchExplanation: 'Strong match with your full-stack background',
      userSkills: ['React', 'Node.js', 'JavaScript'],
      missingSkills: ['Docker', 'Kubernetes'],
      description: 'Join our fast-growing startup...'
    },
  ];

  const handleFileSelect = (file) => {
    console.log('File selected:', file);
    // Developer B will handle upload
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, User! 👋</h1>
        <p className="text-blue-100">
          Your AI-powered career assistant is ready to help you find the perfect opportunities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} padding="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Resume */}
        <Card title="Upload Your Resume" icon={Upload}>
          <p className="text-gray-600 mb-4">
            Upload your resume to get personalized job recommendations and skill analysis
          </p>
          <FileUploader onFileSelect={handleFileSelect} />
        </Card>

        {/* Skill Analysis */}
        <Card title="Your Skills" icon={TrendingUp}>
          <SkillChart />
        </Card>
      </div>

      {/* Job Recommendations */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recommended Jobs</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={handleJobClick}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/interview')}
          >
            <Briefcase size={20} />
            Start Interview Prep
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/history')}
          >
            <Target size={20} />
            View History
          </Button>
        </div>
      </Card>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Main;