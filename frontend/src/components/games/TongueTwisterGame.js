import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, RotateCcw, Trophy, Wind } from 'lucide-react';

const TongueTwisterGame = ({ userId, onGameComplete }) => {
  const [currentTwister, setCurrentTwister] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [accuracy, setAccuracy] = useState(0);
  const [speed, setSpeed] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const tongueTwisters = [
    {
      text: "Peter Piper picked a peck of pickled peppers.",
      soundDescription: "Peter Piper picked a peck of pickled peppers.",
      difficulty: 'beginner',
      points: 20,
      category: 'Tongue Twister'
    },
    {
      text: "She sells seashells by the seashore.",
      soundDescription: "She sells seashells by the seashore.",
      difficulty: 'beginner',
      points: 20,
      category: 'Tongue Twister'
    },
    {
      text: "How much wood would a woodchuck chuck?",
      soundDescription: "How much wood would a woodchuck chuck?",
      difficulty: 'intermediate',
      points: 30,
      category: 'Tongue Twister'
    },
    {
      text: "A proper copper coffee pot.",
      soundDescription: "A proper copper coffee pot.",
      difficulty: 'intermediate',
      points: 30,
      category: 'Tongue Twister'
    },
    {
      text: "The sixth sick sheik's sixth sheep's sick.",
      soundDescription: "The sixth sick sheik's sixth sheep's sick.",
      difficulty: 'advanced',
      points: 40,
      category: 'Tongue Twister'
    },
    {
      text: "Betty Botter bought some butter.",
      soundDescription: "Betty Botter bought some butter.",
      difficulty: 'intermediate',
      points: 30,
      category: 'Tongue Twister'
    },
    {
      text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
      soundDescription: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
      difficulty: 'beginner',
      points: 20,
      category: 'Tongue Twister'
    },
    {
      text: "I scream, you scream, we all scream for ice cream.",
      soundDescription: "I scream, you scream, we all scream for ice cream.",
      difficulty: 'intermediate',
      points: 30,
      category: 'Tongue Twister'
    }
  ];

  const [currentTwisterIndex, setCurrentTwisterIndex] = useState(0);

  // Scoring Formula: Base points + accuracy bonus + speed bonus + difficulty multiplier - attempt penalty
  const calculateScore = (basePoints, accuracy, speed, targetSpeed, difficulty, attempts) => {
    const accuracyBonus = Math.floor(accuracy * 0.4); // 40% of accuracy as bonus
    const speedBonus = Math.max(0, 15 - Math.floor((speed - targetSpeed) * 2)); // Speed bonus
    const difficultyMultiplier = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 1.2 : 1.5;
    const attemptPenalty = (attempts - 1) * 3; // 3 point penalty per attempt after first
    
    const finalScore = Math.max(0, (basePoints + accuracyBonus + speedBonus) * difficultyMultiplier - attemptPenalty);
    return Math.round(finalScore);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentTwister(tongueTwisters[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setAccuracy(0);
    setSpeed(0);
  };

  const playTwister = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentTwister.soundDescription || 
        `Listen carefully: ${currentTwister.text}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better tongue twister clarity
      utterance.rate = 0.6; // Slower for clearer pronunciation
      utterance.pitch = 1.1; // Slightly higher pitch for engagement
      utterance.volume = 1.0;
      
      // Stop any previous speech
      window.speechSynthesis.cancel();
      
      // Speak the tongue twister with instruction
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setFeedback('Audio playback not available. Please read the tongue twister aloud.');
    }
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const endTime = Date.now();
        const timeTaken = (endTime - startTimeRef.current) / 1000; // in seconds
        setSpeed(timeTaken);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processRecording(audioBlob, timeTaken);
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

  const processRecording = async (audioBlob, timeTaken) => {
    setAttempts(prev => prev + 1);
    
    // Simulate pronunciation analysis (in real app, send to backend for analysis)
    const simulatedAccuracy = Math.random() * 100; // Replace with real analysis
    setAccuracy(simulatedAccuracy);
    
    const twisterScore = calculateScore(
      currentTwister.points,
      simulatedAccuracy,
      timeTaken,
      currentTwister.targetSpeed,
      currentTwister.difficulty,
      attempts + 1
    );
    
    setScore(prev => prev + twisterScore);
    
    if (simulatedAccuracy > 75 && timeTaken <= currentTwister.targetSpeed * 1.5) {
      setFeedback(`Excellent! Accuracy: ${Math.round(simulatedAccuracy)}%, Speed: ${timeTaken.toFixed(1)}s. Score: +${twisterScore}`);
      setTimeout(() => nextTwister(), 1500);
    } else if (simulatedAccuracy > 60) {
      setFeedback(`Good! Accuracy: ${Math.round(simulatedAccuracy)}%, Speed: ${timeTaken.toFixed(1)}s. Score: +${twisterScore}. Try for better accuracy and speed.`);
    } else {
      setFeedback(`Keep practicing! Accuracy: ${Math.round(simulatedAccuracy)}%, Speed: ${timeTaken.toFixed(1)}s. Score: +${twisterScore}. Focus on clarity and pace.`);
    }
  };

  const nextTwister = () => {
    const nextIndex = currentTwisterIndex + 1;
    if (nextIndex < tongueTwisters.length) {
      setCurrentTwisterIndex(nextIndex);
      setCurrentTwister(tongueTwisters[nextIndex]);
      setGameProgress((nextIndex / tongueTwisters.length) * 100);
      setAttempts(0);
      setFeedback('');
      setAccuracy(0);
      setSpeed(0);
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    setGameState('completed');
    
    const gameData = {
      userId,
      gameId: 'tongue-twister',
      points: score,
      accuracy: Math.round((score / tongueTwisters.reduce((sum, t) => sum + t.points, 0)) * 100),
      attempts: attempts,
      averageSpeed: speed,
      timestamp: new Date().toISOString(),
      difficulty: 'mixed',
      twistersCompleted: tongueTwisters.length
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
    setCurrentTwisterIndex(0);
    setScore(0);
    setAttempts(0);
    setGameProgress(0);
    setFeedback('');
    setAccuracy(0);
    setSpeed(0);
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Wind className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tongue Twister Challenge</h2>
          <p className="text-gray-600 mb-6">Master difficult phrases with increasing complexity and speed!</p>
          <button
            onClick={startGame}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
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
          <p className="text-3xl font-bold text-purple-600 mb-4">{score} Points</p>
          <p className="text-gray-600 mb-6">Amazing tongue twister skills!</p>
          <div className="space-y-2">
            <button
              onClick={resetGame}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors mr-2"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameComplete({ score, gameId: 'tongue-twister' })}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tongue Twister</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Twister {currentTwisterIndex + 1}/{tongueTwisters.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-lg font-medium text-gray-800 mb-4 p-4 bg-gray-50 rounded-lg leading-relaxed">
          "{currentTwister.text}"
        </div>
        <div className="flex justify-center space-x-4 mb-4 text-sm">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            currentTwister.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            currentTwister.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentTwister.difficulty}
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {currentTwister.category}
          </span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
            Target: {currentTwister.targetSpeed}s
          </span>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={playTwister}
            disabled={isPlaying}
            className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {isPlaying ? 'Playing...' : 'Listen to Twister'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'Stop Recording' : 'Record Your Twister'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="text-purple-800 text-center">{feedback}</p>
        </div>
      )}

      {(accuracy > 0 || speed > 0) && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">Accuracy</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(accuracy)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">Speed</div>
              <div className="text-2xl font-bold text-purple-600">{speed.toFixed(1)}s</div>
              <div className="text-sm text-gray-600">
                Target: {currentTwister.targetSpeed}s
              </div>
            </div>
          </div>
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

export default TongueTwisterGame;
