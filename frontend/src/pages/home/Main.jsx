import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Briefcase, TrendingUp, Target } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUploader from '../../components/upload/FileUploader';
import SkillChart from '../../components/dashboard/SkillChart';
import JobCard from '../../components/jobs/JobCard';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';
import { useResume } from '../../hooks/useResume';
import { useInterview } from '../../hooks/useInterview';
import jobService from '../../services/jobService';
import { useAuth } from '../../hooks/useAuth';

const Main = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, getProfile } = useResume();
  const { getHistory: getInterviewHistory } = useInterview();
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Resume Uploaded', value: 'No', icon: Upload, color: 'bg-gray-50 text-gray-600' },
    { label: 'Jobs Matched', value: '0', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { label: 'Avg Match Score', value: '0%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Interviews Prepped', value: '0', icon: Target, color: 'bg-orange-50 text-orange-600' },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch profile to check if resume is uploaded
      const profileResult = await getProfile();
      
      // Fetch matched jobs
      let jobsResult = null;
      let jobStatsResult = null;
      try {
        jobsResult = await jobService.getMatchedJobs();
        jobStatsResult = await jobService.getJobStats();
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
      
      // Fetch interview history
      const interviewHistoryResult = await getInterviewHistory();
      
      // Update stats
      setStats([
        { 
          label: 'Resume Uploaded', 
          value: profileResult.success && profileResult.data ? 'Yes' : 'No', 
          icon: Upload, 
          color: profileResult.success && profileResult.data ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600' 
        },
        { 
          label: 'Jobs Matched', 
          value: jobsResult?.jobs?.length?.toString() || '0', 
          icon: Briefcase, 
          color: 'bg-blue-50 text-blue-600' 
        },
        { 
          label: 'Avg Match Score', 
          value: jobStatsResult?.averageMatchScore ? `${jobStatsResult.averageMatchScore}%` : '0%', 
          icon: TrendingUp, 
          color: 'bg-purple-50 text-purple-600' 
        },
        { 
          label: 'Interviews Prepped', 
          value: interviewHistoryResult?.success ? interviewHistoryResult.data?.preps?.length?.toString() || '0' : '0', 
          icon: Target, 
          color: 'bg-orange-50 text-orange-600' 
        },
      ]);
      
      // Set jobs (limit to 2 for display)
      if (jobsResult?.jobs) {
        setJobs(jobsResult.jobs.slice(0, 2).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          postedDate: new Date(job.postedDate).toLocaleDateString(),
          matchScore: job.compatibilityScore || job.matchScore,
          requirements: job.requirements || job.technologies || [],
          salary: job.salary ? `$${job.salary.min/1000}k - $${job.salary.max/1000}k` : 'Not specified',
          jobType: 'Full-time',
          matchExplanation: job.recommendations || 'Good match based on your profile',
          userSkills: job.alignedSkills || [],
          missingSkills: job.missingSkills || [],
          description: job.description || ''
        })));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    navigate('/resume-upload');
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || 'User'}! 👋</h1>
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
          <Button variant="outline" onClick={() => navigate('/main')}>View All</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={handleJobClick}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600">No jobs matched yet. Upload your resume to get personalized recommendations!</p>
            </div>
          </Card>
        )}
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