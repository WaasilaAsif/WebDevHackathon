import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Code, Calendar, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useInterview } from '../../hooks/useInterview';

const InterviewInput = () => {
  const navigate = useNavigate();
  const { generatePrep, loading, error } = useInterview();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    techTags: [],
    interviewDate: '',
    jobDescription: '',
    customTech: '',
    useResume: true,
  });

  const [generalError, setGeneralError] = useState('');

  const suggestedTechs = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java',
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'MongoDB',
    'TypeScript', 'Go', 'System Design', 'Algorithms',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      techTags: prev.techTags.includes(tech)
        ? prev.techTags.filter(t => t !== tech)
        : [...prev.techTags, tech]
    }));
  };

  const addCustomTech = () => {
    if (formData.customTech && !formData.techTags.includes(formData.customTech)) {
      setFormData(prev => ({
        ...prev,
        techTags: [...prev.techTags, prev.customTech],
        customTech: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    // Call the generatePrep function from useInterview hook
    const result = await generatePrep({
      company: formData.company,
      role: formData.role,
      technologies: formData.techTags,
      interviewDate: formData.interviewDate,
      jobDescription: formData.jobDescription,
      useResume: formData.useResume,
    });
    
    if (result.success) {
      console.log('✅ Interview prep generated, redirecting to result');
      navigate(`/interview-result/${result.data.prepId || result.data.id}`, { replace: true });
    } else {
      console.log('❌ Interview prep generation failed:', result.error);
      setGeneralError(result.error || 'Failed to generate interview prep. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
          <Briefcase className="text-purple-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Interview Preparation
        </h1>
        <p className="text-gray-600">
          Get AI-powered interview questions tailored to your role and company
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {generalError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {generalError}
          </div>
        )}
        <Card>
          <div className="space-y-6">
            {/* Company & Role */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google, Amazon, Microsoft"
                icon={Building2}
                required
              />
              <Input
                label="Role/Position"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Data Scientist"
                icon={Briefcase}
                required
              />
            </div>

            {/* Interview Date */}
            <Input
              label="Interview Date (Optional)"
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              icon={Calendar}
            />

            {/* Key Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Technologies/Skills
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                {suggestedTechs.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className={`p-2 rounded-lg border-2 text-sm transition-all ${
                      formData.techTags.includes(tech)
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              
              {/* Custom Tech Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom technology"
                  value={formData.customTech}
                  onChange={(e) => setFormData({ ...formData, customTech: e.target.value })}
                  icon={Code}
                />
                <Button type="button" onClick={addCustomTech} variant="secondary">
                  Add
                </Button>
              </div>

              {/* Selected Tags */}
              {formData.techTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.techTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTech(tag)}
                        className="hover:text-purple-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description (Optional)
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste the job description here for more accurate question generation..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Use Resume Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="useResume"
                checked={formData.useResume}
                onChange={(e) => setFormData({ ...formData, useResume: e.target.checked })}
                className="w-5 h-5 text-blue-600"
              />
              <label htmlFor="useResume" className="text-gray-700">
                <span className="font-medium">Use my resume profile</span>
                <span className="text-sm text-gray-600 block">
                  Customize question difficulty based on your experience level
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading || !formData.company || !formData.role}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Interview Prep...
              </>
            ) : (
              <>
                <FileText size={20} />
                Generate Interview Preparation
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card padding="p-4">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Code className="text-blue-600" size={20} />
            Technical Questions
          </h3>
          <p className="text-sm text-gray-600">
            Role-specific coding and system design questions
          </p>
        </Card>
        
        <Card padding="p-4">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Briefcase className="text-purple-600" size={20} />
            Behavioral Questions
          </h3>
          <p className="text-sm text-gray-600">
            STAR method questions based on the role
          </p>
        </Card>
        
        <Card padding="p-4">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FileText className="text-green-600" size={20} />
            Study Guide
          </h3>
          <p className="text-sm text-gray-600">
            Key concepts and topics to review
          </p>
        </Card>
      </div>
    </div>
  );
};

export default InterviewInput;