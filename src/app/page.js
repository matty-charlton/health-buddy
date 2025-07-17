"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Heart } from 'lucide-react';

const HealthBuddyOnboarding = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    exerciseHistory: '',
    barriers: [],
    schedule: '',
    timeCommitment: '',
    energyPattern: '',
    environment: [],
    motivations: [],
    successGoal: '',
    accountabilityStyle: '',
    wearables: '',
    investment: '',
    physicalConsiderations: '',
    stressPattern: ''
  });
  const [trainerScores, setTrainerScores] = useState({
    'Alex - The Motivational Champion': 0,
    'Jordan - The Results-Focused Coach': 0,
    'Sam - The Wellness Mentor': 0,
    'Casey - The Adaptive Strategist': 0,
    'Riley - The Data-Driven Optimizer': 0
  });
  const [isTyping, setIsTyping] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Complete onboarding flow
  const onboardingFlow = [
    {
      phase: 'current_situation',
      message: "Hi! I'm your Health Buddy AI. I'm here to help you build sustainable exercise habits that actually stick. Unlike other fitness apps, I'll be with you every step of the way - not just during workouts, but throughout your entire day to keep you motivated and on track.\n\nBefore we start, I want to understand YOU. This isn't about generic fitness plans - it's about creating something that works for your unique life, schedule, and goals. Ready to get started?",
      type: 'confirmation'
    },
    {
      phase: 'current_situation',
      message: "Let's start with where you are right now. How would you describe your current relationship with exercise?",
      type: 'single_choice',
      options: [
        "I'm just starting out - exercise feels overwhelming",
        "I exercise sometimes but struggle to stay consistent", 
        "I used to be active but life got in the way",
        "I exercise regularly but want to improve my routine"
      ],
      field: 'exerciseHistory'
    },
    {
      phase: 'current_situation',
      message: "What's typically stopped you from exercising in the past? (You can select multiple)",
      type: 'multiple_choice',
      options: [
        "Not enough time in my schedule",
        "Lack of motivation or energy",
        "Don't know what exercises to do",
        "Feeling self-conscious or intimidated",
        "Stress and work pressures",
        "Family/caring responsibilities",
        "Boredom with routines",
        "Injuries or physical limitations",
        "Cost of gym/equipment"
      ],
      field: 'barriers'
    },
    {
      phase: 'lifestyle',
      message: "Let's talk about your real schedule - not your ideal one. What does a typical day look like for you?",
      type: 'single_choice',
      options: [
        "Super busy - barely have time to breathe",
        "Moderately busy but can find pockets of time",
        "Flexible schedule with some structure",
        "Fairly open schedule most days"
      ],
      field: 'schedule'
    },
    {
      phase: 'lifestyle',
      message: "Based on that, how much time could you realistically commit to exercise most days?",
      type: 'single_choice',
      options: [
        "5-10 minutes (micro-workouts)",
        "15-20 minutes (focused sessions)",
        "30-45 minutes (standard workouts)",
        "45+ minutes (longer sessions)"
      ],
      field: 'timeCommitment'
    },
    {
      phase: 'lifestyle',
      message: "When do you typically feel most energetic?",
      type: 'single_choice',
      options: [
        "Morning person - best energy early",
        "Afternoon peaks - lunch/post-work",
        "Evening energy - after dinner",
        "Night owl - late evening works",
        "Energy varies day to day"
      ],
      field: 'energyPattern'
    },
    {
      phase: 'lifestyle',
      message: "Where would you prefer to exercise? (Multiple selections allowed)",
      type: 'multiple_choice',
      options: [
        "At home - living room/bedroom",
        "Outdoors - parks, walking, running",
        "Gym or fitness centre",
        "Workplace - office breaks",
        "Varies depending on mood/weather"
      ],
      field: 'environment'
    },
    {
      phase: 'motivation',
      message: "What's driving you to want to exercise more? Understanding your 'why' helps me motivate you effectively.",
      type: 'multiple_choice',
      options: [
        "Stress relief and mental health",
        "Weight management",
        "Increased energy and vitality",
        "Better sleep quality",
        "Strength and fitness improvement",
        "Setting a good example for family",
        "Preventive health/medical reasons",
        "Confidence and self-esteem"
      ],
      field: 'motivations'
    },
    {
      phase: 'motivation',
      message: "What would success look like for you in 3 months?",
      type: 'single_choice',
      options: [
        "Exercising consistently 3+ times per week",
        "Feeling more energetic and less stressed",
        "Completing a specific fitness challenge",
        "Making exercise a natural part of my routine",
        "Improving specific health markers",
        "Feeling stronger and more confident"
      ],
      field: 'successGoal'
    },
    {
      phase: 'motivation',
      message: "How do you respond best to motivation and accountability?",
      type: 'single_choice',
      options: [
        "Gentle daily reminders and encouragement",
        "Achievement tracking and progress celebration",
        "Tough love - push me when I'm slacking",
        "Understanding support when I'm struggling",
        "Social challenges and community",
        "Data and insights about my progress"
      ],
      field: 'accountabilityStyle'
    },
    {
      phase: 'technology',
      message: "Do you use any fitness trackers or health apps I can connect with to better understand your activity?",
      type: 'single_choice',
      options: [
        "Apple Watch/iPhone Health",
        "Fitbit device",
        "Garmin watch",
        "Samsung Health",
        "Google Fit",
        "No wearables - just my phone",
        "Not sure/prefer not to connect"
      ],
      field: 'wearables'
    },
    {
      phase: 'technology',
      message: "Health is an investment. What feels comfortable for you monthly?",
      type: 'single_choice',
      options: [
        "Free features only (£0)",
        "Basic plan (£5-10/month)",
        "Standard plan (£15-25/month)",
        "Premium plan (£30-40/month)",
        "I'll decide after trying the free version"
      ],
      field: 'investment'
    },
    {
      phase: 'trainer_selection',
      message: "I'm analyzing your responses to determine the perfect AI trainer for you...",
      type: 'ai_analysis'
    },
    {
      phase: 'health_details',
      message: "Want to share any physical considerations? This helps me suggest safer, more effective exercises. You can skip this if you prefer.",
      type: 'single_choice_optional',
      options: [
        "No limitations - ready for anything",
        "Joint issues - need low-impact options",
        "Back problems - careful with certain movements",
        "Recovering from injury - gentle approach",
        "Prefer bodyweight exercises only",
        "Have access to specific equipment",
        "I'll update this later if needed"
      ],
      field: 'physicalConsiderations'
    },
    {
      phase: 'health_details',
      message: "How does stress typically affect your exercise motivation? This helps me time my support better.",
      type: 'single_choice',
      options: [
        "Stress kills my motivation completely",
        "I use exercise to manage stress",
        "Stress makes me too tired to exercise",
        "I stress-eat and then feel guilty",
        "Stress varies my energy levels dramatically"
      ],
      field: 'stressPattern'
    },
    {
      phase: 'setup_complete',
      message: "Perfect! Based on everything you've shared, here's what I'm creating for you:",
      type: 'final_setup'
    }
  ];

  // Scoring system for trainer selection
  const updateTrainerScores = (field, value) => {
    const newScores = { ...trainerScores };
    
    if (field === 'exerciseHistory') {
      if (value.includes("starting out") || value.includes("overwhelming")) {
        newScores['Alex - The Motivational Champion'] += 3;
        newScores['Sam - The Wellness Mentor'] += 2;
      } else if (value.includes("struggle to stay consistent")) {
        newScores['Casey - The Adaptive Strategist'] += 3;
        newScores['Alex - The Motivational Champion'] += 2;
      } else if (value.includes("regularly but want to improve")) {
        newScores['Jordan - The Results-Focused Coach'] += 3;
        newScores['Riley - The Data-Driven Optimizer'] += 2;
      } else if (value.includes("used to be active")) {
        newScores['Sam - The Wellness Mentor'] += 2;
        newScores['Casey - The Adaptive Strategist'] += 2;
      }
    }

    if (field === 'barriers') {
      if (value.includes("Not enough time") || value.includes("Family/caring responsibilities")) {
        newScores['Casey - The Adaptive Strategist'] += 2;
      }
      if (value.includes("Lack of motivation") || value.includes("Feeling self-conscious")) {
        newScores['Alex - The Motivational Champion'] += 2;
      }
      if (value.includes("Stress and work pressures")) {
        newScores['Sam - The Wellness Mentor'] += 2;
      }
      if (value.includes("Don't know what exercises") || value.includes("Boredom with routines")) {
        newScores['Jordan - The Results-Focused Coach'] += 1;
        newScores['Riley - The Data-Driven Optimizer'] += 1;
      }
    }

    if (field === 'schedule') {
      if (value.includes("Super busy")) {
        newScores['Casey - The Adaptive Strategist'] += 3;
      } else if (value.includes("Moderately busy")) {
        newScores['Sam - The Wellness Mentor'] += 2;
        newScores['Casey - The Adaptive Strategist'] += 1;
      } else if (value.includes("Fairly open")) {
        newScores['Jordan - The Results-Focused Coach'] += 2;
        newScores['Riley - The Data-Driven Optimizer'] += 1;
      }
    }

    if (field === 'motivations') {
      if (value.includes("Stress relief and mental health")) {
        newScores['Sam - The Wellness Mentor'] += 3;
      }
      if (value.includes("Weight management") || value.includes("Strength and fitness improvement")) {
        newScores['Jordan - The Results-Focused Coach'] += 2;
      }
      if (value.includes("Setting a good example for family")) {
        newScores['Casey - The Adaptive Strategist'] += 2;
        newScores['Alex - The Motivational Champion'] += 1;
      }
      if (value.includes("Preventive health/medical reasons")) {
        newScores['Riley - The Data-Driven Optimizer'] += 2;
        newScores['Sam - The Wellness Mentor'] += 1;
      }
      if (value.includes("Confidence and self-esteem")) {
        newScores['Alex - The Motivational Champion'] += 2;
      }
    }

    if (field === 'accountabilityStyle') {
      if (value.includes("Gentle daily reminders") || value.includes("Understanding support")) {
        newScores['Alex - The Motivational Champion'] += 3;
        newScores['Sam - The Wellness Mentor'] += 2;
      } else if (value.includes("Achievement tracking") || value.includes("Data and insights")) {
        newScores['Riley - The Data-Driven Optimizer'] += 3;
        newScores['Jordan - The Results-Focused Coach'] += 2;
      } else if (value.includes("Tough love") || value.includes("push me")) {
        newScores['Jordan - The Results-Focused Coach'] += 3;
      } else if (value.includes("Social challenges")) {
        newScores['Jordan - The Results-Focused Coach'] += 2;
        newScores['Alex - The Motivational Champion'] += 1;
      }
    }

    if (field === 'wearables') {
      if (value.includes("Apple Watch") || value.includes("Garmin") || value.includes("Samsung Health")) {
        newScores['Riley - The Data-Driven Optimizer'] += 2;
      } else if (value.includes("No wearables") || value.includes("Not sure")) {
        newScores['Alex - The Motivational Champion'] += 1;
        newScores['Sam - The Wellness Mentor'] += 1;
      }
    }

    if (field === 'investment') {
      if (value.includes("Premium plan")) {
        newScores['Riley - The Data-Driven Optimizer'] += 2;
        newScores['Jordan - The Results-Focused Coach'] += 1;
      } else if (value.includes("Free features only")) {
        newScores['Alex - The Motivational Champion'] += 1;
      }
    }

    if (field === 'stressPattern') {
      if (value.includes("kills my motivation") || value.includes("too tired")) {
        newScores['Sam - The Wellness Mentor'] += 3;
        newScores['Alex - The Motivational Champion'] += 2;
      } else if (value.includes("use exercise to manage stress")) {
        newScores['Sam - The Wellness Mentor'] += 2;
        newScores['Jordan - The Results-Focused Coach'] += 1;
      } else if (value.includes("varies my energy levels")) {
        newScores['Casey - The Adaptive Strategist'] += 3;
      }
    }

    setTrainerScores(newScores);
  };

  const selectOptimalTrainer = () => {
    const maxScore = Math.max(...Object.values(trainerScores));
    const optimalTrainer = Object.keys(trainerScores).find(
      trainer => trainerScores[trainer] === maxScore
    );
    return optimalTrainer;
  };

  const getTrainerRecommendationReasoning = (selectedTrainer) => {
    const reasoning = {
      'Alex - The Motivational Champion': [
        "You mentioned feeling overwhelmed or lacking confidence with exercise",
        "You prefer gentle encouragement and supportive motivation",
        "Building sustainable habits through positive reinforcement works best for you"
      ],
      'Jordan - The Results-Focused Coach': [
        "You're ready to be challenged and push towards specific goals",
        "You respond well to structured accountability and performance tracking", 
        "You have clear fitness objectives and want to see measurable progress"
      ],
      'Sam - The Wellness Mentor': [
        "Stress management and mental wellbeing are important motivators for you",
        "You prefer a holistic approach that considers mind-body connection",
        "You want exercise to be sustainable self-care, not punishment"
      ],
      'Casey - The Adaptive Strategist': [
        "Your schedule is unpredictable and you need flexible solutions",
        "Family responsibilities and time constraints are major factors",
        "You need someone who can adapt plans based on your daily reality"
      ],
      'Riley - The Data-Driven Optimizer': [
        "You're tech-savvy and interested in using data to optimize performance",
        "You want evidence-based approaches and detailed progress insights",
        "You have health metrics you want to track and improve systematically"
      ]
    };

    return reasoning[selectedTrainer] || reasoning['Alex - The Motivational Champion'];
  };

  const determinePersona = (data) => {
    const hasTimeBarriers = data.barriers.includes("Not enough time in my schedule");
    const hasFamilyBarriers = data.barriers.includes("Family/caring responsibilities");
    const hasStressBarriers = data.barriers.includes("Stress and work pressures");
    const isOverwhelmed = data.barriers.includes("Feeling self-conscious or intimidated") || 
                         data.exerciseHistory.includes("overwhelming");
    const isInconsistent = data.exerciseHistory.includes("struggle to stay consistent");
    const hasHealthFocus = data.motivations.includes("Preventive health/medical reasons");
    const isBeginner = data.exerciseHistory.includes("starting out");

    if ((hasTimeBarriers || hasFamilyBarriers || hasStressBarriers) && 
        data.motivations.includes("Setting a good example for family")) {
      return 'Corporate Millennial';
    } else if (hasHealthFocus && !isOverwhelmed && !isBeginner) {
      return 'Health-Conscious Gen X';
    } else if (isOverwhelmed || isBeginner || data.exerciseHistory.includes("overwhelming")) {
      return 'Reluctant Exerciser';
    } else {
      return 'Health Enthusiast';
    }
  };

  const getPersonaSetup = (persona, trainer, userData) => {
    const setups = {
      'Corporate Millennial': {
        title: 'Stress-Buster Program',
        description: '15-minute morning energy sessions and 5-minute desk breaks. I\'ll remind you at optimal times and adapt when I see stressful meetings in your calendar.',
        focus: 'Stress relief and energy - not perfect form or intensity',
        features: [
          'Micro-workout integration for busy schedules',
          'Stress-focused programming',
          'Family-friendly options',
          'Calendar integration for smart timing',
          'Professional wellness support'
        ]
      },
      'Health-Conscious Gen X': {
        title: 'Preventive Health Program',
        description: '30-minute structured routines with detailed progress tracking. I\'ll integrate with your health apps and provide weekly insights.',
        focus: 'Evidence-based approach with health metrics',
        features: [
          'Healthcare provider integration',
          'Condition-specific programming',
          'Professional consultation access',
          'Detailed health metrics tracking',
          'Travel-friendly alternatives'
        ]
      },
      'Reluctant Exerciser': {
        title: 'Confidence Builder Journey',
        description: 'Starting with 5-minute gentle movements and celebrating every single day you show up. I\'ll be encouraging and patient.',
        focus: 'Building confidence and sustainable habits',
        features: [
          'Gentle onboarding with confidence-building',
          'Emotional intelligence support',
          'Simple, non-overwhelming interface',
          'Daily check-ins during habit formation',
          'Achievement recognition for small wins'
        ]
      },
      'Health Enthusiast': {
        title: 'Performance Optimization Program',
        description: 'Advanced analytics, wearable integration, and sophisticated programming to help you reach peak performance.',
        focus: 'Data-driven optimization and advanced features',
        features: [
          'Advanced AI coaching algorithms',
          'Comprehensive wearable integration',
          'Performance analytics dashboard',
          'Adaptive difficulty progression',
          'Community challenges and competitions'
        ]
      }
    };

    return setups[persona] || setups['Health Enthusiast'];
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

  const processUserInput = (input, field = null) => {
    addMessage(input, true);
    
    if (field) {
      if (field === 'barriers' || field === 'environment' || field === 'motivations') {
        setUserData(prev => ({
          ...prev,
          [field]: [...(prev[field] || []), input]
        }));
        setSelectedItems(prev => [...prev, input]);
        updateTrainerScores(field, input);
        return;
      } else {
        setUserData(prev => ({ ...prev, [field]: input }));
        updateTrainerScores(field, input);
      }
    }

    advanceToNextStep();
  };

  const advanceToNextStep = () => {
    simulateTyping(() => {
      const nextStep = currentStep + 1;
      if (nextStep < onboardingFlow.length) {
        setCurrentStep(nextStep);
        const step = onboardingFlow[nextStep];
        
        if (step.type === 'ai_analysis') {
          addMessage(step.message, false, step.type, step);
          setTimeout(() => {
            showFinalSetup();
          }, 3000);
        } else {
          addMessage(step.message, false, step.type, step);
        }
      } else {
        showFinalSetup();
      }
    });
  };

  const showFinalSetup = () => {
    const persona = determinePersona(userData);
    const selectedTrainer = selectOptimalTrainer();
    const setup = getPersonaSetup(persona, selectedTrainer, userData);
    const reasoning = getTrainerRecommendationReasoning(selectedTrainer);
    
    addMessage("", false, 'final_setup', {
      persona,
      setup,
      userData,
      selectedTrainer,
      reasoning,
      scores: trainerScores
    });
  };

  const handleMultipleChoiceFinish = (field) => {
    addMessage(`Selected ${selectedItems.length} options`, true);
    setSelectedItems([]);
    advanceToNextStep();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const step = onboardingFlow[currentStep];
    processUserInput(currentInput, step?.field);
    setCurrentInput('');
  };

  useEffect(() => {
    if (messages.length === 0) {
      simulateTyping(() => {
        const firstStep = onboardingFlow[0];
        addMessage(firstStep.message, false, firstStep.type, firstStep);
      }, 500);
    }
  }, []);

  const renderMessage = (message) => {
    if (message.type === 'confirmation' && !message.isUser) {
      return (
        <div className="space-y-3">
          <p className="text-gray-800 whitespace-pre-line">{message.content}</p>
          <button
            onClick={() => processUserInput("Yes, let's get started!")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
          >
            Yes, let's get started!
          </button>
        </div>
      );
    }

    if (message.type === 'single_choice' && !message.isUser) {
      return (
        <div className="space-y-2">
          <p className="text-gray-800">{message.content}</p>
          <div className="grid gap-2 mt-3">
            {message.data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => processUserInput(option, message.data.field)}
                className="text-black text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'single_choice_optional' && !message.isUser) {
      return (
        <div className="space-y-2">
          <p className="text-gray-800">{message.content}</p>
          <div className="grid gap-2 mt-3">
            {message.data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => processUserInput(option, message.data.field)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={() => processUserInput("Skip this step", null)}
            className="mt-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip this step
          </button>
        </div>
      );
    }

    if (message.type === 'multiple_choice' && !message.isUser) {
      return (
        <div className="space-y-2">
          <p className="text-gray-800">{message.content}</p>
          <div className="grid gap-2 mt-3">
            {message.data.options.map((option, index) => {
              const isSelected = selectedItems.includes(option);
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isSelected) {
                      processUserInput(option, message.data.field);
                    }
                  }}
                  className={`text-left p-3 border rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-blue-100 text-black border-blue-300' 
                      : 'border-gray-200 text-black hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  disabled={isSelected}
                >
                  {option} {isSelected && '✓'}
                </button>
              );
            })}
            {selectedItems.length > 0 && (
              <button
                onClick={() => handleMultipleChoiceFinish(message.data.field)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue with {selectedItems.length} selected
              </button>
            )}
          </div>
        </div>
      );
    }

    if (message.type === 'ai_analysis' && !message.isUser) {
      return (
        <div className="space-y-3">
          <p className="text-gray-800">{message.content}</p>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-700 font-medium">Analyzing your preferences and matching you with the ideal trainer...</span>
          </div>
        </div>
      );
    }

    if (message.type === 'final_setup' && !message.isUser) {
      const { persona, setup, selectedTrainer, reasoning, scores } = message.data;
      
      const trainerDetails = {
        'Alex - The Motivational Champion': { icon: '🌟', color: 'from-green-500 to-blue-500' },
        'Jordan - The Results-Focused Coach': { icon: '💪', color: 'from-red-500 to-orange-500' },
        'Sam - The Wellness Mentor': { icon: '🧘', color: 'from-purple-500 to-pink-500' },
        'Casey - The Adaptive Strategist': { icon: '🎯', color: 'from-blue-500 to-cyan-500' },
        'Riley - The Data-Driven Optimizer': { icon: '🔬', color: 'from-indigo-500 to-purple-500' }
      };

      const trainer = trainerDetails[selectedTrainer];
      
      return (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold">
                <Heart className="w-5 h-5" />
                {persona} Profile
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🎯 Your Perfect AI Trainer Match</h3>
                <div className={`inline-flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${trainer.color} text-white rounded-lg text-xl font-semibold`}>
                  <span className="text-2xl">{trainer.icon}</span>
                  {selectedTrainer}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Why this trainer is perfect for you:</h4>
                <ul className="space-y-1">
                  {reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-1">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                  View AI scoring breakdown
                </summary>
                <div className="mt-3 space-y-2">
                  {Object.entries(scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([trainer, score]) => (
                    <div key={trainer} className="flex justify-between items-center text-xs">
                      <span className={score === Math.max(...Object.values(scores)) ? 'font-semibold text-green-600' : 'text-gray-600'}>
                        {trainer}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${score === Math.max(...Object.values(scores)) ? 'bg-green-500' : 'bg-gray-400'}`}
                            style={{ width: `${(score / Math.max(...Object.values(scores))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 w-6">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{setup.title}</h3>
                <p className="text-gray-600">{setup.description}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">My Focus for You:</h4>
                <p className="text-gray-700">{setup.focus}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Features Activated:</h4>
                <div className="grid gap-2">
                  {setup.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium text-lg">
              Start My Health Journey with {selectedTrainer.split(' - ')[0]}
            </button>
          </div>
        </div>
      );
    }

    return <p className="text-gray-800 whitespace-pre-line">{message.content}</p>;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              className={`max-w-2xl p-4 rounded-lg ${
                message.isUser
                  ? 'bg-[#f3b54f] text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {renderMessage(message)}
            </div>
            {message.isUser && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-black" />
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

      {currentStep < onboardingFlow.length && onboardingFlow[currentStep]?.type === 'text' && (
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

export default HealthBuddyOnboarding;