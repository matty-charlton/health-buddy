"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Heart, Target, Calendar, Zap } from 'lucide-react';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    fitnessLevel: '',
    goals: [],
    barriers: [],
    schedule: '',
    motivation: '',
    persona: null
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Onboarding flow steps
  const onboardingSteps = [
    {
      id: 'welcome',
      message: "Hello! I'm your Health Buddy AI assistant. I'm here to help you build sustainable fitness habits that actually stick. What's your name?",
      type: 'text'
    },
    {
      id: 'fitness_level',
      message: "Nice to meet you, {name}! Let's start by understanding where you are right now. How would you describe your current fitness level?",
      type: 'choice',
      options: [
        'Complete beginner - haven\'t exercised in years',
        'Sporadic exerciser - on and off again',
        'Regular but struggling with consistency',
        'Fairly active but want to improve'
      ]
    },
    {
      id: 'goals',
      message: "What are your main health and fitness goals? (You can select multiple)",
      type: 'multiple_choice',
      options: [
        'Lose weight and feel more confident',
        'Build strength and muscle',
        'Improve cardiovascular health',
        'Reduce stress and improve mental health',
        'Increase energy levels',
        'Set a good example for my family'
      ]
    },
    {
      id: 'barriers',
      message: "What has prevented you from sticking to exercise routines in the past? Understanding this helps me provide better support.",
      type: 'multiple_choice',
      options: [
        'Lack of time due to work/family',
        'Losing motivation after a few weeks',
        'Feeling overwhelmed by complex routines',
        'Getting injured or too sore',
        'Lack of accountability or support',
        'Boring or repetitive workouts'
      ]
    },
    {
      id: 'schedule',
      message: "When do you typically have time for exercise? This helps me suggest the right moments for activity.",
      type: 'choice',
      options: [
        'Early morning (6-8am)',
        'Lunch break (12-2pm)',
        'Early evening (5-7pm)',
        'Late evening (7-9pm)',
        'Weekends mainly',
        'Very irregular - depends on the day'
      ]
    },
    {
      id: 'motivation_style',
      message: "How do you prefer to be motivated? This shapes how I'll communicate with you daily.",
      type: 'choice',
      options: [
        'Gentle encouragement and understanding',
        'Direct challenges and accountability',
        'Data-driven insights and progress tracking',
        'Social support and community'
      ]
    },
    {
      id: 'persona_reveal',
      message: "Based on your responses, I can see you're a {persona}. I've created a personalised plan that addresses your specific challenges. Ready to see your Health Buddy setup?",
      type: 'persona'
    }
  ];

  // Persona mapping based on responses
  const determinePersona = (data) => {
    const hasTimeBarriers = data.barriers.includes('Lack of time due to work/family');
    const isInconsistent = data.fitnessLevel.includes('Sporadic') || data.barriers.includes('Losing motivation');
    const isOverwhelmed = data.barriers.includes('Feeling overwhelmed');
    
    if (hasTimeBarriers && data.goals.includes('Set a good example for my family')) {
      return 'Corporate Millennial';
    } else if (data.goals.includes('Improve cardiovascular health') && !isOverwhelmed) {
      return 'Health-Conscious Gen X';
    } else if (isOverwhelmed || data.fitnessLevel.includes('Complete beginner')) {
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

  const processUserInput = (input, stepType = 'text') => {
    addMessage(input, true);
    
    if (stepType === 'choice' || stepType === 'multiple_choice') {
      // Handle choice selections
      const step = onboardingSteps[currentStep];
      if (step.id === 'fitness_level') {
        setUserData(prev => ({ ...prev, fitnessLevel: input }));
      } else if (step.id === 'schedule') {
        setUserData(prev => ({ ...prev, schedule: input }));
      } else if (step.id === 'motivation_style') {
        setUserData(prev => ({ ...prev, motivation: input }));
      }
    } else if (onboardingSteps[currentStep]?.id === 'welcome') {
      setUserData(prev => ({ ...prev, name: input }));
    }

    // Add selections to user data for multiple choice
    if (stepType === 'multiple_choice') {
      const step = onboardingSteps[currentStep];
      if (step.id === 'goals') {
        setUserData(prev => ({ ...prev, goals: [...prev.goals, input] }));
        return; // Don't advance step for multiple choice
      } else if (step.id === 'barriers') {
        setUserData(prev => ({ ...prev, barriers: [...prev.barriers, input] }));
        return;
      }
    }

    // Advance to next step
    simulateTyping(() => {
      const nextStep = currentStep + 1;
      if (nextStep < onboardingSteps.length) {
        setCurrentStep(nextStep);
        const step = onboardingSteps[nextStep];
        let message = step.message;
        
        if (step.id === 'persona_reveal') {
          const persona = determinePersona(userData);
          setUserData(prev => ({ ...prev, persona }));
          message = message.replace('{persona}', persona);
        } else {
          message = message.replace('{name}', userData.name);
        }
        
        addMessage(message, false, step.type, step);
      } else {
        // Onboarding complete
        showPersonaSetup();
      }
    });
  };

  const showPersonaSetup = () => {
    const persona = userData.persona || determinePersona(userData);
    const insights = getPersonaInsights(persona);
    
    addMessage("Perfect! Here's your personalised Health Buddy setup:", false, 'persona_setup', {
      persona,
      insights,
      userData
    });
  };

  const handleMultipleChoiceFinish = (stepId) => {
    simulateTyping(() => {
      const nextStep = currentStep + 1;
      if (nextStep < onboardingSteps.length) {
        setCurrentStep(nextStep);
        const step = onboardingSteps[nextStep];
        let message = step.message.replace('{name}', userData.name);
        addMessage(message, false, step.type, step);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const step = onboardingSteps[currentStep];
    processUserInput(currentInput, step?.type);
    setCurrentInput('');
  };

  useEffect(() => {
    // Start onboarding
    if (messages.length === 0) {
      simulateTyping(() => {
        addMessage(onboardingSteps[0].message, false, onboardingSteps[0].type, onboardingSteps[0]);
      }, 500);
    }
  }, []);

  const renderMessage = (message) => {
    if (message.type === 'choice' && !message.isUser) {
      return (
        <div className="space-y-2">
          <p className="text-gray-800">{message.content}</p>
          <div className="grid gap-2 mt-3">
            {message.data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => processUserInput(option, 'choice')}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'multiple_choice' && !message.isUser) {
      return (
        <div className="space-y-2">
          <p className="text-gray-800">{message.content}</p>
          <div className="grid gap-2 mt-3">
            {message.data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  const step = onboardingSteps[currentStep];
                  if (step.id === 'goals') {
                    setUserData(prev => ({ ...prev, goals: [...prev.goals, option] }));
                    addMessage(option, true);
                  } else if (step.id === 'barriers') {
                    setUserData(prev => ({ ...prev, barriers: [...prev.barriers, option] }));
                    addMessage(option, true);
                  }
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                disabled={message.data.id === 'goals' ? userData.goals.includes(option) : userData.barriers.includes(option)}
              >
                {option}
              </button>
            ))}
            <button
              onClick={() => handleMultipleChoiceFinish(message.data.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue with selected options
            </button>
          </div>
        </div>
      );
    }

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
            <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
              Start My Health Journey
            </button>
          </div>
        </div>
      );
    }

    return <p className="text-gray-800">{message.content}</p>;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ember Health Buddy</h1>
            <p className="text-sm text-gray-600">Your AI-powered fitness companion</p>
          </div>
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
      {currentStep < onboardingSteps.length && onboardingSteps[currentStep]?.type === 'text' && (
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentInput.trim() && !isTyping) {
                  handleSubmit(e);
                }
              }}
              placeholder="Type your response..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSubmit}
              disabled={!currentInput.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;