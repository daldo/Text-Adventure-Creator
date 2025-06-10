export type Genre = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

export type GameState = {
  isPlaying: boolean;
  isLoading: boolean;
  storyText: string;
  currentOptions: string[];
  storyHistory: StorySegment[];
  selectedGenres: string[];
  customPrompt: string;
  offline: boolean;
};

export type StorySegment = {
  text: string;
  options: string[];
  selectedOption?: string;
};

export type Theme = 'light' | 'dark';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};
