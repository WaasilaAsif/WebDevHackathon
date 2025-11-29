import React from 'react';
import { MapPin, Building2, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

const JobCard = ({ job, onViewDetails }) => {
  const {
    title = 'Software Engineer',
    company = 'Tech Company',
    location = 'Remote',
    postedDate = '2 days ago',
    matchScore = 85,
    requirements = [],
    salary = 'Competitive',
    jobType = 'Full-time'
  } = job || {};

  // Color coding for match score
  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 size={16} />
            <span className="font-medium">{company}</span>
          </div>
        </div>
        
        {/* Match Score Badge */}
        <div className={`px-4 py-2 rounded-lg ${getMatchColor(matchScore)}`}>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} />
            <span className="font-bold text-lg">{matchScore}%</span>
          </div>
          <p className="text-xs font-medium">{getMatchLabel(matchScore)}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>Posted {postedDate}</span>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {jobType}
        </span>
      </div>

      {/* Salary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Salary:</span> {salary}
        </p>
      </div>

      {/* Key Requirements */}
      {requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Key Requirements:</p>
          <div className="flex flex-wrap gap-2">
            {requirements.slice(0, 4).map((req, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {req}
              </span>
            ))}
            {requirements.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{requirements.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button
          onClick={() => onViewDetails && onViewDetails(job)}
          variant="primary"
          fullWidth
        >
          View Details
        </Button>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ExternalLink size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;