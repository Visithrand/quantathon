import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import conversationService from '../services/conversationService';
import { 
  ArrowLeft,
  MessageCircle,
  Users,
  Building,
  Coffee,
  ShoppingCart,
  GraduationCap,
  Heart,
  Settings,
  Send,
  Mic,
  Volume2
} from 'lucide-react';

const DailyScenario = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [conversationAnalysis, setConversationAnalysis] = useState(null);

  // Load saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // Set default API key if none is saved
      const defaultApiKey = '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';
      setApiKey(defaultApiKey);
      localStorage.setItem('openai_api_key', defaultApiKey);
    }
  }, []);

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Start chat session
  const startChat = () => {
    if (!apiKey.trim()) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsChatActive(true);
    // Set API key for conversation service
    conversationService.setApiKey(apiKey);
    
    // Initialize with AI greeting based on scenario
    const aiGreeting = getScenarioGreeting(selectedScenario.id);
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: aiGreeting,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Check if API key is configured
  const isApiKeyConfigured = () => {
    return apiKey && apiKey.trim() && apiKey.startsWith('sk-');
  };

  // Get AI greeting based on scenario
  const getScenarioGreeting = (scenarioId) => {
    const greetings = {
      'meeting-new-people': "Hi there! I'm Alex. I just moved to this neighborhood and I'm trying to meet new people. How are you doing today?",
      'job-interview': "Hello! I'm Sarah from TechCorp. Thank you for coming in today. I'd like to start by asking you to tell me a bit about yourself and your background.",
      'social-gathering': "Hey! I'm Mike. This is quite a party, isn't it? I don't think we've met before. What brings you here tonight?",
      'customer-service': "Good morning! Welcome to our store. I'm Lisa, and I'm here to help you find exactly what you're looking for. How can I assist you today?",
      'academic-presentation': "Good afternoon everyone. I'm Professor Johnson, and today we'll be discussing the research findings from our latest study. I'm excited to share our discoveries with you.",
      'dating-conversation': "Hi! I'm Emma. I've been looking forward to meeting you. You seem really interesting from your profile. How has your day been so far?"
    };
    return greetings[scenarioId] || "Hello! I'm here to help you practice your conversation skills. How are you doing today?";
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get real AI response
    try {
      const aiResult = await conversationService.sendMessage(
        selectedScenario.id,
        messages,
        inputMessage
      );
      
      let aiResponse;
      if (aiResult.success) {
        aiResponse = aiResult.response;
        console.log('AI Response:', aiResponse);
        console.log('API Usage:', aiResult.usage);
      } else {
        aiResponse = aiResult.fallbackResponse;
        console.warn('AI Error, using fallback:', aiResult.error);
      }
      
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Speak the AI response
      speakAIResponse(aiResponse);
      
      // Analyze conversation after AI response
      const analysis = conversationService.analyzeConversation([...messages, aiMessage]);
      setConversationAnalysis(analysis);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Use fallback response
      const fallbackResponse = conversationService.getFallbackResponse(selectedScenario.id, inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      speakAIResponse(fallbackResponse);
    }
  };

  // Generate AI response (placeholder - will be replaced with real AI)
  const generateAIResponse = (userMessage, scenarioId) => {
    const responses = {
      'meeting-new-people': [
        "That's really interesting! I love meeting people with diverse backgrounds. What do you enjoy doing in your free time?",
        "That sounds wonderful! I'm always looking for new friends in the area. Do you know any good restaurants around here?",
        "That's great to hear! I'm still getting to know the neighborhood. What's your favorite thing about living here?"
      ],
      'job-interview': [
        "That's an impressive background! Can you tell me about a challenging project you worked on and how you handled it?",
        "Excellent experience! What would you say is your greatest strength, and how do you think it would benefit our team?",
        "That's very relevant experience! Where do you see yourself professionally in the next 5 years?"
      ]
    };
    
    const scenarioResponses = responses[scenarioId] || [
      "That's really interesting! Tell me more about that.",
      "I appreciate you sharing that with me. What are your thoughts on...",
      "That's a great point! How do you feel about..."
    ];
    
    return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
  };

  // Voice input functionality
  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  // Text-to-speech for AI responses
  const speakAIResponse = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Available conversation scenarios
  const scenarios = [
    {
      id: 'meeting-new-people',
      title: 'Meeting New People',
      description: 'Practice introducing yourself and making small talk',
      icon: <Users className="w-8 h-8" />,
      difficulty: 'Beginner',
      duration: '10-15 min'
    },
    {
      id: 'job-interview',
      title: 'Job Interview',
      description: 'Practice answering common interview questions confidently',
      icon: <Building className="w-8 h-8" />,
      difficulty: 'Intermediate',
      duration: '15-20 min'
    },
    {
      id: 'social-gathering',
      title: 'Social Gathering',
      description: 'Practice casual conversations at parties or events',
      icon: <Coffee className="w-8 h-8" />,
      difficulty: 'Beginner',
      duration: '10-15 min'
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      description: 'Practice handling customer inquiries professionally',
      icon: <ShoppingCart className="w-8 h-8" />,
      difficulty: 'Intermediate',
      duration: '15-20 min'
    },
    {
      id: 'academic-presentation',
      title: 'Academic Presentation',
      description: 'Practice presenting research or projects to classmates',
      icon: <GraduationCap className="w-8 h-8" />,
      difficulty: 'Advanced',
      duration: '20-25 min'
    },
    {
      id: 'dating-conversation',
      title: 'Dating Conversation',
      description: 'Practice romantic conversations and getting to know someone',
      icon: <Heart className="w-8 h-8" />,
      difficulty: 'Intermediate',
      duration: '15-20 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Daily Scenarios
              </h1>
              <p className="text-slate-600">Practice real-world conversations with AI</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span className="text-slate-600">AI Chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedScenario ? (
          /* Scenario Selection */
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                Choose Your Scenario
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Select a real-life situation to practice your conversation skills. 
                Our AI will simulate realistic conversations to help you build confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-slate-200/50"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                      <div className="text-white">
                        {scenario.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{scenario.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${
                          scenario.difficulty === 'Beginner' ? 'bg-green-500' :
                          scenario.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span>{scenario.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>{scenario.duration}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
                 ) : (
           /* Chat Interface */
           <div className="max-w-4xl mx-auto">
             {!isChatActive ? (
               /* Scenario Introduction */
               <div className="text-center mb-8">
                 <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50">
                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                     <div className="text-white">
                       {selectedScenario.icon}
                     </div>
                   </div>
                   
                   <h3 className="text-3xl font-bold text-slate-800 mb-4">
                     {selectedScenario.title}
                   </h3>
                   <p className="text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
                     {selectedScenario.description}
                   </p>
                   
                   <div className="flex items-center justify-center space-x-4 mb-8">
                     <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium">
                       {selectedScenario.difficulty}
                     </span>
                     <span className="px-4 py-2 bg-slate-100 rounded-full text-slate-700 font-medium">
                       {selectedScenario.duration}
                     </span>
                   </div>
                   
                                       <button
                      onClick={startChat}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      {isApiKeyConfigured() ? 'Start AI Conversation' : 'Setup API Key'}
                    </button>
                    
                    {isApiKeyConfigured() && (
                      <div className="mt-3 text-sm text-green-600 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>AI API Key Configured ✓</span>
                      </div>
                    )}
                   
                   <button
                     onClick={() => setSelectedScenario(null)}
                     className="block mx-auto mt-4 text-slate-600 hover:text-slate-800 transition-colors"
                   >
                     ← Back to Scenarios
                   </button>
                 </div>
               </div>
             ) : (
               /* Active Chat */
               <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                 {/* Chat Header */}
                 <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                         {selectedScenario.icon}
                       </div>
                       <div>
                         <h4 className="font-semibold">{selectedScenario.title}</h4>
                         <p className="text-blue-100 text-sm">AI Conversation Partner</p>
                       </div>
                     </div>
                     <button
                       onClick={() => {
                         setIsChatActive(false);
                         setMessages([]);
                       }}
                       className="text-white/80 hover:text-white transition-colors"
                     >
                       ← Back
                     </button>
                   </div>
                 </div>
                 
                 {/* Chat Messages */}
                 <div className="h-96 overflow-y-auto p-4 space-y-4">
                   {messages.map((message) => (
                     <div
                       key={message.id}
                       className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                       <div
                         className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                           message.type === 'user'
                             ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                             : 'bg-slate-100 text-slate-800'
                         }`}
                       >
                         <p className="text-sm">{message.content}</p>
                         <p className={`text-xs mt-2 ${
                           message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                         }`}>
                           {message.timestamp}
                         </p>
                       </div>
                     </div>
                   ))}
                   
                   {isTyping && (
                     <div className="flex justify-start">
                       <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl">
                         <div className="flex space-x-1">
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 {/* Chat Input */}
                 <div className="border-t border-slate-200 p-4">
                   <div className="flex space-x-3">
                     <button
                       onClick={startVoiceInput}
                       disabled={isListening}
                       className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
                         isListening
                           ? 'bg-red-500 text-white animate-pulse'
                           : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                       }`}
                       title="Voice Input"
                     >
                       <Mic className="w-5 h-5" />
                     </button>
                     
                     <input
                       type="text"
                       value={inputMessage}
                       onChange={(e) => setInputMessage(e.target.value)}
                       onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                       placeholder="Type your message or use voice input..."
                       className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     
                     <button
                       onClick={sendMessage}
                       disabled={!inputMessage.trim()}
                       className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Send className="w-5 h-5" />
                     </button>
                   </div>
                   
                   {/* Voice Status */}
                   <div className="flex items-center justify-center space-x-4 mt-3 text-sm text-slate-500">
                     {isListening && (
                       <div className="flex items-center space-x-2 text-red-500">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span>Listening...</span>
                       </div>
                     )}
                     {isSpeaking && (
                       <div className="flex items-center space-x-2 text-blue-500">
                         <Volume2 className="w-4 h-4" />
                         <span>AI Speaking...</span>
                       </div>
                     )}
                                      </div>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>

       {/* API Key Modal */}
       {showApiKeyModal && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
             <h3 className="text-2xl font-bold text-slate-800 mb-4">Setup AI Chat</h3>
             <p className="text-slate-600 mb-6">
               To use the AI conversation feature, you need to provide your OpenAI API key. 
               This allows for intelligent, contextual responses in your practice conversations.
             </p>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">
                   OpenAI API Key
                 </label>
                 <input
                   type="password"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   placeholder="sk-..."
                   className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
               
               <div className="flex space-x-3">
                 <button
                   onClick={() => setShowApiKeyModal(false)}
                   className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={() => {
                     if (apiKey.trim()) {
                       // Save API key to localStorage
                       localStorage.setItem('openai_api_key', apiKey);
                       setShowApiKeyModal(false);
                       startChat();
                     }
                   }}
                   disabled={!apiKey.trim()}
                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Start Chat
                 </button>
               </div>
             </div>
             
             <div className="mt-4 text-xs text-slate-500">
               <p>Your API key is stored locally and never sent to our servers.</p>
               <p className="mt-1">
                 <a 
                   href="https://platform.openai.com/api-keys" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-blue-500 hover:underline"
                 >
                   Get your API key here
                 </a>
               </p>
             </div>
           </div>
         </div>
       )}

       {/* Conversation Analysis */}
       {conversationAnalysis && (
         <div className="fixed bottom-4 right-4 bg-white rounded-2xl p-6 shadow-2xl border border-slate-200/50 max-w-sm">
           <h4 className="font-semibold text-slate-800 mb-3">Conversation Insights</h4>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-slate-600">Messages:</span>
               <span className="font-medium">{conversationAnalysis.totalMessages}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-600">Your Responses:</span>
               <span className="font-medium">{conversationAnalysis.userMessages}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-slate-600">Flow:</span>
               <span className={`font-medium ${
                 conversationAnalysis.conversationFlow === 'excellent' ? 'text-green-600' :
                 conversationAnalysis.conversationFlow === 'needs_encouragement' ? 'text-yellow-600' : 'text-blue-600'
               }`}>
                 {conversationAnalysis.conversationFlow.replace('_', ' ')}
               </span>
             </div>
           </div>
           
           {conversationAnalysis.suggestions.length > 0 && (
             <div className="mt-3 pt-3 border-t border-slate-200">
               <p className="text-xs text-slate-600 font-medium mb-2">Suggestions:</p>
               <ul className="text-xs text-slate-600 space-y-1">
                 {conversationAnalysis.suggestions.map((suggestion, index) => (
                   <li key={index} className="flex items-start space-x-2">
                     <span className="text-blue-500 mt-1">•</span>
                     <span>{suggestion}</span>
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       )}
     </div>
   );
 };

export default DailyScenario;
