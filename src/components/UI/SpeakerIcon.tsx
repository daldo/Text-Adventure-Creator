import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { generateSpeech } from '../../services/openaiService';
import { useLanguageStore } from '../../store/languageStore';

interface SpeakerIconProps {
  text: string;
  className?: string;
}

const SpeakerIcon: React.FC<SpeakerIconProps> = ({ text, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { currentLanguage } = useLanguageStore();

  const handleSpeak = async () => {
    try {
      // If already playing, stop the current audio
      if (isPlaying && currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
        setCurrentAudio(null);
        return;
      }

      setIsLoading(true);

      // Clean text for TTS (remove markdown, special characters, etc.)
      const cleanText = text
        .replace(/>/g, '') // Remove quote markers
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/\*/g, '') // Remove italic markdown
        .replace(/\n+/g, ' ') // Replace line breaks with spaces
        .trim();

      // Generate speech using OpenAI TTS
      const audioBuffer = await generateSpeech(cleanText, currentLanguage.code);
      
      // Create audio blob and URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and configure audio element
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl); // Clean up blob URL
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing audio');
      };

      setCurrentAudio(audio);
      await audio.play();
      
    } catch (error) {
      console.error('Error generating or playing speech:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const getTooltipText = () => {
    switch (currentLanguage.code) {
      case 'de':
        return isPlaying ? 'Audio stoppen' : 'Text vorlesen';
      case 'es':
        return isPlaying ? 'Detener audio' : 'Leer texto';
      case 'fr':
        return isPlaying ? 'Arrêter l\'audio' : 'Lire le texte';
      case 'ja':
        return isPlaying ? 'オーディオを停止' : 'テキストを読む';
      case 'zh':
        return isPlaying ? '停止音频' : '朗读文本';
      case 'pt':
        return isPlaying ? 'Parar áudio' : 'Ler texto';
      case 'ru':
        return isPlaying ? 'Остановить аудио' : 'Прочитать текст';
      default:
        return isPlaying ? 'Stop audio' : 'Read text aloud';
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center
        w-8 h-8 rounded-full
        bg-purple-100 hover:bg-purple-200 
        dark:bg-purple-900/30 dark:hover:bg-purple-800/40
        text-purple-600 dark:text-purple-400
        transition-all duration-200
        hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        ${className}
      `}
      title={getTooltipText()}
      aria-label={getTooltipText()}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isPlaying ? (
        <VolumeX size={16} />
      ) : (
        <Volume2 size={16} />
      )}
    </button>
  );
};

export default SpeakerIcon;
