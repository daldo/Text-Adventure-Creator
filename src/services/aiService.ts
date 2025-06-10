import { StorySegment } from '../types';

// OpenAI integration for text adventure generation
export const generateStory = async (
  genres: string[],
  customPrompt: string
): Promise<{ storyText: string; options: string[] }> => {
  // Check if API key exists
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.warn('OpenAI API key not found. Using mock data instead.');
    return generateMockStory(genres, customPrompt);
  }
  
  try {
    // Construct a prompt based on the selected genres and custom prompt
    const genreText = genres.join(', ');
    let prompt = `Create the opening scene of a ${genreText} text adventure game`;
    
    if (customPrompt) {
      prompt += ` set in or involving "${customPrompt}"`;
    }
    
    prompt += `. The response should include a descriptive opening paragraph and exactly 4 options for what the player can do next.`;
    
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
            content: 'You are a text adventure game creator. You create engaging, immersive text adventures with descriptive scenes and interesting choices.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error('Failed to generate story with OpenAI');
    }
    
    const content = data.choices[0].message.content;
    
    // Process the response to extract the story text and options
    const parts = processOpenAIResponse(content);
    return parts;
    
  } catch (error) {
    console.error('Error generating story with OpenAI:', error);
    // Fall back to mock data if API call fails
    return generateMockStory(genres, customPrompt);
  }
};

// Helper function to process OpenAI's response
const processOpenAIResponse = (content: string): { storyText: string; options: string[] } => {
  // This is a simple parser - in production you might want more robust parsing
  // or structure the prompt to get a more structured response
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Assume first paragraph(s) are the story text, and lines starting with numbers are options
  const storyLines = [];
  const options = [];
  
  let reachedOptions = false;
  
  for (const line of lines) {
    // Look for numbered options (1., 2., etc.)
    if (/^\d+\./.test(line.trim()) || line.includes('Option') || reachedOptions) {
      reachedOptions = true;
      
      // Extract just the option text without the number
      const option = line.replace(/^\d+\.\s*/, '').replace(/^Option \d+:\s*/i, '').trim();
      if (option) {
        options.push(option);
      }
    } else {
      storyLines.push(line);
    }
  }
  
  // If we didn't find any options using the above logic, assume the last 4 lines are options
  if (options.length === 0 && lines.length > 4) {
    const storyText = lines.slice(0, lines.length - 4).join('\n');
    return {
      storyText,
      options: lines.slice(lines.length - 4)
    };
  }
  
  return {
    storyText: storyLines.join('\n'),
    options: options.slice(0, 4) // Ensure we have exactly 4 options
  };
};

// Generate next part of the story based on player choice
export const generateResponse = async (
  history: StorySegment[],
  selectedOption: string,
  offline: boolean = false
): Promise<{ storyText: string; options: string[] }> => {
  // If offline mode is enabled, use mock data
  if (offline) {
    return generateMockResponse(history, selectedOption);
  }
  
  // Check if API key exists
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.warn('OpenAI API key not found. Using mock data instead.');
    return generateMockResponse(history, selectedOption);
  }
  
  try {
    // Construct a context from the story history
    const messages = [
      {
        role: 'system',
        content: 'You are a text adventure game creator. Continue the story based on the player\'s choices. Each response should include a descriptive paragraph of what happens next and exactly 4 new options for the player.'
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
    
    // Add the selected option
    messages.push({
      role: 'user',
      content: `I choose: "${selectedOption}"`
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
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error('Failed to generate response with OpenAI');
    }
    
    const content = data.choices[0].message.content;
    
    // Process the response
    const parts = processOpenAIResponse(content);
    return parts;
    
  } catch (error) {
    console.error('Error generating response with OpenAI:', error);
    // Fall back to mock data if API call fails
    return generateMockResponse(history, selectedOption);
  }
};

// Mock implementations for fallback or development
const generateMockStory = async (
  genres: string[],
  customPrompt: string
): Promise<{ storyText: string; options: string[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sample responses based on genre
  if (genres.includes('scifi')) {
    return {
      storyText: customPrompt 
        ? `You find yourself on ${customPrompt}. The air is thin, and warning lights flash across the control panel. Something has gone terribly wrong with the life support systems. A message flashes on the nearest terminal: "OXYGEN RESERVES: 3 HOURS REMAINING."`
        : "You awaken from cryo-sleep to blaring alarms. The spaceship's emergency lights cast an eerie red glow across the chamber. According to the ship's AI, you're the only crew member still alive, and the vessel is on a collision course with an uncharted planet.",
      options: [
        "Check the ship's logs to understand what happened",
        "Try to manually override the navigation system",
        "Send a distress signal to nearby systems",
        "Prepare an escape pod for emergency evacuation"
      ]
    };
  } else if (genres.includes('fantasy')) {
    return {
      storyText: customPrompt 
        ? `You are a traveler in the land of ${customPrompt}. The local villagers whisper of a curse that has befallen their ruler, turning night into perpetual day. They say only a hero wielding the Crystal of Moonshadow can restore balance.`
        : "The ancient tome before you glows with an otherworldly light. As your fingers brush against its leather binding, arcane symbols appear on the pages, seemingly writing themselves. A voice echoes in your mind: 'The barrier between worlds grows thin. You have been chosen.'",
      options: [
        "Read further into the mysterious tome",
        "Seek the wisdom of the village elder",
        "Ignore the supernatural signs and continue your journey",
        "Attempt to decipher the arcane symbols"
      ]
    };
  } else if (genres.includes('horror')) {
    return {
      storyText: customPrompt 
        ? `The abandoned ${customPrompt} creaks and moans as if alive. You shouldn't have come here, but curiosity got the better of you. Now, as night falls, you realize the doors have locked themselves behind you.`
        : "The old mansion on the hill has been abandoned for decades. Local legends speak of disappearances and strange lights in the windows at night. Against your better judgment, you decided to investigate. Now you're inside, and the door has locked behind you.",
      options: [
        "Search for another exit",
        "Call out to see if anyone else is in the house",
        "Try to break a window to escape",
        "Explore deeper into the mansion"
      ]
    };
  } else {
    return {
      storyText: customPrompt 
        ? `Your journey begins in ${customPrompt}. The locals have been whispering about a hidden treasure that no one has been able to find for centuries. Adventure awaits those brave enough to seek it.`
        : "A weathered map has fallen into your possession, marking the location of a treasure hidden deep within uncharted territories. Legends say the treasure is guarded by ancient protectors and deadly traps.",
      options: [
        "Gather supplies and begin the expedition",
        "Seek out a guide familiar with the region",
        "Research more about the treasure's history",
        "Share the map with trusted allies"
      ]
    };
  }
};

const generateMockResponse = async (
  history: StorySegment[],
  selectedOption: string
): Promise<{ storyText: string; options: string[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mock responses based on keywords in the selected option
  if (selectedOption.includes('log') || selectedOption.includes('research')) {
    return {
      storyText: "You discover disturbing information that explains the current situation. What appeared to be an accident may have been deliberate sabotage. Among the data, you find a message that was meant to be hidden: 'They know what we found. Trust no one.'",
      options: [
        "Look for evidence of sabotage",
        "Try to identify who 'they' might be",
        "Search for survivors who might know more",
        "Secure your position in case of immediate danger"
      ]
    };
  } else if (selectedOption.includes('override') || selectedOption.includes('break')) {
    return {
      storyText: "Your attempts are met with unexpected resistance. Systems that should respond to your commands remain locked. As you struggle with the controls, you notice a reflection in the screen—something is moving behind you.",
      options: [
        "Turn around immediately",
        "Pretend not to notice while readying a weapon",
        "Try to catch a better glimpse in the reflection",
        "Call out, asking who's there"
      ]
    };
  } else if (selectedOption.includes('signal') || selectedOption.includes('call')) {
    return {
      storyText: "Your call receives a response, but not what you expected. Through static and interference, a voice warns: 'Do not reveal your position. They are hunting. Go silent and wait for coordinates.' The transmission cuts off abruptly.",
      options: [
        "Follow the advice and power down non-essential systems",
        "Try to re-establish contact",
        "Prepare defenses in case of hostile approach",
        "Ignore the warning and continue broadcasting"
      ]
    };
  } else if (selectedOption.includes('prepare') || selectedOption.includes('gather')) {
    return {
      storyText: "As you gather what you need, you make a startling discovery hidden among the supplies: a journal that doesn't belong to any known crew member. The latest entry simply reads: 'If you're reading this, then I failed. The artifact must never reach Earth.'",
      options: [
        "Search for information about this mysterious artifact",
        "Look for the journal's owner among the crew",
        "Continue preparations but with greater caution",
        "Try to determine if the artifact is currently on board"
      ]
    };
  } else if (selectedOption.includes('explore') || selectedOption.includes('search')) {
    return {
      storyText: "Deeper into the darkness, you find signs of recent activity. Someone—or something—has been here not long ago. A trail of unusual markings leads to a sealed door you hadn't noticed before. It's warm to the touch, as if concealing something active behind it.",
      options: [
        "Try to open the sealed door",
        "Follow the markings in the other direction",
        "Examine the markings more closely",
        "Set up surveillance to see who returns"
      ]
    };
  } else {
    return {
      storyText: "Your decision leads you down an unexpected path. As the situation evolves, you sense that the full truth remains hidden, waiting to be uncovered through careful choices and observation.",
      options: [
        "Take time to reassess your understanding of the situation",
        "Look for details you might have missed",
        "Proceed with renewed caution",
        "Change your approach entirely"
      ]
    };
  }
};
