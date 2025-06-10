import React from 'react';
import { Genre } from '../../types';
import { getGenreIcon } from '../../data/genres';

interface BadgeProps {
  genre: Genre;
  isSelected: boolean;
  onClick: () => void;
}

const Badge: React.FC<BadgeProps> = ({ genre, isSelected, onClick }) => {
  const IconComponent = getGenreIcon(genre.icon);
  
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 ease-in-out
        ${isSelected 
          ? `${genre.color} text-white shadow-md scale-105` 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
      `}
      aria-pressed={isSelected}
    >
      <IconComponent size={16} className={isSelected ? 'animate-pulse' : ''} />
      <span>{genre.name}</span>
    </button>
  );
};

export default Badge;
