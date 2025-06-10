import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import GameDisplay from './components/GameDisplay';
import ApiKeyModal from './components/ApiKeyModal';

function App() {
  const { isPlaying, showApiKeyModal, setShowApiKeyModal } = useGameStore();
  const { theme, toggleTheme } = useThemeStore();
  
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
      
      {/* Powered by Bolt Badge */}
      <footer className="py-4 flex justify-center">
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
            className="w-16 h-16 transition-transform duration-200 group-hover:rotate-3"
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
    </div>
  );
}

export default App;