import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SkillChart = ({ skills = [] }) => {
  // Default skills for demo
  const defaultSkills = [
    { name: 'React', proficiency: 85, level: 'Advanced' },
    { name: 'Node.js', proficiency: 75, level: 'Intermediate' },
    { name: 'Python', proficiency: 90, level: 'Expert' },
    { name: 'SQL', proficiency: 70, level: 'Intermediate' },
    { name: 'AWS', proficiency: 60, level: 'Beginner' },
  ];

  const data = skills.length > 0 ? skills : defaultSkills;

  // Color coding based on proficiency
  const getColor = (proficiency) => {
    if (proficiency >= 80) return '#10b981'; // green - Expert
    if (proficiency >= 60) return '#3b82f6'; // blue - Intermediate
    return '#f59e0b'; // orange - Beginner
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            Proficiency: {data.proficiency}%
          </p>
          <p className="text-sm text-gray-600">
            Level: {data.level}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Skill Coverage</h3>
      
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No skills data available</p>
          <p className="text-sm mt-2">Upload your resume to see your skill analysis</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Proficiency (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="proficiency" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.proficiency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">Expert (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm text-gray-600">Intermediate (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="text-sm text-gray-600">Beginner (&lt;60%)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkillChart;