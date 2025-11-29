import React, { useState, useEffect } from 'react';
import { FileText, Briefcase, Calendar, Eye, Trash2, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../../hooks/useResume';
import { useInterview } from '../../hooks/useInterview';

const History = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, resume, interview
  const { getHistory: getResumeHistory, loading: resumeLoading } = useResume();
  const { getHistory: getInterviewHistory, deletePrep, loading: interviewLoading } = useInterview();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [resumeResult, interviewResult] = await Promise.all([
        getResumeHistory(),
        getInterviewHistory()
      ]);

      const items = [];

      // Add resume analyses
      if (resumeResult.success && resumeResult.data?.analyses) {
        resumeResult.data.analyses.forEach((analysis) => {
          items.push({
            id: analysis.id,
            type: 'resume',
            title: 'Resume Analysis',
            date: analysis.uploadedAt || analysis.createdAt,
            description: `${analysis.fileName || 'Resume'} - Analysis completed`,
            status: analysis.status || 'completed',
          });
        });
      }

      // Add interview preps
      if (interviewResult.success && interviewResult.data?.preps) {
        interviewResult.data.preps.forEach((prep) => {
          items.push({
            id: prep.id || prep.prepId,
            type: 'interview',
            title: `${prep.company} - ${prep.role}`,
            date: prep.createdAt,
            description: `Interview prep for ${prep.role} position`,
            status: prep.status || 'completed',
          });
        });
      }

      // Sort by date (newest first)
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistoryItems(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback - Developer B will fetch from API
  const mockHistoryItems = [
    {
      id: '1',
      type: 'resume',
      title: 'Resume Analysis',
      date: '2024-01-15',
      description: 'Software Engineer resume - 5 skills analyzed',
      status: 'completed',
    },
    {
      id: '2',
      type: 'interview',
      title: 'Google - Senior Software Engineer',
      date: '2024-01-14',
      description: '15 technical questions, 5 behavioral questions generated',
      status: 'completed',
    },
    {
      id: '3',
      type: 'resume',
      title: 'Updated Resume Analysis',
      date: '2024-01-10',
      description: 'Full Stack Developer resume - 8 skills analyzed',
      status: 'completed',
    },
    {
      id: '4',
      type: 'interview',
      title: 'Amazon - Data Scientist',
      date: '2024-01-08',
      description: '12 technical questions, 4 behavioral questions generated',
      status: 'completed',
    },
    {
      id: '5',
      type: 'interview',
      title: 'Microsoft - Product Manager',
      date: '2024-01-05',
      description: '10 behavioral questions, 8 product questions generated',
      status: 'completed',
    },
  ];

  const filteredItems = filter === 'all'
    ? (historyItems.length > 0 ? historyItems : mockHistoryItems)
    : (historyItems.length > 0 ? historyItems : mockHistoryItems).filter(item => item.type === filter);

  const getIcon = (type) => {
    return type === 'resume' ? FileText : Briefcase;
  };

  const getIconColor = (type) => {
    return type === 'resume'
      ? 'bg-blue-100 text-blue-600'
      : 'bg-purple-100 text-purple-600';
  };

  const handleView = (item) => {
    if (item.type === 'resume') {
      navigate(`/resume-result/${item.id}`);
    } else {
      navigate(`/interview-result/${item.id}`);
    }
  };

  const handleDelete = async (item) => {
    try {
      if (item.type === 'interview') {
        const result = await deletePrep(item.id);
        if (result.success) {
          // Reload history
          loadHistory();
        }
      } else {
        // Resume deletion would go here if implemented
        console.log('Delete resume analysis:', item.id);
        loadHistory();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">History</h1>
        <p className="text-gray-600">
          View and manage your past resume analyses and interview preparations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {historyItems.filter(i => i.type === 'resume').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Resume Analyses</p>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {historyItems.filter(i => i.type === 'interview').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Interview Preps</p>
          </div>
        </Card>
        <Card padding="p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {historyItems.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Sessions</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
          >
            <Filter size={16} />
            All
          </Button>
          <Button
            onClick={() => setFilter('resume')}
            variant={filter === 'resume' ? 'primary' : 'secondary'}
            size="sm"
          >
            <FileText size={16} />
            Resume Analyses
          </Button>
          <Button
            onClick={() => setFilter('interview')}
            variant={filter === 'interview' ? 'primary' : 'secondary'}
            size="sm"
          >
            <Briefcase size={16} />
            Interview Preps
          </Button>
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <FileText className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No history found
              </h3>
              <p className="text-gray-600 mb-6">
                Start by uploading a resume or creating interview prep materials
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => navigate('/main')} variant="primary">
                  Upload Resume
                </Button>
                <Button onClick={() => navigate('/interview')} variant="secondary">
                  Start Interview Prep
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const Icon = getIcon(item.type);
            return (
              <Card key={item.id} hover>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${getIconColor(item.type)}`}>
                    <Icon size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(item)}
                          variant="primary"
                          size="sm"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDelete(item)}
                          variant="danger"
                          size="sm"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination (if needed) */}
      {filteredItems.length > 10 && (
        <Card>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing 1-{Math.min(10, filteredItems.length)} of {filteredItems.length} items
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                Previous
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default History;