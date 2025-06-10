import React from 'react';
import { Moon, Sun, RotateCcw } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useLanguageStore } from '../store/languageStore';
import Button from './UI/Button';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { isPlaying, resetGame } = useGameStore();
  const { t } = useLanguageStore();
  
  return (
    <header className="flex items-center justify-between mb-6 py-2">
      <div className="flex items-center gap-3">
        <LanguageSelector />
        {isPlaying && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            icon={<RotateCcw size={16} />}
            className="text-gray-600 dark:text-gray-400"
          >
            {t('newGame')}
          </Button>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        className="text-gray-600 dark:text-gray-400"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      />
    </header>
  );
};

export default Header;
