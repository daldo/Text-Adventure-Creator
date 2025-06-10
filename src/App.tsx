import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameDisplay from './components/GameDisplay';
import ApiKeyModal from './components/ApiKeyModal';
import DisclaimerModal from './components/DisclaimerModal';

function App() {
  const { isPlaying, showApiKeyModal, setShowApiKeyModal } = useGameStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className={`
      min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
      transition-colors duration-200 flex flex-col
    `}>
      <div className="container mx-auto max-w-2xl px-4 py-4 flex-1">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main className="pb-16">
          {isPlaying ? <GameDisplay /> : <StartScreen />}
        </main>
      </div>
      
      {/* Footer with Disclaimer and Badge */}
      <footer className="py-6 flex flex-col items-center gap-4">
        {/* Public Domain Disclaimer */}
        <div className="text-center px-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-2">
            🌐 <strong>Public Domain:</strong> This application and its generated content are released to the public domain. 
            You are free to use, modify, and distribute this work without restriction.
          </p>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors"
          >
            Read Full Disclaimer & Terms
          </button>
        </div>
        
        {/* Powered by Bolt Badge */}
        <a 
          href="https://bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group transition-all duration-200 hover:scale-105 opacity-80 hover:opacity-100"
          aria-label="Powered by Bolt"
        >
          <img 
            src="/black_circle_360x360.png" 
            alt="Powered by Bolt" 
            className="w-32 h-32 transition-transform duration-200 group-hover:rotate-3"
          />
        </a>
      </footer>
      
      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSuccess={() => {
          // After successful API key setup, we can proceed with the game
          setShowApiKeyModal(false);
        }}
      />
      
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </div>
  );
}

export default App;