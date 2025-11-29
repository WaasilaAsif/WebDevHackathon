import React, { useState } from 'react';
import { Download, BookOpen, CheckCircle, Code, Users, Lightbulb } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const InterviewResult = () => {
  // Mock data - Developer B will fetch from API
  const [interviewData] = useState({
    company: 'Google',
    role: 'Senior Software Engineer',
    generatedAt: new Date().toLocaleDateString(),
    companySummary: 'Google is a technology company focused on search, advertising, cloud computing, and various software products. Known for rigorous technical interviews and strong engineering culture.',
    technicalQuestions: [
      {
        id: 1,
        question: 'Design a rate limiter for an API service',
        difficulty: 'Hard',
        topic: 'System Design',
        hints: ['Consider different rate limiting algorithms', 'Think about distributed systems', 'How to handle edge cases'],
      },
      {
        id: 2,
        question: 'Implement a LRU Cache with O(1) operations',
        difficulty: 'Medium',
        topic: 'Data Structures',
        hints: ['Use HashMap and Doubly Linked List', 'Track access order', 'Handle capacity limits'],
      },
      {
        id: 3,
        question: 'Find the longest palindromic substring in a string',
        difficulty: 'Medium',
        topic: 'Algorithms',
        hints: ['Consider dynamic programming', 'Expand around center approach', 'Edge cases with single characters'],
      },
      {
        id: 4,
        question: 'Explain how HTTPS works and the TLS handshake process',
        difficulty: 'Medium',
        topic: 'Networking',
        hints: ['Certificate exchange', 'Public/private key encryption', 'Session keys'],
      },
    ],
    behavioralQuestions: [
      {
        id: 1,
        question: 'Tell me about a time when you had to resolve a conflict within your team',
        category: 'Teamwork',
        starGuidance: {
          situation: 'Describe the team context and the conflict',
          task: 'What was your role in resolving it?',
          action: 'What specific steps did you take?',
          result: 'What was the outcome and what did you learn?',
        },
      },
      {
        id: 2,
        question: 'Describe a situation where you had to meet a tight deadline',
        category: 'Time Management',
        starGuidance: {
          situation: 'Set the context of the project',
          task: 'What was the deadline and your responsibility?',
          action: 'How did you prioritize and manage your time?',
          result: 'Did you meet the deadline? What was the impact?',
        },
      },
      {
        id: 3,
        question: 'Give an example of when you took initiative on a project',
        category: 'Leadership',
        starGuidance: {
          situation: 'Describe the opportunity you identified',
          task: 'What needed to be done?',
          action: 'What initiative did you take?',
          result: 'What was the outcome?',
        },
      },
    ],
    studyGuide: [
      {
        topic: 'System Design',
        concepts: [
          'Scalability patterns (horizontal vs vertical)',
          'Load balancing strategies',
          'Caching mechanisms (Redis, Memcached)',
          'Database sharding and replication',
          'Microservices architecture',
        ],
      },
      {
        topic: 'Data Structures & Algorithms',
        concepts: [
          'Hash tables and collision handling',
          'Binary trees (BST, AVL, Red-Black)',
          'Graph algorithms (DFS, BFS, Dijkstra)',
          'Dynamic programming patterns',
          'Time and space complexity analysis',
        ],
      },
      {
        topic: 'Networking',
        concepts: [
          'TCP/IP protocol stack',
          'HTTP/HTTPS and REST principles',
          'DNS resolution process',
          'WebSockets and real-time communication',
          'CDN and edge computing',
        ],
      },
    ],
  });

  const [markedQuestions, setMarkedQuestions] = useState([]);

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
    const dataStr = JSON.stringify(interviewData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `interview-prep-${interviewData.company}.json`;
    
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Preparation: {interviewData.company}
          </h1>
          <p className="text-gray-600">
            {interviewData.role} • Generated on {interviewData.generatedAt}
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download size={20} />
          Export PDF
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