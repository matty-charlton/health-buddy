"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Heart, Target, Calendar, Zap, Settings, Key } from 'lucide-react';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    fitnessLevel: '',
    goals: [],
    barriers: [],
    schedule: '',
    motivation: '',
    persona: null,
    preferences: {}
  });
  const [isTyping, setIsTyping] = useState(false);
  const [conversationPhase, setConversationPhase] = useState('initial'); // initial, onboarding, personalized
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('health-buddy-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsConnected(true);
    }
  }, []);

  const saveApiKey = (key) => {
    localStorage.setItem('health-buddy-api-key', key);
    setApiKey(key);
    setIsConnected(true);
    setShowSettings(false);
  };

  const addMessage = (content, isUser = false, type = 'text', data = null) => {
    const message = {
      id: Date.now(),
      content,
      isUser,
      type,
      data,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = (callback, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  // Enhanced Claude API call with proper error handling
  const callClaudeAPI = async (userMessage, context = {}) => {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const systemPrompt = `You are Health Buddy, an AI fitness motivation assistant. You help people build sustainable exercise habits through personalized support and behavioral psychology.

Current user context: ${JSON.stringify(context, null, 2)}

Your personality:
- Warm, encouraging, and supportive
- Use behavioral psychology principles
- Focus on building sustainable habits
- Celebrate small wins
- Address psychological barriers to exercise
- Provide practical, actionable advice

Based on the conversation phase:
- If initial: Welcome warmly and start gathering basic information
- If onboarding: Ask thoughtful questions to understand their fitness background, goals, and challenges
- If personalized: Provide tailored advice based on their specific persona and needs

Keep responses conversational, empathetic, and focused on motivation. Ask follow-up questions to better understand their situation.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ],
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      throw error;
    }
  };

  const determinePersona = (data) => {
    const hasTimeBarriers = data.barriers.some(b => b.toLowerCase().includes('time'));
    const hasMotivationIssues = data.barriers.some(b => b.toLowerCase().includes('motivation'));
    const hasOverwhelm = data.barriers.some(b => b.toLowerCase().includes('overwhelm'));
    const isHealthFocused = data.goals.some(g => g.toLowerCase().includes('health'));
    
    if (hasTimeBarriers && data.goals.some(g => g.toLowerCase().includes('family'))) {
      return 'Corporate Millennial';
    } else if (isHealthFocused && !hasOverwhelm) {
      return 'Health-Conscious Gen X';
    } else if (hasOverwhelm || data.fitnessLevel.toLowerCase().includes('beginner')) {
      return 'Reluctant Exerciser';
    } else {
      return 'Health Enthusiast';
    }
  };

  const getPersonaInsights = (persona) => {
    const insights = {
      'Corporate Millennial': {
        color: 'bg-blue-500',
        icon: <Target className="w-5 h-5" />,
        challenges: ['Time-crunched schedule', 'Work-life balance', 'Family responsibilities'],
        approach: 'Micro-workouts and stress-busting movement',
        features: ['15-minute morning energizers', 'Desk-break reminders', 'Family-friendly activities']
      },
      'Health-Conscious Gen X': {
        color: 'bg-green-500',
        icon: <Heart className="w-5 h-5" />,
        challenges: ['Preventive health focus', 'Professional guidance needed', 'Consistency with travel'],
        approach: 'Evidence-based programming with health metrics',
        features: ['Health provider integration', 'Progress tracking', 'Travel-friendly routines']
      },
      'Reluctant Exerciser': {
        color: 'bg-purple-500',
        icon: <Zap className="w-5 h-5" />,
        challenges: ['Low confidence', 'Overwhelm', 'Need for gentle support'],
        approach: 'Confidence-building with celebration of small wins',
        features: ['5-minute daily wins', 'Gentle encouragement', 'Privacy-focused workouts']
      },
      'Health Enthusiast': {
        color: 'bg-orange-500',
        icon: <Calendar className="w-5 h-5" />,
        challenges: ['Optimization focus', 'Advanced features', 'Data integration'],
        approach: 'Performance optimization and advanced analytics',
        features: ['Detailed analytics', 'Wearable integration', 'Advanced programming']
      }
    };
    return insights[persona] || insights['Health Enthusiast'];
  };

  const processUserInput = async (input) => {
    if (!isConnected) {
      addMessage("Please configure your Claude API key in settings first.", false, 'error');
      setShowSettings(true);
      return;
    }

    addMessage(input, true);
    setIsTyping(true);

    try {
      const context = {
        userData,
        conversationPhase,
        previousMessages: messages.slice(-5) // Last 5 messages for context
      };

      const aiResponse = await callClaudeAPI(input, context);
      
      // Check if we should update user data based on the conversation
      if (conversationPhase === 'onboarding') {
        updateUserDataFromResponse(input, aiResponse);
      }

      setIsTyping(false);
      addMessage(aiResponse, false, 'ai_response');

      // Progress conversation phase if appropriate
      if (conversationPhase === 'initial' && messages.length > 2) {
        setConversationPhase('onboarding');
      } else if (conversationPhase === 'onboarding' && shouldMoveToPersonalized()) {
        setConversationPhase('personalized');
        showPersonaSetup();
      }

    } catch (error) {
      setIsTyping(false);
      addMessage(`Sorry, I encountered an error: ${error.message}. Please check your API key and try again.`, false, 'error');
    }
  };

  const updateUserDataFromResponse = (userInput, aiResponse) => {
    const input = userInput.toLowerCase();
    
    // Extract name
    if (!userData.name && (input.includes('my name is') || input.includes("i'm ") || input.includes("i am "))) {
      const nameMatch = input.match(/(?:my name is|i'm|i am)\s+([a-zA-Z]+)/);
      if (nameMatch) {
        setUserData(prev => ({ ...prev, name: nameMatch[1] }));
      }
    }

    // Extract fitness level
    if (input.includes('beginner') || input.includes('new to') || input.includes('never')) {
      setUserData(prev => ({ ...prev, fitnessLevel: 'beginner' }));
    } else if (input.includes('intermediate') || input.includes('sometimes') || input.includes('on and off')) {
      setUserData(prev => ({ ...prev, fitnessLevel: 'intermediate' }));
    } else if (input.includes('advanced') || input.includes('regularly') || input.includes('experienced')) {
      setUserData(prev => ({ ...prev, fitnessLevel: 'advanced' }));
    }

    // Extract goals
    const goalKeywords = ['lose weight', 'build muscle', 'get stronger', 'improve health', 'reduce stress', 'increase energy'];
    goalKeywords.forEach(goal => {
      if (input.includes(goal) && !userData.goals.includes(goal)) {
        setUserData(prev => ({ ...prev, goals: [...prev.goals, goal] }));
      }
    });

    // Extract barriers
    const barrierKeywords = ['no time', 'busy', 'tired', 'motivation', 'overwhelmed', 'injured'];
    barrierKeywords.forEach(barrier => {
      if (input.includes(barrier) && !userData.barriers.includes(barrier)) {
        setUserData(prev => ({ ...prev, barriers: [...prev.barriers, barrier] }));
      }
    });
  };

  const shouldMoveToPersonalized = () => {
    return userData.name && (userData.fitnessLevel || userData.goals.length > 0) && messages.length > 8;
  };

  const showPersonaSetup = () => {
    const persona = determinePersona(userData);
    const insights = getPersonaInsights(persona);
    
    setUserData(prev => ({ ...prev, persona }));
    
    setTimeout(() => {
      addMessage("Based on our conversation, I've identified your fitness personality and created a personalized plan for you!", false, 'persona_setup', {
        persona,
        insights,
        userData
      });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    processUserInput(currentInput);
    setCurrentInput('');
  };

  const initializeConversation = async () => {
    if (!isConnected) {
      addMessage("Welcome to Health Buddy! Please configure your Claude API key in settings to get started.", false, 'welcome');
      return;
    }

    try {
      const initialResponse = await callClaudeAPI("Hello, I'm new here and looking for help with fitness motivation.", {
        conversationPhase: 'initial'
      });
      addMessage(initialResponse, false, 'welcome');
    } catch (error) {
      addMessage("Welcome to Health Buddy! I'm here to help you build sustainable fitness habits. What's your name?", false, 'welcome');
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      simulateTyping(initializeConversation, 500);
    }
  }, [isConnected]);

  const renderMessage = (message) => {
    if (message.type === 'persona_setup' && !message.isUser) {
      const { persona, insights } = message.data;
      return (
        <div className="space-y-4">
          <p className="text-gray-800">{message.content}</p>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${insights.color}`}>
              {insights.icon}
              {persona}
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">Your Key Challenges:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {insights.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">My Approach for You:</h4>
                <p className="text-sm text-gray-600">{insights.approach}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Key Features Activated:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                  {insights.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button 
              onClick={() => {
                processUserInput("I'm ready to start my personalized fitness journey! What's my first step?");
              }}
              className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
            >
              Start My Health Journey
            </button>
          </div>
        </div>
      );
    }

    if (message.type === 'error') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800">{message.content}</p>
        </div>
      );
    }

    return <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>;
  };

  const SettingsPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Claude API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Claude API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key from console.anthropic.com
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => saveApiKey(apiKey)}
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Health Buddy</h1>
              <p className="text-sm text-gray-600">
                Your AI-powered fitness companion
                {isConnected && <span className="text-green-600 ml-2">● Connected</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-md p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : message.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {renderMessage(message)}
            </div>
            {message.isUser && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Configure API key first..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping || !isConnected}
          />
          <button
            type="submit"
            disabled={!currentInput.trim() || isTyping || !isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsPanel />}
    </div>
  );
};

export default Home;