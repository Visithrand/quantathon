import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, RotateCcw, Trophy, Target } from 'lucide-react';

const SoundMatchingGame = ({ userId, onGameComplete }) => {
  const [currentRound, setCurrentRound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [selectedOption, setSelectedOption] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const rounds = [
    {
      targetSound: "Ssssss",
      soundDescription: "A continuous hissing sound like a snake: Ssssss...",
      options: ["Snake", "Water", "Wind", "Whisper"],
      correctAnswer: "Snake",
      difficulty: 'beginner',
      points: 20,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Ch ch ch",
      soundDescription: "A choppy sound like a train: Ch ch ch...",
      options: ["Train", "Clock", "Footsteps", "Heartbeat"],
      correctAnswer: "Train",
      difficulty: 'beginner',
      points: 20,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Drip drop",
      soundDescription: "Water droplets falling: Drip... drop...",
      options: ["Rain", "Faucet", "Ocean", "Stream"],
      correctAnswer: "Rain",
      difficulty: 'intermediate',
      points: 30,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Buzz buzz",
      soundDescription: "A bee flying around: Buzz buzz...",
      options: ["Bee", "Fly", "Mosquito", "Wasp"],
      correctAnswer: "Bee",
      difficulty: 'intermediate',
      points: 30,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Thump thump",
      soundDescription: "A heartbeat sound: Thump... thump...",
      options: ["Heartbeat", "Drum", "Footsteps", "Knock"],
      correctAnswer: "Heartbeat",
      difficulty: 'advanced',
      points: 40,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Crackle crackle",
      soundDescription: "Fire burning: Crackle crackle...",
      options: ["Fire", "Paper", "Leaves", "Bubble wrap"],
      correctAnswer: "Fire",
      difficulty: 'intermediate',
      points: 30,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Splash splash",
      soundDescription: "Water splashing: Splash splash...",
      options: ["Water", "Mud", "Paint", "Oil"],
      correctAnswer: "Water",
      difficulty: 'beginner',
      points: 20,
      category: 'Sound Recognition'
    },
    {
      targetSound: "Rustle rustle",
      soundDescription: "Leaves moving in the wind: Rustle rustle...",
      options: ["Leaves", "Paper", "Fabric", "Branches"],
      correctAnswer: "Leaves",
      difficulty: 'intermediate',
      points: 30,
      category: 'Sound Recognition'
    }
  ];

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  // Scoring Formula: Base points + accuracy bonus + speed bonus - attempt penalty
  const calculateScore = (basePoints, accuracy, timeTaken, attempts) => {
    const accuracyBonus = Math.floor(accuracy * 0.5); // 50% of accuracy as bonus
    const speedBonus = Math.max(0, 10 - Math.floor(timeTaken / 1000)); // Up to 10 points for speed
    const attemptPenalty = (attempts - 1) * 3; // 3 point penalty per attempt after first
    
    return Math.max(0, basePoints + accuracyBonus + speedBonus - attemptPenalty);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(rounds[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setSelectedOption(null);
  };

  const playTargetSound = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentRound.soundDescription || currentRound.targetSound;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better sound simulation
      utterance.rate = 0.6; // Slower for clearer sound description
      utterance.pitch = 1.1; // Slightly higher pitch for engagement
      utterance.volume = 1.0;
      
      // Stop any previous speech
      window.speechSynthesis.cancel();
      
      // Speak the sound description
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setFeedback('Audio playback not available. Please read the sound description aloud.');
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
    
    // Simulate sound analysis (in real app, send to backend for analysis)
    const simulatedAccuracy = Math.random() * 100; // Replace with real analysis
    const timeTaken = Date.now() - Date.now(); // Calculate actual time
    
    const roundScore = calculateScore(
      currentRound.points,
      simulatedAccuracy,
      timeTaken,
      attempts + 1
    );
    
    setScore(prev => prev + roundScore);
    
    if (simulatedAccuracy > 80) {
      setFeedback(`Excellent! Sound accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}`);
      setTimeout(() => nextRound(), 1500);
    } else if (simulatedAccuracy > 60) {
      setFeedback(`Good! Sound accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}. Try for better pronunciation.`);
    } else {
      setFeedback(`Keep practicing! Sound accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}. Focus on the target sound.`);
    }
  };

  const nextRound = () => {
    const nextIndex = currentRoundIndex + 1;
    if (nextIndex < rounds.length) {
      setCurrentRoundIndex(nextIndex);
      setCurrentRound(rounds[nextIndex]);
      setGameProgress((nextIndex / rounds.length) * 100);
      setAttempts(0);
      setFeedback('');
      setSelectedOption(null);
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    setGameState('completed');
    
    const gameData = {
      userId,
      gameId: 'sound-matching',
      points: score,
      accuracy: Math.round((score / rounds.reduce((sum, r) => sum + r.points, 0)) * 100),
      attempts: attempts,
      timestamp: new Date().toISOString(),
      difficulty: 'mixed',
      roundsCompleted: rounds.length
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
    setCurrentRoundIndex(0);
    setScore(0);
    setAttempts(0);
    setGameProgress(0);
    setFeedback('');
    setSelectedOption(null);
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sound Matching</h2>
          <p className="text-gray-600 mb-6">Listen to sounds and match them to the correct pronunciation!</p>
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
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
          <p className="text-3xl font-bold text-green-600 mb-4">{score} Points</p>
          <p className="text-gray-600 mb-6">Excellent sound recognition skills!</p>
          <div className="space-y-2">
            <button
              onClick={resetGame}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors mr-2"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameComplete({ score, gameId: 'sound-matching' })}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sound Matching</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Round {currentRoundIndex + 1}/{rounds.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-800 mb-4">Target Sound: "{currentRound.targetSound}"</div>
        <div className="text-sm text-gray-500 mb-4">{currentRound.description}</div>
        <div className="text-sm text-gray-500 mb-4">Difficulty: {currentRound.difficulty}</div>
        
        <div className="space-y-3">
          <button
            onClick={playTargetSound}
            disabled={isPlaying}
            className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {isPlaying ? 'Playing...' : 'Listen to Sound'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'Stop Recording' : 'Record Your Sound'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-center">{feedback}</p>
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

export default SoundMatchingGame;
