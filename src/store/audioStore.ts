import { create } from 'zustand';

interface AudioState {
  currentlyPlaying: string | null;
  isLoading: boolean;
  audioCache: Map<string, string>; // text -> blob URL cache
}

interface AudioStore extends AudioState {
  setCurrentlyPlaying: (textId: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  addToCache: (text: string, blobUrl: string) => void;
  getFromCache: (text: string) => string | undefined;
  clearCache: () => void;
  stopAllAudio: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentlyPlaying: null,
  isLoading: false,
  audioCache: new Map(),

  setCurrentlyPlaying: (textId) => set({ currentlyPlaying: textId }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  addToCache: (text, blobUrl) => {
    const { audioCache } = get();
    const newCache = new Map(audioCache);
    newCache.set(text, blobUrl);
    set({ audioCache: newCache });
  },
  
  getFromCache: (text) => {
    const { audioCache } = get();
    return audioCache.get(text);
  },
  
  clearCache: () => {
    const { audioCache } = get();
    // Revoke all blob URLs to prevent memory leaks
    audioCache.forEach((blobUrl) => {
      URL.revokeObjectURL(blobUrl);
    });
    set({ audioCache: new Map() });
  },
  
  stopAllAudio: () => {
    // Stop any currently playing audio
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    set({ currentlyPlaying: null });
  }
}));
