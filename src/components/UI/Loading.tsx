import React from 'react';
import { useLanguageStore } from '../../store/languageStore';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  const { currentLanguage } = useLanguageStore();
  
  const getLocalizedMessage = (msg?: string) => {
    if (msg) return msg;
    
    switch (currentLanguage.code) {
      case 'de':
        return 'Die Geschichte wird geladen...';
      case 'es':
        return 'Cargando la historia...';
      case 'fr':
        return 'Chargement de l\'histoire...';
      case 'ja':
        return '物語を読み込んでいます...';
      case 'zh':
        return '正在加载故事...';
      case 'pt':
        return 'Carregando a história...';
      case 'ru':
        return 'Загрузка истории...';
      default:
        return 'Loading story...';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Animated book icon */}
        <div className="w-16 h-16 mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg animate-pulse"></div>
          <div className="absolute inset-1 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded opacity-80 animate-bounce"></div>
          </div>
        </div>
        
        {/* Floating dots animation */}
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-center mt-4 font-medium">
        {getLocalizedMessage(message)}
      </p>
    </div>
  );
};

export default Loading;
