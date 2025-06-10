import { create } from 'zustand';
import { GameState } from '../types';
import { generateStory, generateResponse, isOpenAIConfigured } from '../services/openaiService';
import { useLanguageStore } from './languageStore';

interface GameStore extends GameState {
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setStoryText: (text: string) => void;
  setOptions: (options: string[]) => void;
  toggleGenre: (genreId: string) => void;
  setCustomPrompt: (prompt: string) => void;
  startGame: () => Promise<void>;
  selectOption: (option: string) => Promise<void>;
  resetGame: () => void;
  showApiKeyModal: boolean;
  setShowApiKeyModal: (show: boolean) => void;
  isApiKeyConfigured: () => boolean;
  // New properties for content tracking
  lastContentUpdate: number;
  setLastContentUpdate: (timestamp: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  isPlaying: false,
  isLoading: false,
  storyText: '',
  currentOptions: [],
  storyHistory: [],
  selectedGenres: [],
  customPrompt: '',
  showApiKeyModal: false,
  lastContentUpdate: 0,

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setStoryText: (storyText) => set({ 
    storyText,
    lastContentUpdate: Date.now() // Track when content was updated
  }),
  setOptions: (currentOptions) => set({ currentOptions }),
  setLastContentUpdate: (lastContentUpdate) => set({ lastContentUpdate }),
  
  toggleGenre: (genreId) => set((state) => {
    if (state.selectedGenres.includes(genreId)) {
      return { selectedGenres: state.selectedGenres.filter(id => id !== genreId) };
    } else {
      return { selectedGenres: [...state.selectedGenres, genreId] };
    }
  }),
  
  setCustomPrompt: (customPrompt) => set({ customPrompt }),
  
  startGame: async () => {
    const { selectedGenres, customPrompt } = get();
    
    if (selectedGenres.length === 0) {
      // Must select at least one genre
      return;
    }
    
    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      set({ showApiKeyModal: true });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      // Get current language from language store
      const currentLanguage = useLanguageStore.getState().currentLanguage.code;
      
      const { storyText, options } = await generateStory(
        selectedGenres, 
        customPrompt, 
        currentLanguage
      );
      
      set({
        isPlaying: true,
        isLoading: false,
        storyText,
        currentOptions: options,
        storyHistory: [{ text: storyText, options }],
        lastContentUpdate: Date.now()
      });
    } catch (error) {
      console.error('Failed to start game:', error);
      set({ 
        isLoading: false,
        showApiKeyModal: true
      });
    }
  },
  
  selectOption: async (option) => {
    const { storyHistory } = get();
    
    // Add the selected option to the current history item
    const updatedHistory = [...storyHistory];
    const currentSegment = updatedHistory[updatedHistory.length - 1];
    currentSegment.selectedOption = option;
    
    set({ isLoading: true, storyHistory: updatedHistory });
    
    try {
      // Get current language from language store
      const currentLanguage = useLanguageStore.getState().currentLanguage.code;
      
      const { storyText, options } = await generateResponse(
        storyHistory, 
        option, 
        currentLanguage
      );
      
      // Update the story text by appending the player's choice and the new text
      const fullStoryText = get().storyText + 
        `\n\n> ${option}\n\n${storyText}`;
      
      set({
        isLoading: false,
        storyText: fullStoryText,
        currentOptions: options,
        storyHistory: [...updatedHistory, { text: storyText, options }],
        lastContentUpdate: Date.now() // Track content update for highlighting
      });
    } catch (error) {
      console.error('Failed to generate response:', error);
      set({ 
        isLoading: false,
        showApiKeyModal: true
      });
    }
  },
  
  resetGame: () => set({
    isPlaying: false,
    storyText: '',
    currentOptions: [],
    storyHistory: [],
    lastContentUpdate: 0
  }),
  
  setShowApiKeyModal: (showApiKeyModal) => set({ showApiKeyModal }),
  
  isApiKeyConfigured: () => isOpenAIConfigured()
}));
