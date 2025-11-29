import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
  padding = 'p-6',
  hover = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${padding} ${
        hover ? 'hover:shadow-xl transition-shadow duration-300' : ''
      } ${className}`}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          {Icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="text-blue-600" size={24} />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;