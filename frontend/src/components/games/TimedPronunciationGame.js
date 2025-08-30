import React, { useState, useEffect, useRef } from 'react';
import { Mic, Clock, Play, RotateCcw, Trophy, Zap } from 'lucide-react';

const TimedPronunciationGame = ({ userId, onGameComplete }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeStarted, setTimeStarted] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const rounds = [
    {
      targetWord: "butterfly",
      soundDescription: "Butterfly",
      timeLimit: 5000,
      difficulty: 'beginner',
      points: 20,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "elephant",
      soundDescription: "Elephant",
      timeLimit: 6000,
      difficulty: 'beginner',
      points: 20,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "beautiful",
      soundDescription: "Beautiful",
      timeLimit: 7000,
      difficulty: 'intermediate',
      points: 30,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "adventure",
      soundDescription: "Adventure",
      timeLimit: 8000,
      difficulty: 'intermediate',
      points: 30,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "extraordinary",
      soundDescription: "Extraordinary",
      timeLimit: 10000,
      difficulty: 'advanced',
      points: 40,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "responsibility",
      soundDescription: "Responsibility",
      timeLimit: 12000,
      difficulty: 'advanced',
      points: 40,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "communication",
      soundDescription: "Communication",
      timeLimit: 9000,
      difficulty: 'intermediate',
      points: 30,
      category: 'Timed Pronunciation'
    },
    {
      targetWord: "imagination",
      soundDescription: "Imagination",
      timeLimit: 8000,
      difficulty: 'intermediate',
      points: 30,
      category: 'Timed Pronunciation'
    }
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Scoring Formula: Base points + time bonus + accuracy bonus - attempt penalty
  const calculateScore = (basePoints, timeLeft, accuracy, attempts) => {
    const timeBonus = Math.floor((timeLeft / 1000) * 2); // 2 points per second remaining
    const accuracyBonus = Math.floor(accuracy * 0.4); // 40% of accuracy as bonus
    const attemptPenalty = (attempts - 1) * 3; // 3 point penalty per attempt after first
    
    return Math.max(0, basePoints + timeBonus + accuracyBonus - attemptPenalty);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            // Time's up!
            handleTimeUp();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setCurrentWord(rounds[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setTimeLeft(rounds[0].timeLimit);
    setTimeStarted(Date.now());
  };

  const handleTimeUp = () => {
    setFeedback('Time\'s up! Try to pronounce faster next time.');
    setAttempts(prev => prev + 1);
  };

  const playTargetWord = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentRound.soundDescription || 
        `Listen carefully: ${currentRound.targetWord}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better pronunciation clarity
      utterance.rate = 0.6; // Slower for clearer pronunciation
      utterance.pitch = 1.1; // Slightly higher pitch for engagement
      utterance.volume = 1.0;
      
      // Stop any previous speech
      window.speechSynthesis.cancel();
      
      // Speak the target word with instruction
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setFeedback('Audio playback not available. Please read the target word aloud.');
    }
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processRecording(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed:', error);
      setFeedback('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async (audioBlob) => {
    setAttempts(prev => prev + 1);
    
    // Simulate pronunciation analysis (in real app, send to backend for analysis)
    const accuracy = Math.random() * 100; // Replace with real analysis
    
    const wordScore = calculateScore(
      currentWord.points,
      timeLeft,
      accuracy,
      attempts + 1
    );
    
    setScore(prev => prev + wordScore);
    
    if (accuracy > 75) {
      setFeedback(`Excellent! Accuracy: ${Math.round(accuracy)}%, Time bonus: +${Math.floor((timeLeft / 1000) * 2)}. Score: +${wordScore}`);
      setTimeout(() => nextWord(), 1500);
    } else if (accuracy > 50) {
      setFeedback(`Good! Accuracy: ${Math.round(accuracy)}%, Time bonus: +${Math.floor((timeLeft / 1000) * 2)}. Score: +${wordScore}. Try for better accuracy.`);
    } else {
      setFeedback(`Keep practicing! Accuracy: ${Math.round(accuracy)}%, Time bonus: +${Math.floor((timeLeft / 1000) * 2)}. Score: +${wordScore}. Focus on pronunciation.`);
    }
  };

  const nextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < rounds.length) {
      setCurrentWordIndex(nextIndex);
      setCurrentWord(rounds[nextIndex]);
      setGameProgress((nextIndex / rounds.length) * 100);
      setAttempts(0);
      setFeedback('');
      setTimeLeft(rounds[nextIndex].timeLimit);
      setTimeStarted(Date.now());
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    setGameState('completed');
    
    const gameData = {
      userId,
      gameId: 'timed-pronunciation',
      points: score,
      accuracy: Math.round((score / rounds.reduce((sum, w) => sum + w.points, 0)) * 100),
      attempts: attempts,
      totalTime: Date.now() - (timeStarted || Date.now()),
      timestamp: new Date().toISOString(),
      difficulty: 'mixed',
      wordsCompleted: rounds.length
    };

    try {
      await sendScoreToBackend(gameData);
      onGameComplete(gameData);
    } catch (error) {
      console.error('Failed to send score:', error);
    }
  };

  const sendScoreToBackend = async (gameData) => {
    const response = await fetch('/api/games/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send score');
    }
    
    return response.json();
  };

  const resetGame = () => {
    setGameState('ready');
    setCurrentWordIndex(0);
    setScore(0);
    setAttempts(0);
    setGameProgress(0);
    setFeedback('');
    setTimeLeft(0);
    setTimeStarted(null);
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.ceil(milliseconds / 1000);
    return `${seconds}s`;
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Zap className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Timed Pronunciation Challenge</h2>
          <p className="text-gray-600 mb-6">Race against time to pronounce words correctly!</p>
          <button
            onClick={startGame}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Game Complete!</h2>
          <p className="text-3xl font-bold text-red-600 mb-4">{score} Points</p>
          <p className="text-gray-600 mb-6">Amazing speed and accuracy!</p>
          <div className="space-y-2">
            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mr-2"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameComplete({ score, gameId: 'timed-pronunciation' })}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Timed Challenge</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Word {currentWordIndex + 1}/{rounds.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-red-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-600 mb-4">Time Remaining</div>
        
        <div className="text-3xl font-bold text-gray-800 mb-4">{currentWord.targetWord}</div>
        <div className="text-sm text-gray-500 mb-4">Difficulty: {currentWord.difficulty}</div>
        
        <div className="space-y-3">
          <button
            onClick={playTargetWord}
            disabled={isPlaying}
            className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Play className="w-5 h-5 mr-2" />
            {isPlaying ? 'Playing...' : 'Listen to Word'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'Stop Recording' : 'Record Your Pronunciation'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-center">{feedback}</p>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={resetGame}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4 inline mr-2" />
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default TimedPronunciationGame;
