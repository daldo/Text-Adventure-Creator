import { StorySegment } from '../types';

// OpenAI client instance
let openaiClient: any = null;

// Initialize OpenAI client
export const initializeOpenAI = (apiKey: string): boolean => {
  try {
    if (!apiKey || apiKey.trim() === '') {
      console.error('OpenAI API key is required');
      return false;
    }
    
    // Store the API key for use in fetch requests
    localStorage.setItem('openai_api_key', apiKey);
    openaiClient = { apiKey };
    
    return true;
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return false;
  }
};

// Check if OpenAI is configured
export const isOpenAIConfigured = (): boolean => {
  const apiKey = getStoredApiKey();
  return !!(apiKey && apiKey !== 'your_openai_api_key_here');
};

// Get stored API key
export const getStoredApiKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

// OpenAI Text-to-Speech integration
export const generateSpeech = async (
  text: string,
  language: string = 'en'
): Promise<ArrayBuffer> => {
  const apiKey = getStoredApiKey();
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    // Map language codes to OpenAI TTS voices
    const voiceMap: Record<string, string> = {
      'en': 'alloy',    // English - neutral voice
      'de': 'echo',     // German - good for European languages
      'es': 'fable',    // Spanish - warm voice
      'fr': 'nova',     // French - pleasant voice
      'ja': 'shimmer',  // Japanese - clear voice
      'zh': 'onyx',     // Chinese - deep voice
      'pt': 'alloy',    // Portuguese - neutral voice
      'ru': 'echo'      // Russian - echo voice
    };
    
    const voice = voiceMap[language] || 'alloy';
    
    // Clean and prepare text for TTS
    const cleanText = text
      .replace(/>/g, '') // Remove quote markers
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Limit text length for TTS (OpenAI has a 4096 character limit)
    const maxLength = 4000;
    const textToSpeak = cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...'
      : cleanText;
    
    if (!textToSpeak || textToSpeak.length < 3) {
      throw new Error('Text too short for speech generation');
    }
    
    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'tts-1', // Use the standard TTS model
        input: textToSpeak,
        voice: voice,
        response_format: 'mp3',
        speed: 1.0
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI TTS API error:', errorData);
      throw new Error(`OpenAI TTS API error: ${errorData.error?.message || response.statusText}`);
    }
    
    // Return the audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    return audioBuffer;
    
  } catch (error) {
    console.error('Error generating speech with OpenAI TTS:', error);
    throw error;
  }
};

// OpenAI integration for text adventure generation
export const generateStory = async (
  genres: string[],
  customPrompt: string,
  language: string = 'en'
): Promise<{ storyText: string; options: string[] }> => {
  const apiKey = getStoredApiKey();
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    // Language-specific system prompts with clearer formatting instructions
    const systemPrompts = {
      en: 'You are a text adventure game creator. You create engaging, immersive text adventures with descriptive scenes and interesting choices. Always respond in English. Format your response with the story text first, then list exactly 4 options numbered 1-4.',
      de: 'Du bist ein Text-Adventure-Spiel-Ersteller. Du erschaffst fesselnde, immersive Text-Adventures mit beschreibenden Szenen und interessanten Wahlmöglichkeiten. Antworte immer auf Deutsch und verwende authentische deutsche Ausdrücke. Formatiere deine Antwort mit dem Geschichtentext zuerst, dann liste genau 4 Optionen nummeriert 1-4 auf.',
      es: 'Eres un creador de juegos de aventuras de texto. Creas aventuras de texto atractivas e inmersivas con escenas descriptivas y opciones interesantes. Siempre responde en español y usa expresiones auténticas españolas. Formatea tu respuesta con el texto de la historia primero, luego enumera exactamente 4 opciones numeradas 1-4.',
      fr: 'Tu es un créateur de jeux d\'aventure textuelle. Tu crées des aventures textuelles engageantes et immersives avec des scènes descriptives et des choix intéressants. Réponds toujours en français et utilise des expressions françaises authentiques. Formate ta réponse avec le texte de l\'histoire d\'abord, puis liste exactement 4 options numérotées 1-4.'
    };
    
    // Construct a prompt based on the selected genres and custom prompt
    const genreText = genres.join(', ');
    let prompt = '';
    
    switch (language) {
      case 'de':
        prompt = `Erstelle die Eröffnungsszene eines ${genreText} Text-Adventure-Spiels`;
        if (customPrompt) {
          prompt += ` das in oder um "${customPrompt}" spielt`;
        }
        prompt += `. Die Antwort sollte einen beschreibenden Eröffnungsabsatz und dann genau 4 nummerierte Optionen (1. 2. 3. 4.) enthalten, was der Spieler als nächstes tun kann. Verwende KEINE Überschriften wie "Optionen:" oder ähnliches.`;
        break;
      case 'es':
        prompt = `Crea la escena de apertura de un juego de aventura de texto de ${genreText}`;
        if (customPrompt) {
          prompt += ` ambientado en o que involucre "${customPrompt}"`;
        }
        prompt += `. La respuesta debe incluir un párrafo de apertura descriptivo y luego exactamente 4 opciones numeradas (1. 2. 3. 4.) de lo que el jugador puede hacer a continuación. NO uses encabezados como "Opciones:" o similares.`;
        break;
      case 'fr':
        prompt = `Crée la scène d'ouverture d'un jeu d'aventure textuelle de ${genreText}`;
        if (customPrompt) {
          prompt += ` se déroulant dans ou impliquant "${customPrompt}"`;
        }
        prompt += `. La réponse doit inclure un paragraphe d'ouverture descriptif puis exactement 4 options numérotées (1. 2. 3. 4.) pour ce que le joueur peut faire ensuite. N'utilise PAS d'en-têtes comme "Options:" ou similaires.`;
        break;
      default:
        prompt = `Create the opening scene of a ${genreText} text adventure game`;
        if (customPrompt) {
          prompt += ` set in or involving "${customPrompt}"`;
        }
        prompt += `. The response should include a descriptive opening paragraph and then exactly 4 numbered options (1. 2. 3. 4.) for what the player can do next. Do NOT use headings like "Options:" or similar.`;
    }
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: language === 'en' ? 500 : 600 // More tokens for non-English languages
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    const content = data.choices[0].message.content;
    
    // Process the response to extract the story text and options
    const parts = processOpenAIResponse(content);
    return parts;
    
  } catch (error) {
    console.error('Error generating story with OpenAI:', error);
    throw error;
  }
};

// Helper function to process OpenAI's response with improved filtering
const processOpenAIResponse = (content: string): { storyText: string; options: string[] } => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Define patterns that should be excluded from options
  const excludePatterns = [
    /^optionen?:?$/i,           // "Optionen:" or "Options:"
    /^choices?:?$/i,            // "Choices:" or "Choice:"
    /^what (will|do) you/i,     // "What will you do?" etc.
    /^was (wirst|machst) du/i,  // German equivalents
    /^que (vas|haces)/i,        // Spanish equivalents
    /^que (feras|fais)/i,       // French equivalents
    /^next steps?:?$/i,         // "Next steps:"
    /^your options?:?$/i,       // "Your options:"
    /^deine optionen?:?$/i,     // German "Deine Optionen:"
    /^tus opciones?:?$/i,       // Spanish "Tus opciones:"
    /^tes options?:?$/i,        // French "Tes options:"
    /^möglichkeiten?:?$/i,      // German "Möglichkeiten:"
    /^posibilidades?:?$/i,      // Spanish "Posibilidades:"
    /^possibilités?:?$/i        // French "Possibilités:"
  ];
  
  const storyLines = [];
  const options = [];
  
  let reachedOptions = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check if this line should be excluded (headers/labels)
    const shouldExclude = excludePatterns.some(pattern => pattern.test(trimmedLine));
    if (shouldExclude) {
      reachedOptions = true; // Mark that we've reached the options section
      continue; // Skip this line entirely
    }
    
    // Look for numbered options (1., 2., etc.) or bullet points
    if (/^\d+\./.test(trimmedLine) || /^[-•*]/.test(trimmedLine) || reachedOptions) {
      reachedOptions = true;
      
      // Extract just the option text without the number or bullet
      let option = trimmedLine
        .replace(/^\d+\.\s*/, '')           // Remove "1. "
        .replace(/^[-•*]\s*/, '')           // Remove "- " or "• "
        .replace(/^Option \d+:\s*/i, '')    // Remove "Option 1: "
        .trim();
      
      // Only add non-empty options that aren't excluded patterns
      if (option && !excludePatterns.some(pattern => pattern.test(option))) {
        options.push(option);
      }
    } else if (!reachedOptions) {
      // This is story text (before we reached options)
      storyLines.push(line);
    }
  }
  
  // If we didn't find any options using the above logic, try a fallback approach
  if (options.length === 0 && lines.length > 4) {
    // Look for the last few lines that might be options
    const potentialOptions = lines.slice(-4).map(line => {
      const trimmed = line.trim();
      // Clean up potential option text
      return trimmed
        .replace(/^\d+\.\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .replace(/^Option \d+:\s*/i, '')
        .trim();
    }).filter(option => {
      // Filter out excluded patterns and empty strings
      return option && !excludePatterns.some(pattern => pattern.test(option));
    });
    
    if (potentialOptions.length > 0) {
      const storyText = lines.slice(0, lines.length - 4).join('\n');
      return {
        storyText,
        options: potentialOptions.slice(0, 4) // Ensure max 4 options
      };
    }
  }
  
  // Final cleanup: ensure we have exactly 4 valid options
  const validOptions = options.filter(option => {
    const trimmed = option.trim();
    return trimmed.length > 0 && !excludePatterns.some(pattern => pattern.test(trimmed));
  });
  
  return {
    storyText: storyLines.join('\n'),
    options: validOptions.slice(0, 4) // Ensure we have max 4 options
  };
};

// Generate next part of the story based on player choice
export const generateResponse = async (
  history: StorySegment[],
  selectedOption: string,
  language: string = 'en'
): Promise<{ storyText: string; options: string[] }> => {
  const apiKey = getStoredApiKey();
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    // Language-specific system prompts with clearer formatting instructions
    const systemPrompts = {
      en: 'You are a text adventure game creator. Continue the story based on the player\'s choices. Each response should include a descriptive paragraph of what happens next and exactly 4 new numbered options (1-4) for the player. Always respond in English. Do NOT use headings like "Options:" or similar.',
      de: 'Du bist ein Text-Adventure-Spiel-Ersteller. Setze die Geschichte basierend auf den Entscheidungen des Spielers fort. Jede Antwort sollte einen beschreibenden Absatz dessen enthalten, was als nächstes passiert, und genau 4 neue nummerierte Optionen (1-4) für den Spieler. Antworte immer auf Deutsch. Verwende KEINE Überschriften wie "Optionen:" oder ähnliches.',
      es: 'Eres un creador de juegos de aventuras de texto. Continúa la historia basándote en las decisiones del jugador. Cada respuesta debe incluir un párrafo descriptivo de lo que sucede a continuación y exactamente 4 nuevas opciones numeradas (1-4) para el jugador. Siempre responde en español. NO uses encabezados como "Opciones:" o similares.',
      fr: 'Tu es un créateur de jeux d\'aventure textuelle. Continue l\'histoire basée sur les choix du joueur. Chaque réponse doit inclure un paragraphe descriptif de ce qui se passe ensuite et exactement 4 nouvelles options numérotées (1-4) pour le joueur. Réponds toujours en français. N\'utilise PAS d\'en-têtes comme "Options:" ou similaires.'
    };
    
    // Construct a context from the story history
    const messages = [
      {
        role: 'system',
        content: systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.en
      }
    ];
    
    // Add the story history as context
    history.forEach((segment, index) => {
      messages.push({
        role: 'assistant',
        content: segment.text + (segment.selectedOption 
          ? `\n\nThe player chose: ${segment.selectedOption}` 
          : '')
      });
    });
    
    // Add the selected option with language-appropriate phrasing
    let choiceText = '';
    switch (language) {
      case 'de':
        choiceText = `Ich wähle: "${selectedOption}"`;
        break;
      case 'es':
        choiceText = `Elijo: "${selectedOption}"`;
        break;
      case 'fr':
        choiceText = `Je choisis: "${selectedOption}"`;
        break;
      default:
        choiceText = `I choose: "${selectedOption}"`;
    }
    
    messages.push({
      role: 'user',
      content: choiceText
    });
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: language === 'en' ? 500 : 600 // More tokens for non-English languages
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    const content = data.choices[0].message.content;
    
    // Process the response
    const parts = processOpenAIResponse(content);
    return parts;
    
  } catch (error) {
    console.error('Error generating response with OpenAI:', error);
    throw error;
  }
};
