import React from 'react';
import { X, MapPin, Building2, DollarSign, Calendar, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const {
    title = 'Software Engineer',
    company = 'Tech Company',
    location = 'Remote',
    postedDate = '2 days ago',
    matchScore = 85,
    requirements = [],
    description = 'No description available',
    salary = 'Competitive',
    jobType = 'Full-time',
    matchExplanation = 'This role matches your profile based on your skills and experience.',
    userSkills = [],
    missingSkills = []
  } = job;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={18} />
              <span className="font-medium text-lg">{company}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={18} className="text-blue-600" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={18} className="text-blue-600" />
              <span>Posted {postedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <DollarSign size={18} className="text-blue-600" />
              <span>{salary}</span>
            </div>
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {jobType}
              </span>
            </div>
          </div>

          {/* Match Score */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">Match Score</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                <span className="text-3xl font-bold text-blue-600">{matchScore}%</span>
              </div>
            </div>
            <p className="text-gray-700">{matchExplanation}</p>
          </div>

          {/* Skills Match */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={18} />
                Matching Skills
              </h4>
              <div className="space-y-2">
                {userSkills.length > 0 ? (
                  userSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No matching skills listed</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <XCircle className="text-orange-600" size={18} />
                Skills to Develop
              </h4>
              <div className="space-y-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{skill}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skill gaps identified</p>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {description}
            </p>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="primary" fullWidth>
              Apply Now
            </Button>
            <Button variant="secondary" fullWidth onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;