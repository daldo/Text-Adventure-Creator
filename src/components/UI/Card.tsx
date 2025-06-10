import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  elevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  bordered = false,
  elevated = true,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-lg
        p-4
        ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
        ${elevated ? 'shadow-md dark:shadow-gray-900/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
