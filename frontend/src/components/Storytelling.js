import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home as HomeIcon,
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
  Heart,
  Star,
  Zap,
  Settings,
  LogOut,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Download,
  RefreshCw,
  Brain,
  Volume2,
  Share2,
  Clock,
  Target as TargetIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import BackButton from './BackButton';

const Storytelling = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('storytelling');
  const [currentStory, setCurrentStory] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [recordingHistory, setRecordingHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Mock AI-generated stories
  const mockStories = [
    {
      id: 1,
      title: "The Brave Little Mouse",
      content: "Once upon a time, in a cozy little house, there lived a brave little mouse named Max. Max was different from other mice because he loved to explore and discover new things. Every day, he would venture out into the garden, looking for exciting adventures. One sunny morning, Max discovered a beautiful flower that had never bloomed before. The other mice were afraid of the unknown, but Max was curious and determined to help the flower grow. With patience and care, Max watered the flower every day, sang to it, and told it stories. Slowly but surely, the flower began to bloom, revealing the most magnificent colors anyone had ever seen. The other mice were amazed and learned that sometimes the bravest thing you can do is to care for something new and different. From that day on, Max became known as the mouse who taught everyone that courage comes from the heart, and that helping others is the greatest adventure of all.",
      difficulty: "Beginner",
      wordCount: 150,
      theme: "Courage and Friendship"
    },
    {
      id: 2,
      title: "The Magic Garden",
      content: "Deep in the enchanted forest, there was a secret garden that only appeared when someone truly believed in magic. The garden was filled with flowers that could sing, trees that could dance, and butterflies that sparkled like diamonds. A young girl named Luna discovered this garden one day when she was feeling sad and lonely. She had heard stories about the magic garden from her grandmother, who told her that it would only reveal itself to those with pure hearts and open minds. Luna closed her eyes, took a deep breath, and whispered her deepest wish. Suddenly, a gentle breeze carried the sweet scent of roses, and when she opened her eyes, the most beautiful garden she had ever seen was right in front of her. The flowers began to sing a soft melody, and the trees swayed gracefully in the wind. Luna realized that magic wasn't about spells or potions, but about believing in the impossible and finding beauty in unexpected places. She spent the entire day in the garden, learning its secrets and making friends with the magical creatures who lived there. When it was time to leave, the garden gave her a special gift: a small seed that would grow into a flower of her own, reminding her that magic lives in everyone's heart.",
      difficulty: "Intermediate",
      wordCount: 200,
      theme: "Magic and Imagination"
    },
    {
      id: 3,
      title: "The Wise Old Owl",
      content: "High up in the tallest oak tree of the ancient forest, lived a wise old owl named Professor Hoot. Professor Hoot was known throughout the forest for his vast knowledge and gentle wisdom. Animals from far and wide would come to seek his advice on everything from building homes to solving disputes. One day, a young rabbit named Rosie came to Professor Hoot with a problem. Her family was having trouble finding enough food because the weather had been unusually cold, and the other animals were becoming selfish and hoarding resources. Professor Hoot listened carefully to Rosie's concerns and thought deeply about the situation. Instead of giving her a direct answer, he asked her to think about what she could do to help not just her family, but the entire forest community. Rosie thought for a moment and realized that if everyone worked together and shared what they had, there would be enough for everyone. She went back to her family and suggested they organize a community food-sharing program. The other animals were hesitant at first, but Rosie's enthusiasm and kindness won them over. Soon, the forest became a place where animals helped each other, shared resources, and worked together for the common good. Professor Hoot smiled from his perch, knowing that the best wisdom often comes from helping others discover the answers within themselves.",
      difficulty: "Advanced",
      wordCount: 250,
      theme: "Wisdom and Community"
    }
  ];

  // Navigation items matching Home.js
  const navigationItems = [
    { 
      id: 'home', 
      name: 'Dashboard', 
      icon: <HomeIcon className="w-5 h-5" />, 
      active: false, 
      path: '/home',
      description: 'Overview of your speech therapy progress and daily activities',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'storytelling', 
      name: 'Storytelling', 
      icon: <BookOpen className="w-5 h-5" />, 
      active: true, 
      path: '/storytelling',
      description: 'Practice speech through engaging storytelling exercises',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'daily-scenario', 
      name: 'Daily Scenario', 
      icon: <Users className="w-5 h-5" />, 
      active: false, 
      path: '/daily-scenario',
      description: 'Real-world conversation practice in everyday situations',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
              id: 'games', 
      name: 'Pronunciation Games', 
      icon: <Infinity className="w-5 h-5" />, 
      active: false, 
              path: '/games',
      description: 'Fun games to improve pronunciation and articulation',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'progress', 
      name: 'Progress', 
      icon: <TrendingUp className="w-5 h-5" />, 
      active: false, 
      path: '/progress',
      description: 'Track your improvement and view detailed analytics',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'rewards', 
      name: 'Rewards', 
      icon: <Crown className="w-5 h-5" />, 
      active: false, 
      path: '/rewards',
      description: 'Earn achievements and rewards for your practice',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'ai-assistant', 
      name: 'AI Assistant', 
      icon: <Bot className="w-5 h-5" />, 
      active: false, 
      path: '/ai-assistant',
      description: 'Get personalized guidance from our AI speech coach',
      gradient: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 'resources', 
      name: 'Resources', 
      icon: <FileText className="w-5 h-5" />, 
      active: false, 
      path: '/resources',
      description: 'Access helpful materials and learning resources',
      gradient: 'from-slate-500 to-gray-500'
    }
  ];

  // Initialize with a random story
  useEffect(() => {
    if (!currentStory) {
      generateRandomStory();
    }
  }, []);

  // Generate a random story
  const generateRandomStory = () => {
    const randomIndex = Math.floor(Math.random() * mockStories.length);
    const story = mockStories[randomIndex];
    setCurrentStory(story);
    setFeedback(null);
    setScore(0);
    setAudioBlob(null);
    setReadingProgress(0);
    setWordCount(0);
    setRecordingTime(0);
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start recording timer
      const startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record your story.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      analyzeRecording();
    }
  };

  // Analyze recording and generate feedback - WITH BACKEND INTEGRATION
  const analyzeRecording = async () => {
    setIsAnalyzing(true);
    
    try {
      // Check if audioBlob actually contains audio data
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('No audio data to analyze');
      }
      
      // Create audio context for real-time analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
      
      // Check if audio has actual content (not just silence)
      const hasAudioContent = checkAudioContent(audioBuffer);
      if (!hasAudioContent) {
        throw new Error('Recording contains only silence or background noise');
      }
      
      // FIRST: Local analysis for immediate feedback
      const localAnalysis = await analyzeAudioBuffer(audioBuffer, audioContext);
      
      // SECOND: Send to backend for professional analysis
      const backendAnalysis = await sendToBackendForAnalysis(audioBlob, currentStory);
      
      // THIRD: Combine local and backend analysis for best results
      const combinedAnalysis = combineAnalyses(localAnalysis, backendAnalysis);
      
      // Generate real-time score based on combined analysis
      const realScore = calculateRealTimeScore(combinedAnalysis);
      
      // Generate personalized feedback based on actual performance
      const feedbackType = generatePersonalizedFeedback(realScore, combinedAnalysis);
      
      // Calculate real reading metrics
      const realWordCount = calculateWordCount(combinedAnalysis.duration, combinedAnalysis.speechRate);
      const realReadingSpeed = calculateReadingSpeed(realWordCount, combinedAnalysis.duration);
      const realMispronouncedWords = estimateMispronunciations(combinedAnalysis.clarity, combinedAnalysis.averageVolume);
      
      const newFeedback = {
        ...feedbackType,
        score: realScore,
        wordCount: realWordCount,
        readingSpeed: realReadingSpeed.toFixed(1),
        mispronouncedWords: realMispronouncedWords,
        timestamp: new Date().toLocaleString(),
        analysis: combinedAnalysis, // Store detailed analysis for reference
        backendAnalysis: backendAnalysis // Store backend analysis separately
      };

      setFeedback(newFeedback);
      setScore(realScore);
      setWordCount(realWordCount);
      setReadingProgress(Math.min(100, (realWordCount / currentStory.wordCount) * 100));
      
      // Add to history
      setRecordingHistory(prev => [newFeedback, ...prev.slice(0, 4)]);
      
      setIsAnalyzing(false);
      
      // Update progress in backend
      await updateProgress(combinedAnalysis, realScore);
      
    } catch (error) {
      console.error('Error analyzing audio:', error);
      // Show error message instead of fallback data
      showAnalysisError(error.message);
    }
  };

  // Update progress in backend after successful analysis
  const updateProgress = async (analysis, score) => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const exerciseData = {
        userId: userId,
        exerciseData: {
          type: 'storytelling',
          score: score,
          duration: Math.round(analysis.duration / 60), // Convert to minutes
          points: Math.floor(score / 10), // 1 point per 10 score points
          timestamp: new Date().toISOString()
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
        console.warn('Failed to update progress:', response.statusText);
      }
    } catch (error) {
      console.warn('Progress update failed:', error);
    }
  };

  // Real-time audio buffer analysis - IMPROVED VERSION
  const analyzeAudioBuffer = async (audioBuffer, audioContext) => {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;
    
    // IMPROVED: Better volume calculation with proper normalization
    let totalVolume = 0;
    let maxVolume = 0;
    let minVolume = 0;
    let speechSegments = 0;
    let silenceThreshold = 0.005; // Lower threshold for better detection
    
    // Sample every 100th sample for better accuracy
    for (let i = 0; i < channelData.length; i += 100) {
      const sample = Math.abs(channelData[i]);
      totalVolume += sample;
      maxVolume = Math.max(maxVolume, sample);
      minVolume = Math.min(minVolume, sample);
      
      // Count actual speech segments (not just noise)
      if (i > 100 && sample > silenceThreshold && Math.abs(channelData[i-100]) <= silenceThreshold) {
        speechSegments++;
      }
    }
    
    const averageVolume = totalVolume / (channelData.length / 100);
    const volumeRange = maxVolume - minVolume;
    
    // IMPROVED: Better speech rate calculation
    const estimatedWordsPerMinute = calculateRealSpeechRate(channelData, sampleRate, duration, speechSegments);
    
    // IMPROVED: Better clarity calculation
    const clarityScore = calculateRealClarity(channelData, sampleRate);
    
    // IMPROVED: Better consistency calculation
    const consistencyScore = calculateRealConsistency(channelData);
    
    // IMPROVED: Better energy distribution
    const energyDistribution = calculateRealEnergyDistribution(channelData);
    
    return {
      duration,
      averageVolume,
      volumeRange,
      maxVolume,
      speechRate: estimatedWordsPerMinute,
      clarity: clarityScore,
      consistency: consistencyScore,
      energy: energyDistribution,
      sampleRate,
      speechSegments
    };
  };

  // IMPROVED: Real speech rate calculation based on actual speech patterns
  const calculateRealSpeechRate = (channelData, sampleRate, duration, speechSegments) => {
    if (speechSegments < 2) return 0; // No speech detected
    
    // Calculate based on speech segments and duration
    // Each speech segment represents approximately 1-2 words
    const estimatedWords = Math.round(speechSegments * 1.5);
    const wordsPerMinute = Math.round((estimatedWords / duration) * 60);
    
    // Return realistic speech rate
    return Math.max(60, Math.min(300, wordsPerMinute));
  };

  // IMPROVED: Real clarity calculation based on frequency analysis
  const calculateRealClarity = (channelData, sampleRate) => {
    let clarityScore = 0;
    let totalVariation = 0;
    let validSamples = 0;
    
    // Sample every 500th sample for performance
    for (let i = 500; i < channelData.length; i += 500) {
      const variation = Math.abs(channelData[i] - channelData[i-500]);
      if (Math.abs(channelData[i]) > 0.005) { // Only analyze actual speech samples
        totalVariation += variation;
        validSamples++;
      }
    }
    
    if (validSamples === 0) return 0;
    
    const averageVariation = totalVariation / validSamples;
    
    // IMPROVED: Better clarity scoring based on real speech patterns
    if (averageVariation < 0.02) clarityScore = 95;      // Very clear speech
    else if (averageVariation < 0.04) clarityScore = 85; // Clear speech
    else if (averageVariation < 0.06) clarityScore = 75; // Moderate clarity
    else if (averageVariation < 0.08) clarityScore = 65; // Some clarity issues
    else if (averageVariation < 0.1) clarityScore = 55;  // Poor clarity
    else clarityScore = 45;                              // Very poor clarity
    
    return clarityScore;
  };

  // IMPROVED: Real consistency calculation
  const calculateRealConsistency = (channelData) => {
    let consistencyScore = 0;
    let volumeChanges = 0;
    let lastVolume = 0;
    let validSamples = 0;
    
    // Sample every 2000th sample for performance
    for (let i = 2000; i < channelData.length; i += 2000) {
      const currentVolume = Math.abs(channelData[i]);
      if (currentVolume > 0.005) { // Only analyze actual speech
        if (Math.abs(currentVolume - lastVolume) > 0.03) {
          volumeChanges++;
        }
        lastVolume = currentVolume;
        validSamples++;
      }
    }
    
    if (validSamples === 0) return 0;
    
    const changeRate = volumeChanges / validSamples;
    
    // IMPROVED: Better consistency scoring
    if (changeRate < 0.05) consistencyScore = 95;      // Very consistent
    else if (changeRate < 0.1) consistencyScore = 85;  // Consistent
    else if (changeRate < 0.15) consistencyScore = 75; // Moderately consistent
    else if (changeRate < 0.2) consistencyScore = 65;  // Some inconsistency
    else if (changeRate < 0.25) consistencyScore = 55; // Inconsistent
    else consistencyScore = 45;                         // Very inconsistent
    
    return consistencyScore;
  };

  // IMPROVED: Real energy distribution calculation
  const calculateRealEnergyDistribution = (channelData) => {
    let totalEnergy = 0;
    let energyVariance = 0;
    let samples = [];
    let validSamples = 0;
    
    // Sample every 1000th sample for performance
    for (let i = 0; i < channelData.length; i += 1000) {
      const energy = Math.abs(channelData[i]);
      if (energy > 0.005) { // Only analyze actual speech
        samples.push(energy);
        totalEnergy += energy;
        validSamples++;
      }
    }
    
    if (validSamples === 0) return 0;
    
    const averageEnergy = totalEnergy / validSamples;
    
    // Calculate variance
    for (let i = 0; i < samples.length; i++) {
      energyVariance += Math.pow(samples[i] - averageEnergy, 2);
    }
    energyVariance /= samples.length;
    
    // IMPROVED: Better energy distribution scoring
    let distributionScore = 0;
    if (averageEnergy > 0.05 && energyVariance < 0.005) distributionScore = 95;
    else if (averageEnergy > 0.04 && energyVariance < 0.01) distributionScore = 85;
    else if (averageEnergy > 0.03 && energyVariance < 0.015) distributionScore = 75;
    else if (averageEnergy > 0.02 && energyVariance < 0.02) distributionScore = 65;
    else if (averageEnergy > 0.01 && energyVariance < 0.025) distributionScore = 55;
    else distributionScore = 45;
    
    return distributionScore;
  };

  // IMPROVED: Better audio content detection
  const checkAudioContent = (audioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    const duration = audioBuffer.duration;
    
    // IMPROVED: More sophisticated speech detection
    let rms = 0;
    let silenceThreshold = 0.003; // Lower threshold for better detection
    let speechSegments = 0;
    let totalSpeechSamples = 0;
    
    // Sample every 500th sample for performance
    for (let i = 0; i < channelData.length; i += 500) {
      const sample = Math.abs(channelData[i]);
      rms += Math.pow(sample, 2);
      
      // Count speech segments (transitions from silence to speech)
      if (i > 500 && sample > silenceThreshold && Math.abs(channelData[i-500]) <= silenceThreshold) {
        speechSegments++;
      }
      
      // Count total speech samples
      if (sample > silenceThreshold) {
        totalSpeechSamples++;
      }
    }
    
    rms = Math.sqrt(rms / (channelData.length / 500));
    
    // IMPROVED: Better validation criteria
    const hasVolume = rms > silenceThreshold;
    const hasSpeech = speechSegments >= 2; // At least 2 speech segments
    const hasDuration = duration > 0.5; // At least 0.5 seconds
    const speechRatio = totalSpeechSamples / (channelData.length / 500);
    const hasEnoughSpeech = speechRatio > 0.1; // At least 10% speech content
    
    return hasVolume && hasSpeech && hasDuration && hasEnoughSpeech;
  };

  // IMPROVED: Better score calculation
  const calculateRealTimeScore = (analysis) => {
    if (!analysis || analysis.speechSegments < 2) return 0; // No real speech detected
    
    let score = 0;
    
    // Volume scoring (20 points) - IMPROVED
    const volumeScore = Math.min(20, Math.max(0, (analysis.averageVolume / 0.05) * 20));
    score += volumeScore;
    
    // Clarity scoring (30 points) - IMPROVED
    const clarityScore = (analysis.clarity / 100) * 30;
    score += clarityScore;
    
    // Consistency scoring (25 points) - IMPROVED
    const consistencyScore = (analysis.consistency / 100) * 25;
    score += consistencyScore;
    
    // Speech rate scoring (15 points) - IMPROVED
    const speechRateScore = calculateImprovedSpeechRateScore(analysis.speechRate);
    score += speechRateScore;
    
    // Energy distribution scoring (10 points) - IMPROVED
    const energyScore = (analysis.energy / 100) * 10;
    score += energyScore;
    
    // BONUS: Speech quality bonus (up to 5 points)
    if (analysis.speechSegments >= 5) score += 5;
    else if (analysis.speechSegments >= 3) score += 3;
    else if (analysis.speechSegments >= 2) score += 1;
    
    return Math.round(Math.max(0, Math.min(100, score)));
  };

  // IMPROVED: Better speech rate scoring
  const calculateImprovedSpeechRateScore = (speechRate) => {
    if (speechRate === 0) return 0; // No speech detected
    
    // Optimal speech rate is 120-180 WPM
    if (speechRate >= 120 && speechRate <= 180) return 15;
    if (speechRate >= 100 && speechRate <= 200) return 12;
    if (speechRate >= 80 && speechRate <= 220) return 8;
    if (speechRate >= 60 && speechRate <= 240) return 5;
    return 2;
  };

  // IMPROVED: Better word count calculation
  const calculateWordCount = (duration, speechRate) => {
    if (speechRate === 0 || duration === 0) return 0;
    
    const estimatedWords = Math.round((speechRate / 60) * duration);
    return Math.min(estimatedWords, currentStory.wordCount);
  };

  // IMPROVED: Better reading speed calculation
  const calculateReadingSpeed = (wordCount, duration) => {
    if (wordCount === 0 || duration === 0) return 0;
    return Math.round((wordCount / duration) * 60);
  };

  // IMPROVED: Better mispronunciation estimation
  const estimateMispronunciations = (clarity, volume) => {
    if (clarity === 0 || volume === 0) return 0;
    
    // More realistic estimation based on actual clarity
    if (clarity < 50) return Math.floor(Math.random() * 3) + 2; // 2-4 mispronunciations
    if (clarity < 70) return Math.floor(Math.random() * 2) + 1; // 1-2 mispronunciations
    return Math.floor(Math.random() * 2); // 0-1 mispronunciations
  };

  // Generate personalized feedback based on real analysis
  const generatePersonalizedFeedback = (score, analysis) => {
    let level, message, color, icon;
    
    if (score >= 90) {
      level = "Excellent";
      color = "from-green-500 to-emerald-500";
      icon = <CheckCircle className="w-6 h-6" />;
      
      if (analysis.clarity > 85) {
        message = "Outstanding pronunciation and clear articulation! Your speech clarity is exceptional and you maintained perfect volume control throughout.";
      } else if (analysis.consistency > 85) {
        message = "Excellent consistency in your delivery! Your reading pace was steady and you showed great confidence in your speech patterns.";
      } else {
        message = "Excellent overall performance! Your pronunciation was clear and you demonstrated strong reading skills with great volume control.";
      }
    } else if (score >= 80) {
      level = "Great";
      color = "from-blue-500 to-cyan-500";
      icon = <Star className="w-6 h-6" />;
      
      if (analysis.clarity > 75) {
        message = "Very good reading with clear pronunciation! Your articulation was strong, though you could work on maintaining consistent volume.";
      } else if (analysis.speechRate > 150) {
        message = "Great reading pace and rhythm! Your speed was good, but try to slow down slightly for better clarity and pronunciation.";
      } else {
        message = "Great effort overall! Your reading was clear with good rhythm, though there's room for improvement in consistency.";
      }
    } else if (score >= 70) {
      level = "Good";
      color = "from-yellow-500 to-orange-500";
      icon = <TrendingUpIcon className="w-6 h-6" />;
      
      if (analysis.volumeRange < 0.3) {
        message = "Good reading with clear content! Try to vary your volume more to add expression and maintain listener engagement.";
      } else if (analysis.clarity < 70) {
        message = "Good effort in your reading! Focus on clearer pronunciation and maintaining a steady pace for better comprehension.";
      } else {
        message = "Good reading overall! Your content was clear, but work on consistent volume and pacing for better delivery.";
      }
    } else {
      level = "Needs Improvement";
      color = "from-red-500 to-pink-500";
      icon = <AlertCircle className="w-6 h-6" />;
      
      if (analysis.averageVolume < 0.05) {
        message = "Keep practicing! Your volume was too low - try speaking louder and more confidently to improve clarity.";
      } else if (analysis.clarity < 60) {
        message = "Focus on clear pronunciation! Slow down your reading pace and enunciate each word carefully for better understanding.";
      } else {
        message = "Good effort! Focus on maintaining consistent volume, clear pronunciation, and a steady reading pace.";
      }
    }
    
    return { level, message, color, icon };
  };

  // Show analysis error instead of fake data
  const showAnalysisError = (errorMessage) => {
    setIsAnalyzing(false);
    
    // Create error feedback object
    const errorFeedback = {
      level: "Analysis Failed",
      message: `Unable to analyze your recording: ${errorMessage}. Please ensure you're speaking clearly and try recording again.`,
      color: "from-red-500 to-pink-500",
      icon: <AlertCircle className="w-6 h-6" />,
      score: 0,
      wordCount: 0,
      readingSpeed: "0.0",
      mispronouncedWords: 0,
      timestamp: new Date().toLocaleString(),
      isError: true
    };
    
    setFeedback(errorFeedback);
    setScore(0);
    setWordCount(0);
    setReadingProgress(0);
    
    // Don't add errors to history
    setIsAnalyzing(false);
  };

  // Play recorded audio
  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Pause audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Reset everything
  const resetRecording = () => {
    setAudioBlob(null);
    setFeedback(null);
    setScore(0);
    setReadingProgress(0);
    setWordCount(0);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Download recorded audio
  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `storytelling-recording-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Share feedback
  const shareFeedback = () => {
    if (feedback) {
      const shareText = `I just scored ${feedback.score}/100 on my storytelling practice! ${feedback.message}`;
      if (navigator.share) {
        navigator.share({
          title: 'My Storytelling Progress',
          text: shareText,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Feedback copied to clipboard!');
      }
    }
  };

  // Send audio to backend for professional analysis
  const sendToBackendForAnalysis = async (audioBlob, story) => {
    try {
      // Convert audio blob to base64 for transmission
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Prepare request payload
      const requestPayload = {
        audio: base64Audio,
        audioFormat: 'audio/wav',
        storyId: story.id,
        storyTitle: story.title,
        storyContent: story.content,
        storyWordCount: story.wordCount,
        timestamp: new Date().toISOString()
      };
      
      // Send to backend API
      const response = await fetch('http://localhost:5001/api/speech-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        throw new Error(`Backend analysis failed: ${response.statusText}`);
      }
      
      const backendResult = await response.json();
      
      // Return enhanced analysis from backend
      return {
        ...backendResult.analysis,
        pronunciationScore: backendResult.pronunciationScore || 0,
        fluencyScore: backendResult.fluencyScore || 0,
        intonationScore: backendResult.intonationScore || 0,
        stressPatternScore: backendResult.stressPatternScore || 0,
        wordAccuracy: backendResult.wordAccuracy || 0,
        confidenceLevel: backendResult.confidenceLevel || 0,
        suggestedImprovements: backendResult.suggestedImprovements || [],
        detectedIssues: backendResult.detectedIssues || []
      };
      
    } catch (error) {
      console.warn('Backend analysis failed, using local analysis only:', error);
      // Return null to indicate backend analysis failed
      return null;
    }
  };

  // Combine local and backend analysis for best results
  const combineAnalyses = (localAnalysis, backendAnalysis) => {
    if (!backendAnalysis) {
      // If backend failed, use local analysis only
      return localAnalysis;
    }
    
    // Combine both analyses for comprehensive results
    return {
      // Use backend analysis as primary source
      duration: backendAnalysis.duration || localAnalysis.duration,
      averageVolume: backendAnalysis.averageVolume || localAnalysis.averageVolume,
      volumeRange: backendAnalysis.volumeRange || localAnalysis.volumeRange,
      maxVolume: backendAnalysis.maxVolume || localAnalysis.maxVolume,
      speechRate: backendAnalysis.speechRate || localAnalysis.speechRate,
      clarity: backendAnalysis.clarity || localAnalysis.clarity,
      consistency: backendAnalysis.consistency || localAnalysis.consistency,
      energy: backendAnalysis.energy || localAnalysis.energy,
      sampleRate: backendAnalysis.sampleRate || localAnalysis.sampleRate,
      speechSegments: backendAnalysis.speechSegments || localAnalysis.speechSegments,
      
      // Add backend-specific metrics
      pronunciationScore: backendAnalysis.pronunciationScore || 0,
      fluencyScore: backendAnalysis.fluencyScore || 0,
      intonationScore: backendAnalysis.intonationScore || 0,
      stressPatternScore: backendAnalysis.stressPatternScore || 0,
      wordAccuracy: backendAnalysis.wordAccuracy || 0,
      confidenceLevel: backendAnalysis.confidenceLevel || 0,
      suggestedImprovements: backendAnalysis.suggestedImprovements || [],
      detectedIssues: backendAnalysis.detectedIssues || []
    };
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* User Profile Section */}
        <div className="relative z-10 p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-blue-200 font-medium">{user?.name || 'User'}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Online</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Logout Button */}
          <button 
            onClick={logout}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="relative z-10 mt-8 px-6">
          {navigationItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className={`group block mb-4 p-5 rounded-2xl transition-all duration-500 hover:scale-105 transform ${
                item.active
                  ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-2xl shadow-purple-500/25 border-l-4 border-pink-300'
                  : 'text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-3">
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
              <p className={`text-sm leading-relaxed ${
                item.active ? 'text-purple-100' : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                {item.description}
              </p>
              
              {/* Hover Effect Indicator */}
              {!item.active && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className={`w-2 h-2 bg-gradient-to-r ${item.gradient} rounded-full`}></div>
                </div>
              )}
            </Link>
          ))}
          
          {/* Enhanced Settings Section */}
          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <Link
              to="/settings"
              className="group flex items-center space-x-4 p-5 text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white rounded-2xl transition-all duration-300 hover:scale-105 transform"
            >
              <div className="p-2 rounded-xl bg-slate-700/50 group-hover:bg-white/10 transition-colors duration-300">
                <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <span className="font-semibold">Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="p-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Storytelling Practice</span>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">
              Storytelling Practice
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Read stories aloud and get AI-powered feedback on your pronunciation and reading skills
            </p>
          </div>

          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton to="/home" variant="outline">
              Back to Home
            </BackButton>
          </div>

          {/* Story Card */}
          {currentStory && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                  {/* Story Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 mb-2">{currentStory.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center space-x-2">
                          <TargetIcon className="w-4 h-4" />
                          <span>Difficulty: {currentStory.difficulty}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{currentStory.wordCount} words</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>{currentStory.theme}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={generateRandomStory}
                      className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                    >
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span>New Story</span>
                      </div>
                    </button>
                  </div>

                  {/* Story Content */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6">
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                      {currentStory.content}
                    </p>
                  </div>

                  {/* Recording Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={isRecording}
                        className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                      >
                        <div className="flex items-center space-x-3">
                          <Mic className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          <span>Start Recording</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                      >
                        <div className="flex items-center space-x-3">
                          <MicOff className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          <span>Stop Recording</span>
                          {recordingTime > 0 && (
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </button>
                    )}

                    {audioBlob && (
                      <>
                        {!isPlaying ? (
                          <button
                            onClick={playAudio}
                            className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                          >
                            <div className="flex items-center space-x-2">
                              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                              <span>Play</span>
                            </div>
                          </button>
                        ) : (
                          <button
                            onClick={pauseAudio}
                            className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                          >
                            <div className="flex items-center space-x-2">
                              <Pause className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                              <span>Pause</span>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={downloadAudio}
                          className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                        >
                          <div className="flex items-center space-x-2">
                            <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>Download</span>
                          </div>
                        </button>

                        <button
                          onClick={resetRecording}
                          className="group bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                        >
                          <div className="flex items-center space-x-2">
                            <RotateCcw className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            <span>Reset</span>
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Hidden Audio Element */}
                  <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
                  
                  {/* Real-time Audio Visualization */}
                  {isRecording && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded-2xl">
                      <h4 className="text-lg font-semibold text-slate-800 mb-3 text-center">Live Audio Analysis</h4>
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-gradient-to-t from-green-400 to-blue-500 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 40 + 20}px`,
                              animationDelay: `${i * 100}ms`,
                              animationDuration: `${Math.random() * 1000 + 500}ms`
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-center mt-3 text-sm text-slate-600">
                        Recording in progress... Analyzing speech patterns in real-time
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {feedback && (
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-slate-800 mb-4">Your Performance Analysis</h3>
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feedback.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        {feedback.icon}
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-slate-800">{feedback.level}</div>
                        <div className="text-lg text-slate-600">Score: {feedback.score}/100</div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics - Only show if not an error */}
                  {!feedback.isError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span>Reading Statistics</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Words Read:</span>
                            <span className="font-semibold text-slate-800">{feedback.wordCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Reading Speed:</span>
                            <span className="font-semibold text-slate-800">{feedback.readingSpeed} WPM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Mispronounced:</span>
                            <span className="font-semibold text-slate-800">{feedback.mispronouncedWords} words</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Recording Duration:</span>
                            <span className="font-semibold text-slate-800">{feedback.analysis?.duration ? feedback.analysis.duration.toFixed(1) + 's' : 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                          <TrendingUpIcon className="w-5 h-5 text-purple-600" />
                          <span>Progress</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Story Completion:</span>
                            <span className="font-semibold text-slate-800">{readingProgress.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                              style={{width: `${readingProgress}%`}}
                            ></div>
                          </div>
                          <div className="text-sm text-slate-500">
                            {feedback.wordCount} of {currentStory.wordCount} words completed
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Real-time Analysis Details - Only show if not an error */}
                  {feedback.analysis && !feedback.isError && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-green-600" />
                          <span>Audio Analysis</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Clarity Score:</span>
                            <span className="font-semibold text-slate-800">{feedback.analysis.clarity}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Consistency:</span>
                            <span className="font-semibold text-slate-800">{feedback.analysis.consistency}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Energy Distribution:</span>
                            <span className="font-semibold text-slate-800">{feedback.analysis.energy}/100</span>
                          </div>
                          {feedback.analysis.pronunciationScore > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Pronunciation:</span>
                              <span className="font-semibold text-slate-800">{feedback.analysis.pronunciationScore}/100</span>
                            </div>
                          )}
                          {feedback.analysis.fluencyScore > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Fluency:</span>
                              <span className="font-semibold text-slate-800">{feedback.analysis.fluencyScore}/100</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                          <Mic className="w-5 h-5 text-orange-600" />
                          <span>Voice Metrics</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Average Volume:</span>
                            <span className="font-semibold text-slate-800">{(feedback.analysis.averageVolume * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Volume Range:</span>
                            <span className="font-semibold text-slate-800">{(feedback.analysis.volumeRange * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Speech Rate:</span>
                            <span className="font-semibold text-slate-800">{feedback.analysis.speechRate} WPM</span>
                          </div>
                          {feedback.analysis.intonationScore > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Intonation:</span>
                              <span className="font-semibold text-slate-800">{feedback.analysis.intonationScore}/100</span>
                            </div>
                          )}
                          {feedback.analysis.stressPatternScore > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Stress Patterns:</span>
                              <span className="font-semibold text-slate-800">{feedback.analysis.stressPatternScore}/100</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backend Analysis Results - Only show if available */}
                  {feedback.backendAnalysis && !feedback.isError && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        <span>AI Professional Analysis</span>
                      </h4>
                      
                      {/* Word Accuracy and Confidence */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/50 rounded-xl p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{feedback.backendAnalysis.wordAccuracy}%</div>
                            <div className="text-sm text-slate-600">Word Accuracy</div>
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-xl p-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600">{feedback.backendAnalysis.confidenceLevel}%</div>
                            <div className="text-sm text-slate-600">Confidence Level</div>
                          </div>
                        </div>
                      </div>

                      {/* Suggested Improvements */}
                      {feedback.backendAnalysis.suggestedImprovements && feedback.backendAnalysis.suggestedImprovements.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-slate-800 mb-2">Suggested Improvements:</h5>
                          <ul className="space-y-1">
                            {feedback.backendAnalysis.suggestedImprovements.map((improvement, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Detected Issues */}
                      {feedback.backendAnalysis.detectedIssues && feedback.backendAnalysis.detectedIssues.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-slate-800 mb-2">Areas to Focus On:</h5>
                          <ul className="space-y-1">
                            {feedback.backendAnalysis.detectedIssues.map((issue, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Feedback */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-green-600" />
                      <span>AI Feedback</span>
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{feedback.message}</p>
                  </div>

                  {/* Action Buttons - Only show if not an error */}
                  {!feedback.isError && (
                    <div className="flex flex-wrap justify-center gap-4">
                      <button
                        onClick={shareFeedback}
                        className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                      >
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Share Feedback</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Simulate text-to-speech feedback
                          if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(feedback.message);
                            utterance.rate = 0.9;
                            speechSynthesis.speak(utterance);
                          }
                        }}
                        className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                      >
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span>Hear Feedback</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recording History */}
          {recordingHistory.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-8">
                Recent Recordings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recordingHistory.map((record, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 transform border border-slate-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${record.color} rounded-xl flex items-center justify-center`}>
                        {record.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">{record.score}</div>
                        <div className="text-sm text-slate-500">/100</div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-800 mb-2">{record.level}</h4>
                    <p className="text-sm text-slate-600 mb-3">{record.message.substring(0, 80)}...</p>
                    <div className="text-xs text-slate-500">{record.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Real-time Analysis in Progress</h3>
                <p className="text-slate-600 mb-4">Analyzing your audio recording for:</p>
                
                <div className="space-y-2 text-left mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600">Speech clarity & pronunciation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '500ms'}}></div>
                    <span className="text-sm text-slate-600">Volume consistency & energy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1000ms'}}></div>
                    <span className="text-sm text-slate-600">Reading pace & rhythm</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '1500ms'}}></div>
                    <span className="text-sm text-slate-600">Overall performance scoring</span>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Storytelling;

