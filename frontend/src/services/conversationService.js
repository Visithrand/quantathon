import AI_CONFIG from './aiService';

class ConversationService {
  constructor() {
    this.conversationHistory = new Map();
    this.apiKey = null;
  }

  // Set API key (will be provided by user)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Get conversation context for a specific scenario
  getScenarioContext(scenarioId) {
    const scenario = AI_CONFIG.scenarios[scenarioId];
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioId}`);
    }
    return scenario;
  }

  // Build conversation messages for AI
  buildConversationMessages(scenarioId, conversationHistory, userMessage) {
    const scenario = this.getScenarioContext(scenarioId);
    
    const messages = [
      {
        role: 'system',
        content: `${scenario.role} Context: ${scenario.context}. Difficulty level: ${scenario.difficulty}. Keep responses natural, engaging, and appropriate for the scenario. Ask follow-up questions to keep the conversation flowing.`
      }
    ];

    // Add conversation history (last 10 messages to maintain context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current user message
    if (userMessage) {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    return messages;
  }

  // Send message to AI and get response
  async sendMessage(scenarioId, conversationHistory, userMessage) {
    try {
      if (!this.apiKey) {
        throw new Error('API key not set. Please provide your OpenAI API key.');
      }

      const messages = this.buildConversationMessages(scenarioId, conversationHistory, userMessage);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: messages,
          max_tokens: AI_CONFIG.openai.maxTokens,
          temperature: AI_CONFIG.openai.temperature,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim();
      
      if (!aiResponse) {
        throw new Error('No response received from AI');
      }

      return {
        success: true,
        response: aiResponse,
        usage: data.usage
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error.message,
        fallbackResponse: this.getFallbackResponse(scenarioId, userMessage)
      };
    }
  }

  // Get fallback response when AI fails
  getFallbackResponse(scenarioId, userMessage) {
    const fallbacks = {
      'meeting-new-people': [
        "That's really interesting! I'd love to hear more about that. What brings you to this neighborhood?",
        "That sounds wonderful! I'm always looking to meet new friends. Do you enjoy exploring the area?",
        "That's great to hear! I'm still getting to know people here. What's your favorite thing about this neighborhood?"
      ],
      'job-interview': [
        "That's an impressive background! Can you tell me more about your experience in that area?",
        "Excellent! What would you say is your greatest strength?",
        "That's very relevant experience! Where do you see yourself professionally in the next few years?"
      ],
      'social-gathering': [
        "That's really interesting! Tell me more about that.",
        "I love hearing about people's experiences. What else interests you?",
        "That sounds wonderful! How did you get into that?"
      ]
    };

    const scenarioFallbacks = fallbacks[scenarioId] || [
      "That's really interesting! Tell me more about that.",
      "I appreciate you sharing that with me. What are your thoughts on...",
      "That's a great point! How do you feel about..."
    ];

    return scenarioFallbacks[Math.floor(Math.random() * scenarioFallbacks.length)];
  }

  // Analyze conversation for speech therapy insights
  analyzeConversation(conversationHistory) {
    const analysis = {
      totalMessages: conversationHistory.length,
      userMessages: conversationHistory.filter(msg => msg.type === 'user').length,
      aiMessages: conversationHistory.filter(msg => msg.type === 'ai').length,
      averageResponseTime: 0,
      conversationFlow: 'good',
      suggestions: []
    };

    // Calculate average response time
    const responseTimes = [];
    for (let i = 1; i < conversationHistory.length; i += 2) {
      if (conversationHistory[i] && conversationHistory[i-1]) {
        const userTime = new Date(conversationHistory[i-1].timestamp);
        const aiTime = new Date(conversationHistory[i].timestamp);
        const responseTime = (aiTime - userTime) / 1000; // seconds
        responseTimes.push(responseTime);
      }
    }

    if (responseTimes.length > 0) {
      analysis.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    // Analyze conversation flow
    if (analysis.userMessages < 3) {
      analysis.conversationFlow = 'needs_encouragement';
      analysis.suggestions.push('Try to share more about yourself to keep the conversation going');
    } else if (analysis.userMessages > 10) {
      analysis.conversationFlow = 'excellent';
      analysis.suggestions.push('Great job maintaining an engaging conversation!');
    }

    return analysis;
  }
}

export default new ConversationService();
