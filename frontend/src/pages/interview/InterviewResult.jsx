import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, BookOpen, CheckCircle, Code, Users, Lightbulb, ArrowLeft, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useInterview } from '../../hooks/useInterview';

const InterviewResult = () => {
  const { prepId } = useParams();
  const navigate = useNavigate();
  const { getPrep, loading, error } = useInterview();
  const [interviewData, setInterviewData] = useState(null);
  const [markedQuestions, setMarkedQuestions] = useState([]);

  // Fetch interview prep data
  useEffect(() => {
    const loadPrep = async () => {
      if (!prepId) {
        console.error('No prepId provided');
        return;
      }

      const result = await getPrep(prepId);
      
      if (result.success && result.data) {
        // Transform service data to component format
        const prep = result.data;
        setInterviewData({
          company: prep.company,
          role: prep.role,
          generatedAt: new Date(prep.createdAt || Date.now()).toLocaleDateString(),
          companySummary: prep.companyResearch?.summary || prep.companyResearch?.company?.summary || 'Company information',
          companyResearch: prep.companyResearch,
          roleResearch: prep.roleResearch,
          technicalQuestions: (prep.materials?.technicalQuestions || []).map((q, idx) => ({
            id: q.id || `tech-${idx}`,
            question: q.question,
            difficulty: q.difficulty || 'Medium',
            topic: q.topic || q.topics?.[0] || 'General',
            topics: q.topics || (q.topic ? [q.topic] : []),
            hints: q.hints || [],
            sampleAnswer: q.sampleAnswer || '',
            estimatedTime: q.estimatedTime || '20-30 minutes',
          })),
          behavioralQuestions: (prep.materials?.behavioralQuestions || []).map((q, idx) => ({
            id: q.id || `behavioral-${idx}`,
            question: q.question,
            category: q.category || 'General',
            difficulty: q.difficulty || 'Medium',
            topics: q.topics || [],
            starGuidance: q.starGuidance || {
              Situation: 'Describe the situation',
              Task: 'What was your task?',
              Action: 'What actions did you take?',
              Result: 'What were the results?',
            },
            hints: q.hints || [],
            sampleAnswer: q.sampleAnswer || '',
          })),
          studyGuide: prep.materials?.studyGuide || [],
        });
      } else {
        console.error('Failed to load prep:', result.error);
      }
    };

    if (prepId) {
      loadPrep();
    }
  }, [prepId, getPrep]);

  const toggleMark = (questionId, type) => {
    const key = `${type}-${questionId}`;
    setMarkedQuestions(prev =>
      prev.includes(key)
        ? prev.filter(q => q !== key)
        : [...prev, key]
    );
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = () => {
    if (!interviewData) return;
    
    const dataStr = JSON.stringify(interviewData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `interview-prep-${interviewData.company}-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Loading state
  if (loading && !interviewData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-600">Loading interview preparation...</p>
      </div>
    );
  }

  // Error state
  if (error && !interviewData) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <Code size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Interview Prep</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/interview')} variant="primary">
                <ArrowLeft size={20} />
                Back to Interview Prep
              </Button>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // No data state
  if (!interviewData) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">No interview data found.</p>
            <Button onClick={() => navigate('/interview')} variant="primary" className="mt-4">
              <ArrowLeft size={20} />
              Create New Interview Prep
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button 
            onClick={() => navigate('/interview')} 
            variant="outline" 
            size="sm"
            className="mb-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Preparation: {interviewData.company}
          </h1>
          <p className="text-gray-600">
            {interviewData.role} • Generated on {interviewData.generatedAt}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download size={20} />
          Export JSON
        </Button>
      </div>

      {/* Company Summary */}
      <Card title="Company Overview" icon={Lightbulb}>
        <p className="text-gray-700 leading-relaxed">{interviewData.companySummary}</p>
      </Card>

      {/* Technical Questions */}
      <Card title="Technical Questions" icon={Code}>
        <div className="space-y-4">
          {interviewData.technicalQuestions.map((q) => {
            const isMarked = markedQuestions.includes(`tech-${q.id}`);
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isMarked ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {q.topic}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {q.question}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleMark(q.id, 'tech')}
                    className={`p-2 rounded-lg transition-colors ${
                      isMarked ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>
                
                {/* Hints */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Hints:</p>
                  <ul className="space-y-1">
                    {q.hints.map((hint, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Behavioral Questions */}
      <Card title="Behavioral Questions" icon={Users}>
        <div className="space-y-4">
          {interviewData.behavioralQuestions.map((q) => {
            const isMarked = markedQuestions.includes(`behavioral-${q.id}`);
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isMarked ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-2 inline-block">
                      {q.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {q.question}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleMark(q.id, 'behavioral')}
                    className={`p-2 rounded-lg transition-colors ${
                      isMarked ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                </div>

                {/* STAR Framework */}
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-bold text-gray-700">STAR Framework:</p>
                  {Object.entries(q.starGuidance).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-bold text-purple-600 uppercase text-xs w-20">
                        {key}:
                      </span>
                      <span className="text-sm text-gray-600 flex-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Study Guide */}
      <Card title="Study Guide" icon={BookOpen}>
        <div className="space-y-6">
          {interviewData.studyGuide.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                {section.topic}
              </h3>
              <ul className="space-y-2 pl-4">
                {section.concepts.map((concept, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Summary */}
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Your Progress</h3>
          <div className="flex justify-center gap-8">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {markedQuestions.filter(q => q.startsWith('tech-')).length}
              </p>
              <p className="text-sm text-gray-600">Technical Questions Practiced</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {markedQuestions.filter(q => q.startsWith('behavioral-')).length}
              </p>
              <p className="text-sm text-gray-600">Behavioral Questions Prepared</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InterviewResult;