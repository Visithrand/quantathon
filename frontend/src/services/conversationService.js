import AI_CONFIG from './aiService';

class ConversationService {
  constructor() {
    this.conversationHistory = new Map();
    this.apiKey = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Set API key (will be provided by user)
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.retryCount = 0; // Reset retry count when new API key is set
  }

  // Get configured API key from config
  getConfiguredApiKey() {
    return AI_CONFIG.openai.apiKey;
  }

  // Test API key validity with a simple request
  async testApiKey(apiKeyToTest = null) {
    const keyToUse = apiKeyToTest || this.apiKey || AI_CONFIG.openai.apiKey;
    
    if (!keyToUse) {
      return { success: false, error: 'No API key available' };
    }

    try {
      console.log('🧪 Testing API key:', keyToUse.substring(0, 20) + '...');
      
      // First test basic connectivity
      console.log('🌐 Testing basic network connectivity...');
      try {
        const connectivityTest = await fetch('https://httpbin.org/get', {
          method: 'GET',
          mode: 'cors'
        });
        console.log('✅ Basic network connectivity: OK');
      } catch (connectivityError) {
        console.error('❌ Basic network connectivity failed:', connectivityError);
        return { success: false, error: `Network connectivity issue: ${connectivityError.message}` };
      }
      
      // Now test OpenAI API with multiple approaches
      console.log('🔑 Testing OpenAI API connectivity...');
      
      // Try multiple approaches for the certificate issue
      const apiEndpoints = [
        'https://api.openai.com/v1/models',
        'https://api.openai.com/v1/chat/completions'
      ];
      
      let lastError = null;
      
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${keyToUse}`,
              'Content-Type': 'application/json'
            },
            // Add additional options to handle certificate issues
            mode: 'cors',
            cache: 'no-cache'
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ API key test successful, available models:', data.data?.length || 0);
            return { success: true, models: data.data?.length || 0, endpoint };
          } else {
            const errorData = await response.json();
            console.error(`❌ API test failed for ${endpoint}:`, errorData);
            
            if (response.status === 401) {
              return { 
                success: false, 
                error: `API Key Authentication Failed (401):\n\n• Your API key is invalid or expired\n• Check if you have sufficient credits\n• Verify the key format (should start with sk-)\n• Go to https://platform.openai.com/api-keys to verify` 
              };
            }
            
            lastError = errorData.error?.message || `HTTP ${response.status}`;
          }
        } catch (endpointError) {
          console.error(`❌ Endpoint ${endpoint} failed:`, endpointError);
          lastError = endpointError.message;
        }
      }
      
      // If all endpoints failed, provide detailed certificate error help
      return { 
        success: false, 
        error: `SSL Certificate Error (${lastError}):\n\n🔧 IMMEDIATE FIXES:\n• Check system clock - incorrect time causes certificate failures\n• Disable VPN/Proxy - corporate networks intercept HTTPS\n• Try mobile hotspot or different WiFi\n• Clear browser cache and restart\n• Temporarily disable antivirus/firewall\n\n🌐 Network Test: Click "Test Network" button to verify basic connectivity.` 
      };

    } catch (error) {
      console.error('❌ API key test error:', error);
      
      // Provide specific error messages for common issues
      if (error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connectivity issue. This could be:\n• SSL certificate problem\n• Corporate firewall/proxy\n• VPN interference\n• Network restrictions\n\nTry: different network, disable VPN, or check system clock.' 
        };
      } else if (error.message.includes('ERR_CERT_AUTHORITY_INVALID')) {
        return { 
          success: false, 
          error: 'SSL Certificate validation failed. This could be:\n• Incorrect system date/time\n• Corporate proxy intercepting HTTPS\n• Network security software\n\nTry: check system clock, different network, or disable VPN.' 
        };
      }
      
      return { success: false, error: error.message };
    }
  }

  // Get conversation context for a specific scenario
  getScenarioContext(scenarioId) {
    const scenario = AI_CONFIG.scenarios[scenarioId];
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioId}`);
    }
    return scenario;
  }

  // Build conversation messages for AI with better context management
  buildConversationMessages(scenarioId, conversationHistory, userMessage) {
    const scenario = this.getScenarioContext(scenarioId);
    
    console.log('🔧 Building messages for scenario:', scenarioId);
    console.log('📝 Scenario context:', scenario);
    console.log('💬 Conversation history length:', conversationHistory.length);
    console.log('👤 User message:', userMessage);
    
    // Enhanced system message for better AI behavior
    const systemMessage = {
      role: 'system',
      content: `${scenario.role}

IMPORTANT INSTRUCTIONS:
- Always respond naturally and conversationally, like a real person
- Never repeat the same response twice
- Always reference what the user just said in your response
- Ask relevant follow-up questions to keep the conversation flowing
- Be engaging and show genuine interest
- Keep responses varied and contextual
- Avoid generic or repetitive phrases
- If the user shares something personal, acknowledge it and ask more about it
- Be empathetic and supportive when appropriate

Current scenario: ${scenario.context}
Difficulty level: ${scenario.difficulty}`
    };

    const messages = [systemMessage];

    // Add conversation history (last 15 messages for better context)
    const recentHistory = conversationHistory.slice(-15);
    recentHistory.forEach((msg, index) => {
      const role = msg.type === 'user' ? 'user' : 'assistant';
      messages.push({
        role: role,
        content: msg.content
      });
      console.log(`📨 Message ${index + 1}: ${role} - ${msg.content.substring(0, 50)}...`);
    });

    // Add current user message
    if (userMessage) {
      messages.push({
        role: 'user',
        content: userMessage
      });
      console.log(`📨 Current user message: ${userMessage}`);
    }

    console.log('📤 Final messages array:', messages);
    return messages;
  }

  // Send message to AI with improved error handling and retries
  async sendMessage(scenarioId, conversationHistory, userMessage) {
    try {
      console.log('🚀 Starting AI API call...');
      
      // Use API key from config if none is set manually
      const apiKeyToUse = this.apiKey || AI_CONFIG.openai.apiKey;
      
      console.log('🔑 API Key Debug Info:');
      console.log('  - Manual API Key:', this.apiKey ? `${this.apiKey.substring(0, 20)}...` : 'None');
      console.log('  - Config API Key:', AI_CONFIG.openai.apiKey ? `${AI_CONFIG.openai.apiKey.substring(0, 20)}...` : 'None');
      console.log('  - Final API Key:', apiKeyToUse ? `${apiKeyToUse.substring(0, 20)}...` : 'None');
      console.log('🔑 API Key status:', apiKeyToUse ? '✅ Available' : '❌ Missing');
      console.log('🎭 Scenario ID:', scenarioId);
      
      if (!apiKeyToUse) {
        throw new Error('No API key available. Please provide your OpenAI API key.');
      }

      const messages = this.buildConversationMessages(scenarioId, conversationHistory, userMessage);
      
      console.log('📡 Sending request to OpenAI...');
      console.log('📊 Request payload:', {
        model: AI_CONFIG.openai.model,
        max_tokens: AI_CONFIG.openai.maxTokens,
        temperature: AI_CONFIG.openai.temperature,
        presence_penalty: AI_CONFIG.openai.presencePenalty,
        frequency_penalty: AI_CONFIG.openai.frequencyPenalty,
        messageCount: messages.length
      });
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyToUse}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: messages,
          max_tokens: AI_CONFIG.openai.maxTokens,
          temperature: AI_CONFIG.openai.temperature,
          presence_penalty: AI_CONFIG.openai.presencePenalty,
          frequency_penalty: AI_CONFIG.openai.frequencyPenalty,
          stream: false
        })
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        
        // Handle specific API errors
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        } else if (response.status === 400) {
          throw new Error(`API Error: ${errorData.error?.message || 'Invalid request'}`);
        } else {
          throw new Error(`AI API Error: ${errorData.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('✅ API Response received:', data);
      
      const aiResponse = data.choices[0]?.message?.content?.trim();
      
      if (!aiResponse) {
        throw new Error('No response received from AI');
      }

      console.log('🎯 AI Response extracted:', aiResponse);
      
      // Reset retry count on successful response
      this.retryCount = 0;

      return {
        success: true,
        response: aiResponse,
        usage: data.usage
      };

    } catch (error) {
      console.error('❌ AI Service Error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        scenarioId,
        userMessage,
        retryCount: this.retryCount
      });
      
      // Try to retry on certain errors
      if (this.retryCount < this.maxRetries && 
          (error.message.includes('rate limit') || error.message.includes('timeout'))) {
        this.retryCount++;
        console.log(`🔄 Retrying... Attempt ${this.retryCount}/${this.maxRetries}`);
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, this.retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.sendMessage(scenarioId, conversationHistory, userMessage);
      }
      
      // If all retries failed or it's a non-retryable error, use fallback
      return {
        success: false,
        error: error.message,
        fallbackResponse: this.getSmartFallbackResponse(scenarioId, userMessage, conversationHistory)
      };
    }
  }

  // Get smarter fallback response that's more contextual
  getSmartFallbackResponse(scenarioId, userMessage, conversationHistory) {
    // Try to make the fallback more contextual based on the user's message
    const userMessageLower = userMessage.toLowerCase();
    
    // Check for specific topics in the user's message
    if (userMessageLower.includes('work') || userMessageLower.includes('job')) {
      return "That sounds like interesting work! What do you enjoy most about your job? I'd love to hear more about your experience.";
    }
    
    if (userMessageLower.includes('family') || userMessageLower.includes('kids') || userMessageLower.includes('children')) {
      return "Family is so important! Tell me more about your family. What's something special about them that you'd like to share?";
    }
    
    if (userMessageLower.includes('hobby') || userMessageLower.includes('interest') || userMessageLower.includes('like to do')) {
      return "That's a fascinating hobby! How did you get into that? I'm curious to learn more about what makes it special to you.";
    }
    
    if (userMessageLower.includes('travel') || userMessageLower.includes('visit') || userMessageLower.includes('been to')) {
      return "Traveling is wonderful! What was your favorite part of that experience? I'd love to hear about what made it memorable.";
    }
    
    if (userMessageLower.includes('music') || userMessageLower.includes('song') || userMessageLower.includes('artist')) {
      return "Music is amazing! What is it about that music that speaks to you? I'm interested in hearing what draws you to it.";
    }
    
    // Generic but engaging fallback
    return "That's really interesting! I'd love to hear more about that. What's something specific about it that you find most meaningful?";
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
