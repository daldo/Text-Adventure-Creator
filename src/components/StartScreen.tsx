import React from 'react';
import { useGameStore } from '../store/gameStore';
import GenreSelection from './GenreSelection';
import ThemeInput from './ThemeInput';
import Button from './UI/Button';
import Card from './UI/Card';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StartScreen: React.FC = () => {
  const { 
    startGame, 
    selectedGenres, 
    isLoading,
    setShowApiKeyModal,
    isApiKeyConfigured
  } = useGameStore();
  
  const handleStart = () => {
    if (selectedGenres.length > 0) {
      if (!isApiKeyConfigured()) {
        setShowApiKeyModal(true);
      } else {
        startGame();
      }
    }
  };
  
  const handleApiKeyClick = () => {
    setShowApiKeyModal(true);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 text-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-3"
          >
            <BookOpen className="h-12 w-12 text-purple-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Instant Text Adventure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Create a personalized adventure in seconds, perfect for your journey
          </p>
          <div className="flex justify-center">
            <div className="bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full text-xs text-purple-800 dark:text-purple-300 flex items-center gap-1">
              <Sparkles size={12} />
              <span>Powered by OpenAI</span>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="mb-6 p-5">
          <GenreSelection />
          <ThemeInput />
          
          {!isApiKeyConfigured() && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-2">
                You need to set up your OpenAI API key to generate adventures.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleApiKeyClick}
                className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
              >
                Set API Key
              </Button>
            </div>
          )}
          
          <Button
            onClick={handleStart}
            disabled={selectedGenres.length === 0 || isLoading}
            fullWidth
            size="lg"
            className="mt-2"
            icon={isLoading ? <Sparkles className="animate-pulse" size={20} /> : <BookOpen size={20} />}
          >
            {isLoading ? 'Creating Your Adventure...' : 'Begin Your Adventure'}
          </Button>
          
          {selectedGenres.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2">
              Please select at least one genre to begin
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default StartScreen;
