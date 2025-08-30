import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home,
  BookOpen,
  Users,
  Infinity,
  TrendingUp,
  Crown,
  User,
  FileText,
  Bot,
  Target,
  MessageCircle,
  Trophy,
  Clock,
  CheckCircle,
  Zap,
  Play,
  Mic,
  Volume2,
  Brain,
  Heart,
  Activity,
  Star,
  Lightbulb,
  Award,
  MessageSquare,
  Headphones,
  Lock
} from 'lucide-react';
import ExerciseModule from './ExerciseModule';

function Dashboard({ setCurrentPage }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [realTimeProgress, setRealTimeProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showExerciseModule, setShowExerciseModule] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home className="w-5 h-5" />, active: true },
    { id: 'storytelling', name: 'Storytelling', icon: <BookOpen className="w-5 h-5" />, active: false },
    { id: 'daily-scenario', name: 'Daily Scenario', icon: <Users className="w-5 h-5" />, active: false },
    { id: 'games', name: 'Pronunciation Games', icon: <Trophy className="w-5 h-5" />, active: false },
    { id: 'progress', name: 'Progress', icon: <TrendingUp className="w-5 h-5" />, active: false },
    { id: 'rewards', name: 'Rewards', icon: <Crown className="w-5 h-5" />, active: false },
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" />, active: false },
    { id: 'resources', name: 'Resources', icon: <FileText className="w-5 h-5" />, active: false },
    { id: 'ai-assistant', name: 'AI Assistant', icon: <Bot className="w-5 h-5" />, active: false }
  ];

  const featureCards = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Build Confidence",
      description: "Clear communication helps you express yourself with assurance in any situation."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Better",
      description: "Improve your social interactions and make meaningful connections with others."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achieve Goals",
      description: "From classroom presentations to job interviews, clear speech opens doors."
    }
  ];

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    if (pageId === 'dashboard') {
      // Stay on dashboard
    } else {
      setCurrentPage(pageId);
    }
  };

  // Enhanced Exercise Data - 40+ exercises for comprehensive speech therapy
  const exercises = [
    // Beginner Level Exercises
    {
      id: 1,
      title: "Basic Vowel Sounds",
      description: "Practice clear pronunciation of A, E, I, O, U sounds with visual guides",
      difficulty: "Beginner",
      type: "Pronunciation",
      duration: 5,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 2,
      title: "Simple Word Repetition",
      description: "Repeat common words to build confidence and clarity",
      difficulty: "Beginner",
      type: "Articulation",
      duration: 8,
      icon: <Volume2 className="w-8 h-8" />
    },
    {
      id: 3,
      title: "Breathing Exercises",
      description: "Learn proper breathing techniques for better voice control",
      difficulty: "Beginner",
      type: "Voice",
      duration: 6,
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 4,
      title: "Basic Sentence Reading",
      description: "Read simple sentences with proper pacing and clarity",
      difficulty: "Beginner",
      type: "Fluency",
      duration: 10,
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 5,
      title: "Word Association",
      description: "Connect related words to improve vocabulary and speech flow",
      difficulty: "Beginner",
      type: "Language",
      duration: 7,
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 6,
      title: "Phoneme Isolation",
      description: "Identify individual sounds in words to improve phonemic awareness",
      difficulty: "Beginner",
      type: "Pronunciation",
      duration: 8,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 7,
      title: "Rhyming Words",
      description: "Practice rhyming patterns to enhance phonological skills",
      difficulty: "Beginner",
      type: "Language",
      duration: 9,
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 8,
      title: "Slow Speech Practice",
      description: "Practice speaking slowly and clearly for better articulation",
      difficulty: "Beginner",
      type: "Articulation",
      duration: 7,
      icon: <Volume2 className="w-8 h-8" />
    },
    {
      id: 9,
      title: "Voice Warm-up",
      description: "Gentle vocal exercises to prepare your voice for speaking",
      difficulty: "Beginner",
      type: "Voice",
      duration: 5,
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 10,
      title: "Picture Description",
      description: "Describe pictures to improve descriptive language skills",
      difficulty: "Beginner",
      type: "Language",
      duration: 12,
      icon: <Brain className="w-8 h-8" />
    },

    // Intermediate Level Exercises
    {
      id: 11,
      title: "Tongue Twisters",
      description: "Challenge your articulation with fun tongue twisters",
      difficulty: "Intermediate",
      type: "Articulation",
      duration: 12,
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 12,
      title: "Emotion in Speech",
      description: "Practice expressing different emotions through voice modulation",
      difficulty: "Intermediate",
      type: "Voice",
      duration: 15,
      icon: <Star className="w-8 h-8" />
    },
    {
      id: 13,
      title: "Speed Reading",
      description: "Improve reading fluency with timed reading exercises",
      difficulty: "Intermediate",
      type: "Fluency",
      duration: 18,
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 14,
      title: "Complex Word Practice",
      description: "Master difficult words with syllable breakdown",
      difficulty: "Intermediate",
      type: "Pronunciation",
      duration: 14,
      icon: <Lightbulb className="w-8 h-8" />
    },
    {
      id: 15,
      title: "Story Narration",
      description: "Tell short stories to improve narrative skills",
      difficulty: "Intermediate",
      type: "Language",
      duration: 20,
      icon: <Award className="w-8 h-8" />
    },
    {
      id: 16,
      title: "Consonant Blends",
      description: "Practice difficult consonant combinations for clearer speech",
      difficulty: "Intermediate",
      type: "Articulation",
      duration: 16,
      icon: <Volume2 className="w-8 h-8" />
    },
    {
      id: 17,
      title: "Pitch Variation",
      description: "Learn to vary your pitch for more engaging speech",
      difficulty: "Intermediate",
      type: "Voice",
      duration: 18,
      icon: <Star className="w-8 h-8" />
    },
    {
      id: 18,
      title: "Reading with Expression",
      description: "Read passages with appropriate emotion and emphasis",
      difficulty: "Intermediate",
      type: "Fluency",
      duration: 22,
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 19,
      title: "Syllable Stress",
      description: "Practice proper syllable emphasis in multi-syllable words",
      difficulty: "Intermediate",
      type: "Pronunciation",
      duration: 16,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 20,
      title: "Conversation Practice",
      description: "Engage in structured conversations to improve social speech",
      difficulty: "Intermediate",
      type: "Language",
      duration: 25,
      icon: <Users className="w-8 h-8" />
    },

    // Advanced Level Exercises
    {
      id: 21,
      title: "Public Speaking Prep",
      description: "Practice formal presentations with audience simulation",
      difficulty: "Advanced",
      type: "Voice",
      duration: 25,
      icon: <Target className="w-8 h-8" />
    },
    {
      id: 22,
      title: "Debate Practice",
      description: "Engage in structured debates to improve argumentative speech",
      difficulty: "Advanced",
      type: "Language",
      duration: 30,
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 23,
      title: "Advanced Articulation",
      description: "Master complex consonant clusters and sound combinations",
      difficulty: "Advanced",
      type: "Articulation",
      duration: 22,
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      id: 24,
      title: "Voice Acting",
      description: "Practice character voices and dramatic reading",
      difficulty: "Advanced",
      type: "Voice",
      duration: 28,
      icon: <Headphones className="w-8 h-8" />
    },
    {
      id: 25,
      title: "Technical Presentation",
      description: "Deliver complex information clearly and engagingly",
      difficulty: "Advanced",
      type: "Language",
      duration: 35,
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 26,
      title: "Accent Reduction",
      description: "Work on reducing regional accents for clearer communication",
      difficulty: "Advanced",
      type: "Pronunciation",
      duration: 30,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 27,
      title: "Speech Rate Control",
      description: "Master speaking at different speeds for various contexts",
      difficulty: "Advanced",
      type: "Fluency",
      duration: 28,
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 28,
      title: "Vocal Resonance",
      description: "Develop rich vocal resonance for more powerful speech",
      difficulty: "Advanced",
      type: "Voice",
      duration: 25,
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 29,
      title: "Complex Storytelling",
      description: "Create and narrate complex stories with multiple characters",
      difficulty: "Advanced",
      type: "Language",
      duration: 35,
      icon: <Award className="w-8 h-8" />
    },
    {
      id: 30,
      title: "Professional Interview Prep",
      description: "Practice interview responses with proper speech patterns",
      difficulty: "Advanced",
      type: "Language",
      duration: 32,
      icon: <Target className="w-8 h-8" />
    },
    {
      id: 31,
      title: "Multilingual Pronunciation",
      description: "Practice pronunciation across different languages",
      difficulty: "Advanced",
      type: "Pronunciation",
      duration: 30,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 32,
      title: "Speech Therapy Assessment",
      description: "Comprehensive speech evaluation and improvement plan",
      difficulty: "Advanced",
      type: "Articulation",
      duration: 40,
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 33,
      title: "Voice Projection",
      description: "Learn to project your voice for large audiences",
      difficulty: "Advanced",
      type: "Voice",
      duration: 28,
      icon: <Volume2 className="w-8 h-8" />
    },
    {
      id: 34,
      title: "Academic Presentation",
      description: "Deliver academic content with professional speech standards",
      difficulty: "Advanced",
      type: "Language",
      duration: 35,
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 35,
      title: "Speech Impediment Work",
      description: "Targeted exercises for specific speech challenges",
      difficulty: "Advanced",
      type: "Articulation",
      duration: 30,
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      id: 36,
      title: "Broadcasting Practice",
      description: "Practice professional broadcasting speech patterns",
      difficulty: "Advanced",
      type: "Voice",
      duration: 32,
      icon: <Headphones className="w-8 h-8" />
    },
    {
      id: 37,
      title: "Legal Argumentation",
      description: "Practice legal argumentative speech patterns",
      difficulty: "Advanced",
      type: "Language",
      duration: 38,
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 38,
      title: "Medical Terminology",
      description: "Master pronunciation of complex medical terms",
      difficulty: "Advanced",
      type: "Pronunciation",
      duration: 35,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 39,
      title: "Poetry Recitation",
      description: "Practice expressive poetry reading with proper emphasis",
      difficulty: "Advanced",
      type: "Fluency",
      duration: 30,
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 40,
      title: "Executive Communication",
      description: "Master executive-level communication and presentation skills",
      difficulty: "Advanced",
      type: "Language",
      duration: 40,
      icon: <Target className="w-8 h-8" />
    },
    {
      id: 41,
      title: "Breathing Control",
      description: "Master diaphragmatic breathing for better voice control",
      difficulty: "Beginner",
      type: "Breathing",
      duration: 6,
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 42,
      title: "Vocal Resonance",
      description: "Develop rich vocal resonance for powerful speech",
      difficulty: "Intermediate",
      type: "Resonance",
      duration: 18,
      icon: <Volume2 className="w-8 h-8" />
    },
    {
      id: 43,
      title: "Voice Projection",
      description: "Learn to project your voice for large audiences",
      difficulty: "Advanced",
      type: "Projection",
      duration: 25,
      icon: <Mic className="w-8 h-8" />
    },
    {
      id: 44,
      title: "Emotional Expression",
      description: "Express emotions through voice modulation",
      difficulty: "Intermediate",
      type: "Expression",
      duration: 20,
      icon: <Star className="w-8 h-8" />
    },
    {
      id: 45,
      title: "Confidence Building",
      description: "Build speaking confidence through positive reinforcement",
      difficulty: "Beginner",
      type: "Confidence",
      duration: 10,
      icon: <Trophy className="w-8 h-8" />
    },
    {
      id: 46,
      title: "Mindful Speaking",
      description: "Practice mindful speech with meditation techniques",
      difficulty: "Intermediate",
      type: "Breathing",
      duration: 15,
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 47,
      title: "Vocal Warm-up",
      description: "Comprehensive vocal warm-up routine",
      difficulty: "Beginner",
      type: "Voice",
      duration: 8,
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 48,
      title: "Speech Clarity",
      description: "Focus on clear articulation and pronunciation",
      difficulty: "Intermediate",
      type: "Articulation",
      duration: 22,
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      id: 49,
      title: "Communication Skills",
      description: "Enhance overall communication effectiveness",
      difficulty: "Advanced",
      type: "Language",
      duration: 35,
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 50,
      title: "Public Speaking Mastery",
      description: "Master the art of public speaking",
      difficulty: "Advanced",
      type: "Confidence",
      duration: 45,
      icon: <Target className="w-8 h-8" />
    }
  ];

  // Filter exercises based on selected criteria
  // Filter exercises based on selected difficulty and type - optimized with useMemo
  const filteredExercises = React.useMemo(() => {
    return exercises.filter(exercise => {
      const difficultyMatch = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty;
      const typeMatch = selectedType === 'All' || exercise.type === selectedType;
      return difficultyMatch && typeMatch;
    });
  }, [selectedDifficulty, selectedType]);

  // Backend Integration Functions
  const updateExerciseProgress = async (exerciseId, status = 'completed') => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const exerciseData = {
        userId: userId,
        exerciseData: {
          exerciseId: exerciseId,
          status: status,
          completedAt: new Date().toISOString(),
          type: 'exercise',
          points: 10 // Base points for completing an exercise
        }
      };

      const response = await fetch('http://localhost:5001/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(exerciseData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.statusText}`);
      }

      console.log('Exercise progress updated successfully!');
      
    } catch (error) {
      console.error('Error updating exercise progress:', error);
    }
  };

  // Real-time data fetching from backend
  const fetchRealTimeProgress = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'default_user';
      
      const response = await fetch(`http://localhost:5001/api/progress/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.statusText}`);
      }

      const data = await response.json();
      const progress = data.progress;
      
      setRealTimeProgress(progress);
      setProgressStats(progress.progressStats || {});
      setWeeklyPlan(progress.weeklyPlan || []);
      
      console.log('Real-time progress fetched:', progress);
      console.log('Progress stats:', progress.progressStats);
      console.log('Weekly plan:', progress.weeklyPlan);
      
    } catch (error) {
      console.error('Error fetching real-time progress:', error);
      // No fallback - only use real data from backend
    } finally {
      setLoading(false);
    }
  };

  // Memoize exercise statuses to prevent unnecessary recalculations
  const exerciseStatuses = React.useMemo(() => {
    const statuses = {};
    if (realTimeProgress?.exerciseHistory) {
      realTimeProgress.exerciseHistory.forEach(ex => {
        statuses[ex.exerciseId] = ex.status || 'completed';
      });
    }
    return statuses;
  }, [realTimeProgress?.exerciseHistory]);

  const getExerciseStatus = (exerciseId) => {
    // Get cached status from memoized object
    return exerciseStatuses[exerciseId] || 'locked';
  };

  // Memoize weekly plan data to prevent unnecessary recalculations
  const weeklyPlanData = React.useMemo(() => {
    // Use real weekly plan data from backend
    if (weeklyPlan && weeklyPlan.length > 0) {
      return {
        weeklyGoal: 30, // 30 minutes per week
        completedThisWeek: weeklyPlan.reduce((sum, day) => sum + day.completedMinutes, 0),
        remainingDays: weeklyPlan.filter(day => !day.isCompleted).length,
        dailyTarget: 15, // 15 minutes per day
        weeklyPlan: weeklyPlan
      };
    }
    
    // No fallback - only use real data from backend
    return {
      weeklyGoal: 30,
      completedThisWeek: 0,
      remainingDays: 7,
      dailyTarget: 15,
      weeklyPlan: []
    };
  }, [weeklyPlan, realTimeProgress]);

  const getWeeklyPlanData = () => weeklyPlanData;

  // Fetch real-time data when component mounts
  useEffect(() => {
    fetchRealTimeProgress();
  }, []);

  // Refresh progress data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealTimeProgress();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleStartExercise = async (exercise) => {
    try {
      console.log('Starting exercise:', exercise.title);
      
      // Mark exercise as in-progress in backend
      await updateExerciseProgress(exercise.id, 'in-progress');
      
      // Set selected exercise and show exercise module
      setSelectedExercise(exercise);
      setShowExerciseModule(true);
      
    } catch (error) {
      console.error('Error starting exercise:', error);
      alert('Failed to start exercise. Please try again.');
    }
  };

  const completeExercise = async (exercise) => {
    try {
      console.log('Completing exercise:', exercise.title);
      
      // Update exercise status to completed in backend
      await updateExerciseProgress(exercise.id, 'completed');
      
      // Send to speech analyzer for assessment
      await sendToSpeechAnalyzer(exercise);
      
      // Refresh progress data
      await fetchRealTimeProgress();
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Failed to complete exercise. Please try again.');
    }
  };

  const sendToSpeechAnalyzer = async (exercise) => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      
      const analysisData = {
        userId: userId,
        exerciseId: exercise.id,
        exerciseType: exercise.type,
        difficulty: exercise.difficulty,
        duration: exercise.duration,
        completedAt: new Date().toISOString(),
        analysisType: 'exercise_completion'
      };

      const response = await fetch('http://localhost:5001/api/speech-analysis/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error(`Speech analysis failed: ${response.statusText}`);
      }

      const analysisResult = await response.json();
      console.log('Speech analysis completed:', analysisResult);
      
      // Update progress with analysis results
      await updateProgressWithAnalysis(exercise.id, analysisResult);
      
    } catch (error) {
      console.error('Error sending to speech analyzer:', error);
      // Continue without analysis - exercise still completed
    }
  };

  const updateProgressWithAnalysis = async (exerciseId, analysisResult) => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      
      const progressData = {
        userId: userId,
        exerciseData: {
          exerciseId: exerciseId,
          status: 'completed',
          completedAt: new Date().toISOString(),
          type: 'exercise',
          points: calculateExercisePoints(analysisResult),
          analysisResults: analysisResult,
          speechMetrics: {
            pronunciationScore: analysisResult.pronunciationScore || 0,
            fluencyScore: analysisResult.fluencyScore || 0,
            clarityScore: analysisResult.clarityScore || 0,
            overallScore: analysisResult.overallScore || 0
          }
        }
      };

      const response = await fetch('http://localhost:5001/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.statusText}`);
      }

      console.log('Progress updated with analysis results!');
      
    } catch (error) {
      console.error('Error updating progress with analysis:', error);
    }
  };

  const calculateExercisePoints = (analysisResult) => {
    // Calculate points based on analysis results and exercise difficulty
    let basePoints = 10;
    let difficultyMultiplier = 1;
    
    if (analysisResult.difficulty === 'Intermediate') difficultyMultiplier = 1.5;
    if (analysisResult.difficulty === 'Advanced') difficultyMultiplier = 2;
    
    let performanceMultiplier = 1;
    if (analysisResult.overallScore >= 90) performanceMultiplier = 1.5;
    else if (analysisResult.overallScore >= 80) performanceMultiplier = 1.2;
    else if (analysisResult.overallScore >= 70) performanceMultiplier = 1.0;
    else performanceMultiplier = 0.8;
    
    return Math.round(basePoints * difficultyMultiplier * performanceMultiplier);
  };

  const handleExerciseComplete = (completionData) => {
    console.log('Exercise completed:', completionData);
    setShowExerciseModule(false);
    setSelectedExercise(null);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
    
    // Refresh progress data
    fetchRealTimeProgress();
  };

  const handleExerciseBack = () => {
    setShowExerciseModule(false);
    setSelectedExercise(null);
  };

  return (
    <>
      {/* Show exercise module if active */}
      {showExerciseModule && selectedExercise ? (
        <ExerciseModule
          exercise={selectedExercise}
          onComplete={handleExerciseComplete}
          onBack={handleExerciseBack}
          userProgress={realTimeProgress}
        />
      ) : (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Enhanced Brand Section */}
        <div className="relative z-10 p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">SpeechCoach</h1>
            <p className="text-sm text-blue-200">Speech Therapy for Teens</p>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="relative z-10 mt-8 px-6">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`group block w-full mb-4 p-5 rounded-2xl transition-all duration-500 hover:scale-105 transform ${
                item.active
                  ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-2xl shadow-blue-500/25 border-l-4 border-cyan-300'
                  : 'text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl ${
                  item.active 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-slate-700/50 group-hover:bg-white/10'
                }`}>
                  <div className={`text-slate-300 group-hover:text-white transition-colors duration-300 ${
                    item.active ? 'text-white' : ''
                  }`}>
                    {item.icon}
                  </div>
                </div>
                <span className="font-semibold text-lg">{item.name}</span>
              </div>
              
              {/* Hover Effect Indicator */}
              {!item.active && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-xl border-b border-slate-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                SpeechCoach - Teen
              </h1>
              <p className="text-slate-600 mt-1 text-lg">Your Personal Speech Therapy Dashboard</p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={fetchRealTimeProgress}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Refresh Data</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all progress data? This action cannot be undone.')) {
                      // Reset progress logic here
                      console.log('Resetting progress data...');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Reset Progress</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <span className="text-slate-800 font-semibold text-lg">{user?.name || 'Teen User'}</span>
                <div className="text-sm text-slate-500">Active Session</div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content Area */}
        <main className="p-12">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Exercise Completed Successfully!</span>
              </div>
            </div>
          )}
          {/* Enhanced Welcome Section */}
          <div className="text-center mb-16 relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg">
              <Target className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Welcome to SpeechSpark!</span>
            </div>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome back, Teen User!
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Every day you practice, you're building communication skills that will benefit you for a lifetime.
            </p>
          </div>

          {/* Enhanced Quote Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-200/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="text-6xl text-blue-600 mb-6 font-serif">"</div>
                <p className="text-2xl italic text-slate-800 mb-6 leading-relaxed">
                Your voice matters. Every word you speak brings you closer to confident communication.
              </p>
              <div className="text-right">
                  <span className="text-lg text-blue-600 font-medium">- Speech Coach Maria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Why Your Practice Matters */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Why Your Practice Matters
            </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Every exercise builds essential skills for confident communication
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featureCards.map((card, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-lg">{card.description}</p>
                  </div>
                  
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Progress Overview */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
              Your Progress This Week
            </h3>
                  <p className="text-lg text-slate-600">Track your speech therapy journey and celebrate your achievements</p>
                </div>
                
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {loading ? '...' : (progressStats?.totalMinutes || 0)}
                      </div>
                <div className="text-blue-800 font-medium">Minutes Completed</div>
                      <div className="text-sm text-blue-600">of 30 weekly goal</div>
                    </div>
              </div>
              
                  <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {loading ? '...' : (progressStats?.totalExercises || 0)}
                      </div>
                <div className="text-green-800 font-medium">Exercises Done</div>
                <div className="text-sm text-green-600">This week</div>
                    </div>
              </div>
              
                  <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {loading ? '...' : (progressStats?.bestScore || 0)}
                      </div>
                      <div className="text-purple-800 font-medium">Best Score</div>
                      <div className="text-sm text-purple-600">This week</div>
                    </div>
              </div>
              
                  <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {loading ? '...' : (progressStats?.streakDays || 0)}
                      </div>
                <div className="text-orange-800 font-medium">Day Streak</div>
                <div className="text-sm text-orange-600">🔥 Amazing!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Progress Summary Section */}
           <div className="max-w-6xl mx-auto mb-16">
             <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
               <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                 <div className="text-center mb-8">
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-emerald-800 to-teal-800 bg-clip-text text-transparent mb-4">
                     This Week's Progress
                   </h3>
                   <p className="text-lg text-slate-600">Track your daily achievements and stay motivated</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="text-center">
                     <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                       <Target className="w-10 h-10 text-white" />
                     </div>
                     <div className="text-3xl font-bold text-emerald-600 mb-2">
                       {loading ? '...' : (realTimeProgress?.weeklyGoal || 30)}
                     </div>
                     <div className="text-emerald-800 font-medium">Weekly Goal (min)</div>
                   </div>
                   
                   <div className="text-center">
                     <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                       <Clock className="w-10 h-10 text-white" />
                     </div>
                     <div className="text-3xl font-bold text-blue-600 mb-2">
                       {loading ? '...' : Math.floor((realTimeProgress?.exercisesCompleted || 0) * 3)}
                     </div>
                     <div className="text-blue-800 font-medium">Completed (min)</div>
                   </div>
                   
                   <div className="text-center">
                     <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                       <TrendingUp className="w-10 h-10 text-white" />
                     </div>
                     <div className="text-3xl font-bold text-purple-600 mb-2">
                       {loading ? '...' : Math.round(((realTimeProgress?.exercisesCompleted || 0) * 3 / 30) * 100)}%
                     </div>
                     <div className="text-purple-800 font-medium">Goal Progress</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>

                      {/* Weekly Plan Section */}
           <div className="max-w-6xl mx-auto mb-16">
             <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
               <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                 <div className="text-center mb-8">
                   <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-4">
                     Your Weekly Plan
                   </h3>
                   <p className="text-lg text-slate-600">Structured exercises to maximize your progress</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                   {weeklyPlan.length > 0 ? (
                     weeklyPlan.map((day, index) => (
                       <div key={day.date} className="text-center">
                         <div className="text-lg font-semibold text-slate-700 mb-2">
                           {day.dayOfWeek.slice(0, 3)}
                         </div>
                         <div className={`rounded-2xl p-4 border min-h-[120px] flex flex-col items-center justify-center ${
                           day.isCompleted
                             ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50' 
                             : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/50'
                         }`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                             day.isCompleted
                               ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                               : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                           }`}>
                             {day.isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <Target className="w-4 h-4 text-white" />}
                           </div>
                           <div className={`text-xs font-medium ${
                             day.isCompleted ? 'text-green-700' : 'text-indigo-700'
                           }`}>
                             {day.completedExercises} / 1 Exercise
                           </div>
                           <div className={`text-xs ${
                             day.isCompleted ? 'text-green-600' : 'text-indigo-600'
                           }`}>
                             {day.completedMinutes} / {day.targetMinutes} min
                           </div>
                           <div className="text-xs text-slate-500 mt-1">
                             {day.recommendedType}
                           </div>
                         </div>
                       </div>
                     ))
                   ) : (
                     // No fallback - show empty state when no real data
                     <div className="col-span-7 text-center py-8">
                       <div className="text-slate-500">
                         <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                         <p className="text-lg">No weekly plan data available</p>
                         <p className="text-sm">Complete exercises to see your personalized weekly plan</p>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 <div className="text-center mt-6">
                   <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                     Customize Plan
                   </button>
                 </div>
               </div>
             </div>
           </div>

           {/* Today's Completed Modules */}
           {realTimeProgress?.todayProgress && (
             <div className="max-w-6xl mx-auto mb-16">
               <div className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                 <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                   <div className="text-center mb-8">
                     <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                       Today's Progress
                     </h3>
                     <p className="text-lg text-slate-600">
                       {realTimeProgress.todayProgress.date} - Keep up the great work!
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="text-center">
                       <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                         <CheckCircle className="w-8 h-8 text-white" />
                       </div>
                       <div className="text-3xl font-bold text-green-600 mb-2">
                         {realTimeProgress.todayProgress.exercisesCompleted}
                       </div>
                       <div className="text-green-800 font-medium">Modules Completed</div>
                     </div>
                     
                     <div className="text-center">
                       <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                         <Clock className="w-8 h-8 text-white" />
                       </div>
                       <div className="text-3xl font-bold text-blue-600 mb-2">
                         {realTimeProgress.todayProgress.totalMinutes}
                       </div>
                       <div className="text-blue-800 font-medium">Minutes Practiced</div>
                     </div>
                     
                     <div className="text-center">
                       <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                         <Star className="w-8 h-8 text-white" />
                       </div>
                       <div className="text-3xl font-bold text-purple-600 mb-2">
                         {realTimeProgress.todayProgress.averageScore}
                       </div>
                       <div className="text-purple-800 font-medium">Average Score</div>
                     </div>
                     
                     <div className="text-center">
                       <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                         <Zap className="w-8 h-8 text-white" />
                       </div>
                       <div className="text-3xl font-bold text-orange-600 mb-2">
                         {realTimeProgress.todayProgress.currentStreak}
                       </div>
                       <div className="text-orange-800 font-medium">Day Streak</div>
                     </div>
                   </div>
                   
                   {realTimeProgress.dailyProgress && Object.keys(realTimeProgress.dailyProgress).length > 0 && (
                     <div className="mt-8">
                       <h4 className="text-xl font-semibold text-slate-700 mb-4 text-center">Today's Exercise Types</h4>
                       <div className="flex flex-wrap justify-center gap-3">
                         {Object.values(realTimeProgress.dailyProgress).map((day, index) => 
                           day.exerciseTypes && day.exerciseTypes.map((type, typeIndex) => (
                             <span key={`${index}-${typeIndex}`} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium">
                               {type}
                             </span>
                           ))
                         )}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           )}

           {/* Exercise Categories Section */}
           <div className="max-w-7xl mx-auto mb-16">
             <div className="text-center mb-12">
               <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                 Exercise Categories
               </h3>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                 Choose exercises that match your skill level and interests
               </p>
             </div>

             {/* Filter Controls */}
             <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-slate-200/50">
               <div className="flex flex-wrap items-center justify-center gap-4">
                 {/* Difficulty Filter */}
                 <div className="flex items-center space-x-2">
                   <span className="text-slate-700 font-medium">Difficulty:</span>
                   <div className="flex space-x-2">
                     {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                       <button
                         key={level}
                         onClick={() => setSelectedDifficulty(level)}
                         className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                           selectedDifficulty === level
                             ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                             : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                         }`}
                       >
                         {level}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Exercise Type Filter */}
                 <div className="flex items-center space-x-2">
                   <span className="text-slate-700 font-medium">Type:</span>
                   <div className="flex space-x-2">
                     {['All', 'Pronunciation', 'Fluency', 'Articulation', 'Voice', 'Language', 'Breathing', 'Resonance', 'Projection', 'Expression', 'Confidence'].map((type) => (
                       <button
                         key={type}
                         onClick={() => setSelectedType(type)}
                         className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                           selectedType === type
                             ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                             : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                         }`}
                       >
                         {type}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             </div>

             {/* Exercise Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredExercises.map((exercise, index) => {
                 // Calculate exercise status directly (no hooks inside map)
                 const exerciseStatus = getExerciseStatus(exercise.id);
                 const isCompleted = exerciseStatus === 'completed';
                 const isInProgress = exerciseStatus === 'in-progress';
                 const isLocked = exerciseStatus === 'locked';
                 
                 return (
                   <div 
                     key={exercise.id}
                     className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border ${
                       isCompleted 
                         ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                         : isInProgress
                         ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
                         : 'bg-white border-slate-200/50'
                     }`}
                     style={{ animationDelay: `${index * 100}ms` }}
                   >
                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                       isCompleted 
                         ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5' 
                         : isInProgress
                         ? 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5'
                         : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5'
                     }`}></div>
                     
                     {/* Status Badge */}
                     <div className="absolute top-4 left-4 z-10">
                       {isCompleted && (
                         <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                           <CheckCircle className="w-5 h-5 text-white" />
                         </div>
                       )}
                       {isInProgress && (
                         <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                           <Clock className="w-5 h-5 text-white" />
                         </div>
                       )}
                       {isLocked && (
                         <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-lg">
                           <Lock className="w-5 h-5 text-white" />
                         </div>
                       )}
                     </div>
                     
                     {/* Difficulty Badge */}
                     <div className="absolute top-4 right-4 z-10">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                         exercise.difficulty === 'Beginner' ? 'bg-green-500' :
                         exercise.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                       }`}>
                         {exercise.difficulty}
                       </span>
                     </div>

                     <div className="relative p-6">
                       {/* Exercise Icon */}
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                         exercise.type === 'Pronunciation' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                         exercise.type === 'Fluency' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                         exercise.type === 'Articulation' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                         exercise.type === 'Voice' ? 'bg-gradient-to-br from-orange-500 to-red-500' :
                         'bg-gradient-to-br from-indigo-500 to-purple-500'
                       }`}>
                         <div className="text-white">
                           {exercise.icon}
                         </div>
                       </div>

                       {/* Exercise Content */}
                       <h4 className="text-xl font-bold text-slate-800 mb-3 text-center">{exercise.title}</h4>
                       <p className="text-slate-600 text-center mb-4 leading-relaxed">{exercise.description}</p>
                       
                       {/* Exercise Details */}
                       <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                         <span className="flex items-center space-x-1">
                           <Clock className="w-4 h-4" />
                           <span>{exercise.duration} min</span>
                         </span>
                         <span className="flex items-center space-x-1">
                           <Target className="w-4 h-4" />
                           <span>{exercise.type}</span>
                         </span>
                       </div>

                                               {/* Action Button */}
                        <button
                          onClick={() => isCompleted ? null : handleStartExercise(exercise)}
                          disabled={isCompleted}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                          }`}
                        >
                          {isCompleted ? 'Completed ✓' : 'Start Exercise'}
                        </button>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>

                      {/* Enhanced Quick Actions */}
           <div className="text-center mb-16">
             <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">
               Ready to Practice?
             </h3>
             <div className="flex flex-wrap justify-center gap-6">
              <button
                onClick={() => setCurrentPage('exercises')}
                 className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                 <span className="flex items-center space-x-2">
                   <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                   <span>Start Exercise</span>
                 </span>
              </button>
              <button
                onClick={() => setCurrentPage('progress')}
                 className="group bg-white text-slate-700 px-8 py-4 rounded-2xl font-semibold border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                 <span className="flex items-center space-x-2">
                   <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                   <span>View Progress</span>
                 </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
      )}
    </>
  );
}

export default Dashboard;
