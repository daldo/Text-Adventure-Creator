export interface StorySegment {
  text: string;
  options: string[];
  selectedOption?: string;
}

export interface GameState {
  isPlaying: boolean;
  isLoading: boolean;
  storyText: string;
  currentOptions: string[];
  storyHistory: StorySegment[];
  selectedGenres: string[];
  customPrompt: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}
