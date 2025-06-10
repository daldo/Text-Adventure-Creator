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
      transition-colors duration-200
    `}>
      <div className="container mx-auto max-w-2xl px-4 py-4">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main className="pb-16">
          {isPlaying ? <GameDisplay /> : <StartScreen />}
        </main>
      </div>
      
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
