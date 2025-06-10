import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

// Translation keys and their values for each language
const translations = {
  en: {
    newGame: 'New Game',
    selectGenres: 'Select Genres',
    customTheme: 'Custom Theme (Optional)',
    customThemePlaceholder: 'e.g., "a haunted Victorian mansion" or "cyberpunk Tokyo"',
    beginAdventure: 'Begin Your Adventure',
    creatingAdventure: 'Creating Your Adventure...',
    selectAtLeastOne: 'Please select at least one genre to begin',
    poweredBy: 'Powered by OpenAI',
    apiKeyRequired: 'OpenAI API Key Required',
    enterApiKey: 'Enter your OpenAI API key to generate adventures',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'Save API Key',
    cancel: 'Cancel',
    invalidApiKey: 'Please enter a valid OpenAI API key',
    genres: {
      fantasy: 'Fantasy',
      scifi: 'Sci-Fi',
      mystery: 'Mystery',
      horror: 'Horror',
      adventure: 'Adventure',
      romance: 'Romance',
      thriller: 'Thriller',
      western: 'Western'
    }
  },
  es: {
    newGame: 'Nuevo Juego',
    selectGenres: 'Seleccionar Géneros',
    customTheme: 'Tema Personalizado (Opcional)',
    customThemePlaceholder: 'ej., "una mansión victoriana embrujada" o "Tokio cyberpunk"',
    beginAdventure: 'Comenzar Tu Aventura',
    creatingAdventure: 'Creando Tu Aventura...',
    selectAtLeastOne: 'Por favor selecciona al menos un género para comenzar',
    poweredBy: 'Impulsado por OpenAI',
    apiKeyRequired: 'Clave API de OpenAI Requerida',
    enterApiKey: 'Ingresa tu clave API de OpenAI para generar aventuras',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'Guardar Clave API',
    cancel: 'Cancelar',
    invalidApiKey: 'Por favor ingresa una clave API de OpenAI válida',
    genres: {
      fantasy: 'Fantasía',
      scifi: 'Ciencia Ficción',
      mystery: 'Misterio',
      horror: 'Terror',
      adventure: 'Aventura',
      romance: 'Romance',
      thriller: 'Suspenso',
      western: 'Oeste'
    }
  },
  fr: {
    newGame: 'Nouveau Jeu',
    selectGenres: 'Sélectionner les Genres',
    customTheme: 'Thème Personnalisé (Optionnel)',
    customThemePlaceholder: 'ex., "un manoir victorien hanté" ou "Tokyo cyberpunk"',
    beginAdventure: 'Commencer Votre Aventure',
    creatingAdventure: 'Création de Votre Aventure...',
    selectAtLeastOne: 'Veuillez sélectionner au moins un genre pour commencer',
    poweredBy: 'Alimenté par OpenAI',
    apiKeyRequired: 'Clé API OpenAI Requise',
    enterApiKey: 'Entrez votre clé API OpenAI pour générer des aventures',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'Sauvegarder la Clé API',
    cancel: 'Annuler',
    invalidApiKey: 'Veuillez entrer une clé API OpenAI valide',
    genres: {
      fantasy: 'Fantaisie',
      scifi: 'Science-Fiction',
      mystery: 'Mystère',
      horror: 'Horreur',
      adventure: 'Aventure',
      romance: 'Romance',
      thriller: 'Thriller',
      western: 'Western'
    }
  },
  de: {
    newGame: 'Neues Spiel',
    selectGenres: 'Genres Auswählen',
    customTheme: 'Benutzerdefiniertes Thema (Optional)',
    customThemePlaceholder: 'z.B., "ein verwunschenes viktorianisches Herrenhaus" oder "Cyberpunk Tokyo"',
    beginAdventure: 'Dein Abenteuer Beginnen',
    creatingAdventure: 'Erstelle Dein Abenteuer...',
    selectAtLeastOne: 'Bitte wähle mindestens ein Genre aus, um zu beginnen',
    poweredBy: 'Angetrieben von OpenAI',
    apiKeyRequired: 'OpenAI API-Schlüssel Erforderlich',
    enterApiKey: 'Gib deinen OpenAI API-Schlüssel ein, um Abenteuer zu generieren',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'API-Schlüssel Speichern',
    cancel: 'Abbrechen',
    invalidApiKey: 'Bitte gib einen gültigen OpenAI API-Schlüssel ein',
    genres: {
      fantasy: 'Fantasy',
      scifi: 'Science-Fiction',
      mystery: 'Krimi',
      horror: 'Horror',
      adventure: 'Abenteuer',
      romance: 'Romantik',
      thriller: 'Thriller',
      western: 'Western'
    }
  },
  ja: {
    newGame: '新しいゲーム',
    selectGenres: 'ジャンルを選択',
    customTheme: 'カスタムテーマ（オプション）',
    customThemePlaceholder: '例：「呪われたビクトリア朝の邸宅」や「サイバーパンク東京」',
    beginAdventure: '冒険を始める',
    creatingAdventure: '冒険を作成中...',
    selectAtLeastOne: '開始するには少なくとも1つのジャンルを選択してください',
    poweredBy: 'OpenAI搭載',
    apiKeyRequired: 'OpenAI APIキーが必要',
    enterApiKey: '冒険を生成するためにOpenAI APIキーを入力してください',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'APIキーを保存',
    cancel: 'キャンセル',
    invalidApiKey: '有効なOpenAI APIキーを入力してください',
    genres: {
      fantasy: 'ファンタジー',
      scifi: 'SF',
      mystery: 'ミステリー',
      horror: 'ホラー',
      adventure: 'アドベンチャー',
      romance: 'ロマンス',
      thriller: 'スリラー',
      western: 'ウエスタン'
    }
  },
  zh: {
    newGame: '新游戏',
    selectGenres: '选择类型',
    customTheme: '自定义主题（可选）',
    customThemePlaceholder: '例如："闹鬼的维多利亚式豪宅"或"赛博朋克东京"',
    beginAdventure: '开始你的冒险',
    creatingAdventure: '正在创建你的冒险...',
    selectAtLeastOne: '请至少选择一个类型开始',
    poweredBy: '由OpenAI驱动',
    apiKeyRequired: '需要OpenAI API密钥',
    enterApiKey: '输入你的OpenAI API密钥来生成冒险',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: '保存API密钥',
    cancel: '取消',
    invalidApiKey: '请输入有效的OpenAI API密钥',
    genres: {
      fantasy: '奇幻',
      scifi: '科幻',
      mystery: '悬疑',
      horror: '恐怖',
      adventure: '冒险',
      romance: '浪漫',
      thriller: '惊悚',
      western: '西部'
    }
  },
  pt: {
    newGame: 'Novo Jogo',
    selectGenres: 'Selecionar Gêneros',
    customTheme: 'Tema Personalizado (Opcional)',
    customThemePlaceholder: 'ex., "uma mansão vitoriana assombrada" ou "Tóquio cyberpunk"',
    beginAdventure: 'Começar Sua Aventura',
    creatingAdventure: 'Criando Sua Aventura...',
    selectAtLeastOne: 'Por favor, selecione pelo menos um gênero para começar',
    poweredBy: 'Alimentado por OpenAI',
    apiKeyRequired: 'Chave API OpenAI Necessária',
    enterApiKey: 'Digite sua chave API OpenAI para gerar aventuras',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'Salvar Chave API',
    cancel: 'Cancelar',
    invalidApiKey: 'Por favor, digite uma chave API OpenAI válida',
    genres: {
      fantasy: 'Fantasia',
      scifi: 'Ficção Científica',
      mystery: 'Mistério',
      horror: 'Terror',
      adventure: 'Aventura',
      romance: 'Romance',
      thriller: 'Thriller',
      western: 'Faroeste'
    }
  },
  ru: {
    newGame: 'Новая Игра',
    selectGenres: 'Выбрать Жанры',
    customTheme: 'Пользовательская Тема (Необязательно)',
    customThemePlaceholder: 'напр., "призрачный викторианский особняк" или "киберпанк Токио"',
    beginAdventure: 'Начать Приключение',
    creatingAdventure: 'Создание Приключения...',
    selectAtLeastOne: 'Пожалуйста, выберите хотя бы один жанр для начала',
    poweredBy: 'На базе OpenAI',
    apiKeyRequired: 'Требуется API-ключ OpenAI',
    enterApiKey: 'Введите ваш API-ключ OpenAI для генерации приключений',
    apiKeyPlaceholder: 'sk-...',
    saveApiKey: 'Сохранить API-ключ',
    cancel: 'Отмена',
    invalidApiKey: 'Пожалуйста, введите действительный API-ключ OpenAI',
    genres: {
      fantasy: 'Фэнтези',
      scifi: 'Научная Фантастика',
      mystery: 'Детектив',
      horror: 'Ужасы',
      adventure: 'Приключения',
      romance: 'Романтика',
      thriller: 'Триллер',
      western: 'Вестерн'
    }
  }
};

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageByCode: (code: string) => Language | undefined;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: SUPPORTED_LANGUAGES[0], // Default to English
      setLanguage: (language) => set({ currentLanguage: language }),
      getLanguageByCode: (code) => SUPPORTED_LANGUAGES.find(lang => lang.code === code),
      t: (key: string) => {
        const { currentLanguage } = get();
        const langTranslations = translations[currentLanguage.code as keyof typeof translations] || translations.en;
        
        // Handle nested keys like 'genres.fantasy'
        const keys = key.split('.');
        let value: any = langTranslations;
        
        for (const k of keys) {
          value = value?.[k];
        }
        
        return value || key; // Return the key if translation not found
      },
    }),
    {
      name: 'language-preference',
    }
  )
);
