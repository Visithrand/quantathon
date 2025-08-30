import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, RotateCcw, Trophy, Puzzle } from 'lucide-react';

const PhonemeBlendingGame = ({ userId, onGameComplete }) => {
  const [currentRound, setCurrentRound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [selectedPhonemes, setSelectedPhonemes] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const rounds = [
    {
      phonemes: ["c", "a", "t"],
      targetWord: "cat",
      soundDescription: "Listen carefully: C... A... T... Now blend them together: Cat",
      difficulty: 'beginner',
      points: 20,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["d", "o", "g"],
      targetWord: "dog",
      soundDescription: "Listen carefully: D... O... G... Now blend them together: Dog",
      difficulty: 'beginner',
      points: 20,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["h", "a", "t"],
      targetWord: "hat",
      soundDescription: "Listen carefully: H... A... T... Now blend them together: Hat",
      difficulty: 'beginner',
      points: 20,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["s", "u", "n"],
      targetWord: "sun",
      soundDescription: "Listen carefully: S... U... N... Now blend them together: Sun",
      difficulty: 'intermediate',
      points: 30,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["m", "o", "o", "n"],
      targetWord: "moon",
      soundDescription: "Listen carefully: M... OO... N... Now blend them together: Moon",
      difficulty: 'intermediate',
      points: 30,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["s", "t", "a", "r"],
      targetWord: "star",
      soundDescription: "Listen carefully: S... T... A... R... Now blend them together: Star",
      difficulty: 'intermediate',
      points: 30,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["b", "e", "a", "u", "t", "i", "f", "u", "l"],
      targetWord: "beautiful",
      soundDescription: "Listen carefully: B... E... A... U... T... I... F... U... L... Now blend them together: Beautiful",
      difficulty: 'advanced',
      points: 40,
      category: 'Phoneme Blending'
    },
    {
      phonemes: ["e", "x", "c", "i", "t", "i", "n", "g"],
      targetWord: "exciting",
      soundDescription: "Listen carefully: E... X... C... I... T... I... N... G... Now blend them together: Exciting",
      difficulty: 'advanced',
      points: 40,
      category: 'Phoneme Blending'
    }
  ];

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  // Scoring Formula: Base points + accuracy bonus + complexity bonus - attempt penalty
  const calculateScore = (basePoints, accuracy, phonemeCount, attempts) => {
    const accuracyBonus = Math.floor(accuracy * 0.4); // 40% of accuracy as bonus
    const complexityBonus = Math.floor(phonemeCount * 2); // 2 points per phoneme
    const attemptPenalty = (attempts - 1) * 3; // 3 point penalty per attempt after first
    
    return Math.max(0, basePoints + accuracyBonus + complexityBonus - attemptPenalty);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(rounds[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setSelectedPhonemes([]);
  };

  const playPhonemes = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentRound.soundDescription || 
        `Listen: ${currentRound.phonemes.join('... ')}... Now blend: ${currentRound.targetWord}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better phoneme clarity
      utterance.rate = 0.5; // Slower for clearer phoneme separation
      utterance.pitch = 1.0; // Normal pitch for clarity
      utterance.volume = 1.0;
      
      // Stop any previous speech
      window.speechSynthesis.cancel();
      
      // Speak the phonemes and blending instruction
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setFeedback('Audio playback not available. Please read the phonemes aloud.');
    }
    setIsPlaying(false);
  };

  const playPhoneme = (phoneme) => {
    const utterance = new SpeechSynthesisUtterance(phoneme);
    utterance.rate = 0.5;
    window.speechSynthesis.speak(utterance);
  };

  const selectPhoneme = (phoneme) => {
    if (selectedPhonemes.includes(phoneme)) {
      setSelectedPhonemes(prev => prev.filter(p => p !== phoneme));
    } else {
      setSelectedPhonemes(prev => [...prev, phoneme]);
    }
  };

  const startRecording = async () => {
    if (selectedPhonemes.length === 0) {
      setFeedback('Please select at least one phoneme first!');
      return;
    }

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
    const simulatedAccuracy = Math.random() * 100; // Replace with real analysis
    
    const roundScore = calculateScore(
      currentRound.points,
      simulatedAccuracy,
      currentRound.phonemes.length,
      attempts + 1
    );
    
    setScore(prev => prev + roundScore);
    
    if (simulatedAccuracy > 80) {
      setFeedback(`Excellent! Phoneme blending accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}`);
      setTimeout(() => nextRound(), 1500);
    } else if (simulatedAccuracy > 60) {
      setFeedback(`Good! Phoneme blending accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}. Try for better blending.`);
    } else {
      setFeedback(`Keep practicing! Phoneme blending accuracy: ${Math.round(simulatedAccuracy)}%. Score: +${roundScore}. Focus on smooth transitions.`);
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
      setSelectedPhonemes([]);
    } else {
      completeGame();
    }
  };

  const completeGame = async () => {
    setGameState('completed');
    
    const gameData = {
      userId,
      gameId: 'phoneme-blending',
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
    setSelectedPhonemes([]);
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Puzzle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Phoneme Blending</h2>
          <p className="text-gray-600 mb-6">Combine sounds to form complete words!</p>
          <button
            onClick={startGame}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
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
          <p className="text-3xl font-bold text-teal-600 mb-4">{score} Points</p>
          <p className="text-gray-600 mb-6">Amazing phoneme blending skills!</p>
          <div className="space-y-2">
            <button
              onClick={resetGame}
              className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors mr-2"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameComplete({ score, gameId: 'phoneme-blending' })}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Phoneme Blending</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Round {currentRoundIndex + 1}/{rounds.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-gray-800 mb-4">Target Word: "{currentRound.targetWord}"</div>
        <div className="text-sm text-gray-500 mb-4">{currentRound.soundDescription}</div>
        <div className="text-sm text-gray-500 mb-4">Difficulty: {currentRound.difficulty}</div>
        
        <div className="space-y-3 mb-6">
          <button
            onClick={playPhonemes}
            disabled={isPlaying}
            className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {isPlaying ? 'Playing...' : 'Listen to Phonemes'}
          </button>
        </div>

        {/* Phoneme Selection */}
        <div className="mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-3">Select Phonemes to Blend:</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {currentRound.phonemes.map((phoneme, index) => (
              <button
                key={index}
                onClick={() => selectPhoneme(phoneme)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedPhonemes.includes(phoneme)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-lg font-bold">{phoneme}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPhoneme(phoneme);
                  }}
                  className="text-xs text-gray-500 hover:text-blue-600"
                >
                  🔊
                </button>
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            Selected: {selectedPhonemes.join(' + ') || 'None'}
          </div>
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={selectedPhonemes.length === 0}
          className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : selectedPhonemes.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          <Mic className="w-5 h-5 mr-2" />
          {isRecording ? 'Stop Recording' : 'Record Your Blended Word'}
        </button>
      </div>

      {feedback && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <p className="text-teal-800 text-center">{feedback}</p>
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

export default PhonemeBlendingGame;
