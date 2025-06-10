import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLanguageStore } from '../store/languageStore';
import Loading from './UI/Loading';
import SpeakerIcon from './UI/SpeakerIcon';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './UI/Card';
import Button from './UI/Button';
import { ArrowLeft, Book, RefreshCw } from 'lucide-react';

const GameDisplay: React.FC = () => {
  const { 
    isPlaying, 
    isLoading, 
    storyText, 
    currentOptions, 
    selectOption, 
    resetGame,
    lastContentUpdate
  } = useGameStore();
  
  const { currentLanguage } = useLanguageStore();
  
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedSegments, setHighlightedSegments] = useState<Set<number>>(new Set());
  const [previousStoryText, setPreviousStoryText] = useState('');
  const lastSegmentRef = useRef<HTMLDivElement>(null);
  
  // Track story segments for highlighting new content
  const storySegments = storyText.split('\n\n').filter(segment => segment.trim());
  
  // Localized UI text
  const getLocalizedText = () => {
    switch (currentLanguage.code) {
      case 'de':
        return {
          back: 'Zurück',
          restart: 'Neustart',
          yourAdventure: 'Dein Abenteuer',
          whatWillYouDo: 'Was wirst du tun?',
          storyLoading: 'Die Geschichte wird fortgesetzt...'
        };
      case 'es':
        return {
          back: 'Atrás',
          restart: 'Reiniciar',
          yourAdventure: 'Tu Aventura',
          whatWillYouDo: '¿Qué harás?',
          storyLoading: 'La historia continúa...'
        };
      case 'fr':
        return {
          back: 'Retour',
          restart: 'Redémarrer',
          yourAdventure: 'Votre Aventure',
          whatWillYouDo: 'Que ferez-vous ?',
          storyLoading: 'L\'histoire continue...'
        };
      case 'ja':
        return {
          back: '戻る',
          restart: '再開',
          yourAdventure: 'あなたの冒険',
          whatWillYouDo: 'どうしますか？',
          storyLoading: '物語が続いています...'
        };
      case 'zh':
        return {
          back: '返回',
          restart: '重新开始',
          yourAdventure: '你的冒险',
          whatWillYouDo: '你会怎么做？',
          storyLoading: '故事继续中...'
        };
      case 'pt':
        return {
          back: 'Voltar',
          restart: 'Reiniciar',
          yourAdventure: 'Sua Aventura',
          whatWillYouDo: 'O que você fará?',
          storyLoading: 'A história continua...'
        };
      case 'ru':
        return {
          back: 'Назад',
          restart: 'Перезапуск',
          yourAdventure: 'Ваше Приключение',
          whatWillYouDo: 'Что вы будете делать?',
          storyLoading: 'История продолжается...'
        };
      default:
        return {
          back: 'Back',
          restart: 'Restart',
          yourAdventure: 'Your Adventure',
          whatWillYouDo: 'What will you do?',
          storyLoading: 'The story continues...'
        };
    }
  };
  
  const localizedText = getLocalizedText();
  
  // Scroll to new content function
  const scrollToNewContent = useCallback(() => {
    // Try multiple scroll strategies for better reliability
    const scrollStrategies = [
      // Strategy 1: Scroll to last segment if ref exists
      () => {
        if (lastSegmentRef.current) {
          lastSegmentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          return true;
        }
        return false;
      },
      
      // Strategy 2: Scroll to bottom of container
      () => {
        if (storyContainerRef.current) {
          const container = storyContainerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
          return true;
        }
        return false;
      },
      
      // Strategy 3: Force scroll using requestAnimationFrame
      () => {
        if (storyContainerRef.current) {
          const container = storyContainerRef.current;
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight;
          });
          return true;
        }
        return false;
      }
    ];
    
    // Try each strategy until one succeeds
    for (const strategy of scrollStrategies) {
      if (strategy()) {
        console.log('Scroll strategy succeeded');
        break;
      }
    }
  }, []);
  
  // Handle new content detection and scrolling
  useEffect(() => {
    // Only proceed if we have story text and it's different from previous
    if (!storyText || storyText === previousStoryText || isLoading) {
      return;
    }
    
    console.log('New content detected, story length:', storyText.length);
    
    // Determine which segments are new
    const previousSegments = previousStoryText.split('\n\n').filter(segment => segment.trim());
    const newSegmentIndices = new Set<number>();
    
    // Find segments that are new (beyond the previous count)
    for (let i = previousSegments.length; i < storySegments.length; i++) {
      newSegmentIndices.add(i);
    }
    
    // Only highlight and scroll if we actually have new segments
    if (newSegmentIndices.size > 0) {
      console.log('Highlighting segments:', Array.from(newSegmentIndices));
      
      // Set highlighting for new segments
      setHighlightedSegments(newSegmentIndices);
      
      // Scroll to new content with multiple timing attempts for reliability
      const scrollAttempts = [100, 300, 500]; // Multiple timing attempts
      
      scrollAttempts.forEach((delay, index) => {
        setTimeout(() => {
          console.log(`Scroll attempt ${index + 1} at ${delay}ms`);
          scrollToNewContent();
        }, delay);
      });
      
      // Remove highlighting after animation completes
      setTimeout(() => {
        setHighlightedSegments(new Set());
      }, 4000);
    }
    
    // Update previous story text
    setPreviousStoryText(storyText);
  }, [storyText, isLoading, previousStoryText, storySegments.length, scrollToNewContent]);
  
  // Reset tracking when game resets
  useEffect(() => {
    if (!isPlaying) {
      setPreviousStoryText('');
      setHighlightedSegments(new Set());
    }
  }, [isPlaying]);
  
  // Additional effect to handle lastContentUpdate changes
  useEffect(() => {
    if (lastContentUpdate > 0 && !isLoading && storyText) {
      console.log('Content update detected via timestamp');
      // Small delay then scroll
      setTimeout(() => {
        scrollToNewContent();
      }, 200);
    }
  }, [lastContentUpdate, isLoading, storyText, scrollToNewContent]);
  
  // Helper function to determine if a segment is LLM-generated content
  const isLLMGeneratedSegment = (segment: string): boolean => {
    // Player choices start with ">" - these are not LLM generated
    return !segment.trim().startsWith('>');
  };
  
  if (!isPlaying) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetGame}
          icon={<ArrowLeft size={16} />}
        >
          {localizedText.back}
        </Button>
        <h2 className="text-xl font-serif font-medium text-center text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Book size={20} className="text-purple-600" />
          {localizedText.yourAdventure}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetGame}
          icon={<RefreshCw size={16} />}
        >
          {localizedText.restart}
        </Button>
      </div>
      
      <div 
        ref={storyContainerRef}
        className="flex-1 overflow-y-auto mb-4 bg-amber-50 dark:bg-gray-900 rounded-lg p-5 shadow-inner font-serif text-gray-800 dark:text-gray-200 leading-relaxed scroll-smooth"
        style={{ maxHeight: 'calc(100vh - 16rem)' }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <Loading message={localizedText.storyLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {storySegments.map((segment, index) => {
                const isHighlighted = highlightedSegments.has(index);
                const isLastSegment = index === storySegments.length - 1;
                const isLLMGenerated = isLLMGeneratedSegment(segment);
                
                // Build className dynamically to avoid template literal issues
                const baseClasses = 'mb-6 p-4 rounded-lg transition-all duration-1000 ease-out';
                const highlightClasses = isHighlighted 
                  ? 'bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100 dark:from-purple-900/40 dark:via-blue-900/20 dark:to-purple-900/40 border-l-4 border-purple-500 dark:border-purple-400 shadow-lg ring-1 ring-purple-200 dark:ring-purple-700' 
                  : 'bg-transparent';
                const pulseClasses = isHighlighted ? 'animate-pulse-subtle' : '';
                const scrollClasses = isLastSegment ? 'scroll-mt-4' : '';
                
                const combinedClasses = [baseClasses, highlightClasses, pulseClasses, scrollClasses]
                  .filter(Boolean)
                  .join(' ');
                
                return (
                  <motion.div
                    key={`segment-${index}-${segment.slice(0, 20)}`}
                    ref={isLastSegment ? lastSegmentRef : null}
                    initial={isHighlighted ? { 
                      opacity: 0, 
                      y: 20,
                      scale: 0.95
                    } : false}
                    animate={isHighlighted ? { 
                      opacity: 1, 
                      y: 0,
                      scale: 1
                    } : {}}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeOut",
                      delay: isHighlighted ? 0.1 : 0
                    }}
                    className={combinedClasses}
                    style={{
                      animationDuration: isHighlighted ? '3s' : '0s',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className={`transition-all duration-700 leading-relaxed ${
                          isHighlighted 
                            ? 'text-gray-900 dark:text-gray-100 font-medium text-lg' 
                            : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {segment}
                        </p>
                      </div>
                      
                      {/* Speaker icon only for LLM-generated content */}
                      {isLLMGenerated && (
                        <div className="flex-shrink-0 mt-1">
                          <SpeakerIcon 
                            text={segment}
                            className="opacity-70 hover:opacity-100"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && isHighlighted && (
                      <div className="text-xs text-purple-600 mt-2 opacity-50">
                        New content (segment {index}) - LLM: {isLLMGenerated ? 'Yes' : 'No'}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Scroll anchor at the bottom */}
              <div 
                ref={storySegments.length === 0 ? lastSegmentRef : null}
                className="h-1"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Card className="bg-white dark:bg-gray-800 p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                {localizedText.whatWillYouDo}
              </h3>
              <div className="flex flex-col gap-2">
                {currentOptions.map((option, index) => (
                  <Button 
                    key={index}
                    variant={index === 0 ? 'primary' : 'outline'}
                    onClick={() => selectOption(option)}
                    fullWidth
                    className="text-left justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameDisplay;
