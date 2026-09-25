import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-200';
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-default' : '';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
