import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, RotateCcw, Trophy, HelpCircle } from 'lucide-react';

const FillInBlankGame = ({ userId, onGameComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [hintUsed, setHintUsed] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sentences = [
    {
      sentence: "The ___ is bright in the sky.",
      missingWord: "sun",
      soundDescription: "Listen: The ___ is bright in the sky. The missing word is 'sun'.",
      options: ["sun", "moon", "star", "cloud"],
      difficulty: 'beginner',
      points: 20,
      category: 'Fill in the Blank'
    },
    {
      sentence: "I love to ___ in the park.",
      missingWord: "play",
      soundDescription: "Listen: I love to ___ in the park. The missing word is 'play'.",
      options: ["play", "work", "sleep", "eat"],
      difficulty: 'beginner',
      points: 20,
      category: 'Fill in the Blank'
    },
    {
      sentence: "The ___ is running fast.",
      missingWord: "dog",
      soundDescription: "Listen: The ___ is running fast. The missing word is 'dog'.",
      options: ["dog", "cat", "bird", "fish"],
      difficulty: 'beginner',
      points: 20,
      category: 'Fill in the Blank'
    },
    {
      sentence: "She has a beautiful ___ voice.",
      missingWord: "singing",
      soundDescription: "Listen: She has a beautiful ___ voice. The missing word is 'singing'.",
      options: ["singing", "speaking", "laughing", "crying"],
      difficulty: 'intermediate',
      points: 30,
      category: 'Fill in the Blank'
    },
    {
      sentence: "The ___ is shining through the window.",
      missingWord: "light",
      soundDescription: "Listen: The ___ is shining through the window. The missing word is 'light'.",
      options: ["light", "dark", "wind", "rain"],
      difficulty: 'intermediate',
      points: 30,
      category: 'Fill in the Blank'
    },
    {
      sentence: "He is a very ___ person.",
      missingWord: "friendly",
      soundDescription: "Listen: He is a very ___ person. The missing word is 'friendly'.",
      options: ["friendly", "angry", "sad", "tired"],
      difficulty: 'intermediate',
      points: 30,
      category: 'Fill in the Blank'
    },
    {
      sentence: "The ___ is a fascinating subject to study.",
      missingWord: "universe",
      soundDescription: "Listen: The ___ is a fascinating subject to study. The missing word is 'universe'.",
      options: ["universe", "ocean", "mountain", "forest"],
      difficulty: 'advanced',
      points: 40,
      category: 'Fill in the Blank'
    },
    {
      sentence: "She showed great ___ in solving the problem.",
      missingWord: "intelligence",
      soundDescription: "Listen: She showed great ___ in solving the problem. The missing word is 'intelligence'.",
      options: ["intelligence", "patience", "courage", "kindness"],
      difficulty: 'advanced',
      points: 40,
      category: 'Fill in the Blank'
    }
  ];

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  // Scoring Formula: Base points + accuracy bonus + context bonus - hint penalty - attempt penalty
  const calculateScore = (basePoints, accuracy, contextMatch, hintUsed, attempts) => {
    const accuracyBonus = Math.floor(accuracy * 0.4); // 40% of accuracy as bonus
    const contextBonus = contextMatch ? 10 : 0; // 10 points for context match
    const hintPenalty = hintUsed ? 5 : 0; // 5 point penalty for using hint
    const attemptPenalty = (attempts - 1) * 2; // 2 point penalty per attempt after first
    
    return Math.max(0, basePoints + accuracyBonus + contextBonus - hintPenalty - attemptPenalty);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentSentence(sentences[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setHintUsed(false);
  };

  const playSentence = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentSentence.soundDescription || 
        `Listen: ${currentSentence.sentence.replace('___', 'blank')}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better sentence clarity
      utterance.rate = 0.7; // Slower for clearer sentence structure
      utterance.pitch = 1.0; // Normal pitch for clarity
      utterance.volume = 1.0;
      
      // Stop any previous speech
      window.speechSynthesis.cancel();
      
      // Speak the sentence with instruction
      window.speechSynthesis.speak(utterance);
      
      // Wait for speech to complete
      await new Promise((resolve) => {
        utterance.onend = resolve;
        utterance.onerror = resolve;
      });
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      setFeedback('Audio playback not available. Please read the sentence aloud.');
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
    const contextMatch = Math.random() > 0.3; // 70% chance of context match
    
    const sentenceScore = calculateScore(
      currentSentence.points,
      accuracy,
      contextMatch,
      hintUsed,
      attempts + 1
    );
    
    setScore(prev => prev + sentenceScore);
    
    if (accuracy > 75 && contextMatch) {
      setFeedback(`Perfect! Accuracy: ${Math.round(accuracy)}%, Context: ✓. Score: +${sentenceScore}`);
      setTimeout(() => nextSentence(), 1500);
    } else if (accuracy > 60) {
      setFeedback(`Good! Accuracy: ${Math.round(accuracy)}%, Context: ${contextMatch ? '✓' : '✗'}. Score: +${sentenceScore}. Try for better accuracy.`);
    } else {
      setFeedback(`Keep practicing! Accuracy: ${Math.round(accuracy)}%, Context: ${contextMatch ? '✓' : '✗'}. Score: +${sentenceScore}. Focus on pronunciation.`);
    }
  };

  const nextSentence = () => {
    const nextIndex = currentSentenceIndex + 1;
    if (nextIndex < sentences.length) {
      setCurrentSentenceIndex(nextIndex);
      setCurrentSentence(sentences[nextIndex]);
      setGameProgress((nextIndex / sentences.length) * 100);
      setAttempts(0);
      setFeedback('');
      setHintUsed(false);
    } else {
      completeGame();
    }
  };

  const useHint = () => {
    setHintUsed(true);
    setFeedback(`Hint: ${currentSentence.hint}`);
  };

  const completeGame = async () => {
    setGameState('completed');
    
    const gameData = {
      userId,
      gameId: 'fill-in-blank',
      points: score,
      accuracy: Math.round((score / sentences.reduce((sum, s) => sum + s.points, 0)) * 100),
      attempts: attempts,
      hintsUsed: hintUsed ? 1 : 0,
      timestamp: new Date().toISOString(),
      difficulty: 'mixed',
      sentencesCompleted: sentences.length
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
    setCurrentSentenceIndex(0);
    setScore(0);
    setAttempts(0);
    setGameProgress(0);
    setFeedback('');
    setHintUsed(false);
  };

  if (gameState === 'ready') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <HelpCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Fill-in-the-Blank</h2>
          <p className="text-gray-600 mb-6">Complete sentences by pronouncing the missing words correctly!</p>
          <button
            onClick={startGame}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
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
          <p className="text-3xl font-bold text-orange-600 mb-4">{score} Points</p>
          <p className="text-gray-600 mb-6">Great job completing the sentences!</p>
          <div className="space-y-2">
            <button
              onClick={resetGame}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mr-2"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameComplete({ score, gameId: 'fill-in-blank' })}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Fill in the Blank</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Score: {score}</span>
          <span className="text-sm text-gray-600">Sentence {currentSentenceIndex + 1}/{sentences.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${gameProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-lg font-medium text-gray-800 mb-4 p-4 bg-gray-50 rounded-lg">
          {currentSentence.sentence}
        </div>
        <div className="text-sm text-gray-500 mb-4">Difficulty: {currentSentence.difficulty}</div>
        
        <div className="space-y-3">
          <button
            onClick={playSentence}
            disabled={isPlaying}
            className="flex items-center justify-center w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            {isPlaying ? 'Playing...' : 'Listen to Sentence'}
          </button>
          
          <button
            onClick={useHint}
            disabled={hintUsed}
            className="flex items-center justify-center w-full bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            {hintUsed ? 'Hint Used' : 'Get Hint'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isRecording ? 'Stop Recording' : 'Pronounce Missing Word'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <p className="text-orange-800 text-center">{feedback}</p>
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

export default FillInBlankGame;
