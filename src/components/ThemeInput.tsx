import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Sparkles } from 'lucide-react';

const ThemeInput: React.FC = () => {
  const { customPrompt, setCustomPrompt } = useGameStore();
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Custom setting (optional)
        </h2>
        <Sparkles size={16} className="text-amber-500" />
      </div>
      
      <div className={`
        relative border rounded-lg transition-all duration-200
        ${isFocused
          ? 'border-purple-500 shadow-sm shadow-purple-100 dark:shadow-none'
          : 'border-gray-300 dark:border-gray-700'}
        bg-white dark:bg-gray-800
      `}>
        <textarea
          value={customPrompt}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe a setting or theme for your adventure (e.g., 'abandoned lunar colony' or 'medieval castle')"
          className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          rows={3}
        />
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Add details to personalize your adventure
      </p>
    </div>
  );
};

export default ThemeInput;
