import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    role: '',
    experienceLevel: '',
    skills: [],
    interests: [],
    customSkill: '',
  });

  const steps = [
    { title: 'Your Role', description: 'What role are you interested in?' },
    { title: 'Experience Level', description: 'How much experience do you have?' },
    { title: 'Skills', description: 'What are your key skills?' },
    { title: 'Interests', description: 'What areas interest you?' },
  ];

  const roles = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'DevOps Engineer',
    'Full Stack Developer',
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior (5-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' },
  ];

  const skillsOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 
    'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'Machine Learning', 'TypeScript', 'Go', 'C++',
  ];

  const interestsOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'UI/UX Design',
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding data:', formData);
    navigate('/main');
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addCustomSkill = () => {
    if (formData.customSkill && !formData.skills.includes(formData.customSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill],
        customSkill: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    index < currentStep
                      ? 'bg-blue-600 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300'
                  }`}
                >
                  {index < currentStep ? <Check size={18} /> : index + 1}
                </div>
                <p className="text-xs font-medium">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>

          {/* Step 0: Role Selection */}
          {currentStep === 0 && (
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === role
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Experience Level */}
          {currentStep === 1 && (
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    formData.experienceLevel === level.value
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Skills */}
          {currentStep === 2 && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {skillsOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                      formData.skills.includes(skill)
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom skill"
                  value={formData.customSkill}
                  onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                />
                <Button onClick={addCustomSkill} variant="secondary">
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {interestsOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.interests.includes(interest)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handleBack}
            variant="secondary"
            disabled={currentStep === 0}
          >
            <ChevronLeft size={20} />
            Back
          </Button>
          <Button onClick={handleNext} variant="primary">
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;