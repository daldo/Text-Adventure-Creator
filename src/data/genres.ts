import { Genre } from '../types';
import { AlignCenter as Alien, Castle, Ghost, Globe, Mountain, Skull, Sparkles, Swords } from 'lucide-react';

export const genres: Genre[] = [
  {
    id: 'scifi',
    name: 'Sci-Fi',
    icon: 'Alien',
    description: 'Futuristic tales of space, technology, and exploration',
    color: 'bg-indigo-700 dark:bg-indigo-600'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: 'Sparkles',
    description: 'Magic, mythical creatures, and legendary quests',
    color: 'bg-amber-600 dark:bg-amber-500'
  },
  {
    id: 'horror',
    name: 'Horror',
    icon: 'Skull',
    description: 'Terrifying stories that will keep you on edge',
    color: 'bg-red-800 dark:bg-red-700'
  },
  {
    id: 'mystery',
    name: 'Mystery',
    icon: 'Ghost',
    description: 'Puzzling events and secrets waiting to be uncovered',
    color: 'bg-purple-800 dark:bg-purple-700'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: 'Mountain',
    description: 'Exciting journeys and discoveries',
    color: 'bg-emerald-700 dark:bg-emerald-600'
  },
  {
    id: 'historical',
    name: 'Historical',
    icon: 'Swords',
    description: 'Stories set in fascinating past eras',
    color: 'bg-amber-800 dark:bg-amber-700'
  },
  {
    id: 'dystopian',
    name: 'Dystopian',
    icon: 'Globe',
    description: 'Dark futures and societal collapse',
    color: 'bg-slate-700 dark:bg-slate-600'
  },
  {
    id: 'medieval',
    name: 'Medieval',
    icon: 'Castle',
    description: 'Tales of knights, castles, and medieval intrigue',
    color: 'bg-stone-700 dark:bg-stone-600'
  }
];

export const getGenreById = (id: string): Genre | undefined => {
  return genres.find(genre => genre.id === id);
};

export const getGenreIcon = (iconName: string) => {
  switch (iconName) {
    case 'Alien': return Alien;
    case 'Sparkles': return Sparkles;
    case 'Skull': return Skull;
    case 'Ghost': return Ghost;
    case 'Mountain': return Mountain;
    case 'Swords': return Swords;
    case 'Globe': return Globe;
    case 'Castle': return Castle;
    default: return Sparkles;
  }
};
