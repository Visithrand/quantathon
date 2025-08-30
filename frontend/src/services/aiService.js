// AI Service Configuration
const AI_CONFIG = {
  // OpenAI Configuration
  openai: {
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4', // Using GPT-4 for better conversation quality
    maxTokens: 500,
    temperature: 0.8,
    presencePenalty: 0.1,
    frequencyPenalty: 0.1,
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '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'
  },
  
  // Conversation Context Templates
  scenarios: {
    'meeting-new-people': {
      role: "You are Alex, a friendly new neighbor who just moved to the area...",
      context: "Meeting new people at a neighborhood gathering",
      difficulty: "beginner"
    },
    'job-interview': {
      role: "You are Sarah, a senior HR manager at TechCorp...",
      context: "Professional job interview setting",
      difficulty: "intermediate"
    },
    'social-gathering': {
      role: "You are Mike, a sociable person at a party...",
      context: "Casual party conversation",
      difficulty: "beginner"
    },
    'customer-service': {
      role: "You are Lisa, a helpful customer service representative...",
      context: "Retail store customer service",
      difficulty: "intermediate"
    },
    'academic-presentation': {
      role: "You are Professor Johnson, an academic presenting research findings...",
      context: "Academic presentation and discussion",
      difficulty: "advanced"
    },
    'dating-conversation': {
      role: "You are Emma, someone on a first date...",
      context: "First date conversation",
      difficulty: "intermediate"
    }
  }
};

export default AI_CONFIG;
