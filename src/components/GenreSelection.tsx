import React from 'react';
import { genres } from '../data/genres';
import Badge from './UI/Badge';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

const GenreSelection: React.FC = () => {
  const { selectedGenres, toggleGenre } = useGameStore();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Choose your adventure type
      </h2>
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {genres.map((genre) => (
          <motion.div key={genre.id} variants={itemVariants}>
            <Badge
              genre={genre}
              isSelected={selectedGenres.includes(genre.id)}
              onClick={() => toggleGenre(genre.id)}
            />
          </motion.div>
        ))}
      </motion.div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Select one or more genres to shape your adventure
      </p>
    </div>
  );
};

export default GenreSelection;
