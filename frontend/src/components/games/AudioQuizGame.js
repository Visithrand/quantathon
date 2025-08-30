import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Play, RotateCcw, Trophy, HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import gameService from '../../services/gameService';

const AudioQuizGame = ({ userId, onGameComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameProgress, setGameProgress] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState('ready');
  const [accuracy, setAccuracy] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  const questions = [
    {
      question: "What animal makes this sound?",
      soundToSpeak: "Woof woof!",
      soundDescription: "Woof woof!",
      options: ["Dog", "Cat", "Bird", "Cow"],
      correctAnswer: "Dog",
      difficulty: 'beginner',
      points: 20,
      category: 'Animal Sounds'
    },
    {
      question: "Which word rhymes with 'cat'?",
      soundToSpeak: "Cat. Bat.",
      soundDescription: "Cat... Bat...",
      options: ["Bat", "Dog", "Hat", "Run"],
      correctAnswer: "Bat",
      difficulty: 'beginner',
      points: 20,
      category: 'Rhyming'
    },
    {
      question: "What emotion does this voice express?",
      soundToSpeak: "Ha ha ha!",
      soundDescription: "Ha ha ha!",
      options: ["Happy", "Sad", "Angry", "Surprised"],
      correctAnswer: "Happy",
      difficulty: 'intermediate',
      points: 30,
      category: 'Emotion Recognition'
    },
    {
      question: "Which syllable is stressed in this word?",
      soundToSpeak: "Beautiful.",
      soundDescription: "Beautiful",
      options: ["Beau-", "-ti-", "-ful", "Equal stress"],
      correctAnswer: "Beau-",
      difficulty: 'intermediate',
      points: 30,
      category: 'Word Stress'
    },
    {
      question: "What type of consonant sound is this?",
      soundToSpeak: "Ffffff.",
      soundDescription: "Ffffff...",
      options: ["Fricative", "Plosive", "Nasal", "Liquid"],
      correctAnswer: "Fricative",
      difficulty: 'advanced',
      points: 40,
      category: 'Phonetics'
    },
    {
      question: "What animal makes this sound?",
      soundToSpeak: "Meow meow!",
      soundDescription: "Meow meow!",
      options: ["Cat", "Dog", "Bird", "Mouse"],
      correctAnswer: "Cat",
      difficulty: 'beginner',
      points: 20,
      category: 'Animal Sounds'
    },
    {
      question: "Which word rhymes with 'run'?",
      soundToSpeak: "Run. Fun.",
      soundDescription: "Run... Fun...",
      options: ["Fun", "Walk", "Jump", "Stop"],
      correctAnswer: "Fun",
      difficulty: 'beginner',
      points: 20,
      category: 'Rhyming'
    },
    {
      question: "What emotion does this voice express?",
      soundToSpeak: "Boo hoo...",
      soundDescription: "Boo hoo...",
      options: ["Sad", "Happy", "Angry", "Surprised"],
      correctAnswer: "Sad",
      difficulty: 'intermediate',
      points: 30,
      category: 'Emotion Recognition'
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Scoring Formula: Base points + accuracy bonus + speed bonus - attempt penalty
  const calculateScore = (basePoints, accuracy, timeTaken, attempts, isCorrect) => {
    if (!isCorrect) return 0; // No points for incorrect answers

    const accuracyBonus = Math.floor(accuracy * 0.5); // 50% of accuracy as bonus
    const speedBonus = Math.max(0, 10 - Math.floor(timeTaken / 1000)); // Up to 10 points for speed
    const attemptPenalty = (attempts - 1) * 2; // 2 point penalty per attempt after first
    
    return Math.max(0, basePoints + accuracyBonus + speedBonus - attemptPenalty);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(questions[0]);
    setGameProgress(0);
    setScore(0);
    setAttempts(0);
    setAccuracy(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSuggestions([]);
  };

  const playAudio = async () => {
    setIsPlaying(true);
    try {
      // Use the sound description for better audio experience
      const textToSpeak = currentQuestion.soundDescription || currentQuestion.soundToSpeak || currentQuestion.question;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Adjust speech parameters for better sound simulation
      utterance.rate = 0.7; // Slower for clearer pronunciation
      utterance.pitch = 1.2; // Slightly higher pitch for engagement
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
      setFeedback('Audio playback not available. Please read the question aloud.');
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
      startTimeRef.current = Date.now();
      setIsRecording(true);
      setFeedback('Recording...');
    } catch (error) {
      console.error('Recording failed:', error);
      setFeedback('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob) => {
    setAttempts(prev => prev + 1);
    const timeTaken = Date.now() - startTimeRef.current;

    try {
      // Use real analysis service instead of mock data
      const analysis = await gameService.analyzePronunciation(
        audioBlob, 
        currentQuestion.correctAnswer, // Analyze pronunciation of the correct answer
        'audio-quiz'
      );
      
      setAccuracy(analysis.accuracy);
      setFeedback(analysis.feedback);
      
      if (analysis.suggestions && analysis.suggestions.length > 0) {
        setSuggestions(analysis.suggestions);
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to basic feedback
      const fallbackAccuracy = 70 + Math.random() * 20;
      setAccuracy(fallbackAccuracy);
      setFeedback(`Good attempt! Keep practicing.`);
    }
  };

  const checkAnswer = (option) => {
    setSelectedOption(option);
    setIsAnswered(true);
    const isCorrect = option === currentQuestion.correctAnswer;
    const timeTaken = Date.now() - startTimeRef.current; // Time from recording start to answer selection

    const questionScore = calculateScore(
      currentQuestion.points,
      accuracy, // Use the pronunciation accuracy from recording
      timeTaken,
      attempts,
      isCorrect
    );

    if (isCorrect) {
      setScore(prev => prev + questionScore);
      setFeedback(`Correct! You earned ${questionScore} points.`);
      setTimeout(() => nextQuestion(), 2000);
    } else {
      setFeedback(`Incorrect. The correct answer was "${currentQuestion.correctAnswer}". Try again or move to the next question.`);
    }
  };

  const nextQuestion = () => {
    setSuggestions([]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[currentQuestionIndex + 1]);
      setGameProgress(Math.round(((currentQuestionIndex + 1) / questions.length) * 100));
      setAttempts(0);
      setAccuracy(0);
      setFeedback('');
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameState('finished');
    const gameData = {
      userId: userId,
      gameId: 'audio-quiz',
      points: score,
      accuracy: Math.round(score / questions.length), // Simple average for now
      attempts: attempts,
      roundsCompleted: questions.length,
      difficulty: currentQuestion.difficulty,
      timestamp: new Date().toISOString()
    };
    
    try {
      await gameService.submitScore(gameData);
      onGameComplete(gameData);
    } catch (error) {
      console.error('Failed to submit score:', error);
      // Optionally, store locally or retry
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setScore(0);
    setAttempts(0);
    setGameProgress(0);
    setFeedback('');
    setGameState('ready');
    setAccuracy(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSuggestions([]);
  };

  useEffect(() => {
    if (gameState === 'playing' && currentQuestion) {
      // Optionally play the question audio automatically when it changes
      // playAudio(); 
    }
  }, [currentQuestion, gameState]);

  if (gameState === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
        <Trophy className="w-24 h-24 text-purple-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Audio Quiz</h2>
        <p className="text-gray-600 text-center mb-6">
          Listen to sounds, voices, and words, then answer questions by selecting the correct option.
          You can also record your answer for pronunciation feedback.
        </p>
        <button
          onClick={startGame}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg">
        <Trophy className="w-24 h-24 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Complete!</h2>
        <p className="text-gray-600 text-center text-xl mb-4">Your final score: <span className="font-bold text-purple-600">{score} points</span></p>
        <p className="text-gray-600 text-center mb-6">Great job on the Audio Quiz!</p>
        <div className="flex space-x-4">
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => onGameComplete({ gameId: 'audio-quiz', points: score })}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Question {currentQuestionIndex + 1} / {questions.length}</h3>
        <div className="text-lg font-semibold text-purple-600">Score: {score}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${gameProgress}%` }}></div>
      </div>

      <div className="text-center mb-6">
        <p className="text-2xl font-semibold text-gray-700 mb-4">{currentQuestion.question}</p>
        <button
          onClick={playAudio}
          disabled={isPlaying || isRecording}
          className={`p-4 rounded-full ${isPlaying ? 'bg-purple-300' : 'bg-purple-500'} text-white shadow-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {currentQuestion.category === 'Animal Sounds' ? 'Listen to the animal sound' : 
           currentQuestion.category === 'Rhyming' ? 'Listen to the rhyming words' :
           currentQuestion.category === 'Emotion Recognition' ? 'Listen to the voice emotion' :
           currentQuestion.category === 'Word Stress' ? 'Listen to the word stress' :
           currentQuestion.category === 'Phonetics' ? 'Listen to the phonetic sound' :
           'Listen to the audio'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => checkAnswer(option)}
            disabled={isAnswered}
            className={`p-4 rounded-lg border-2 text-lg font-medium transition-colors
              ${isAnswered && option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50 text-green-800' : ''}
              ${isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50 text-red-800' : ''}
              ${!isAnswered ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50' : ''}
              ${selectedOption === option && !isAnswered ? 'border-purple-500 bg-purple-50' : ''}
              ${isAnswered && option !== selectedOption && option !== currentQuestion.correctAnswer ? 'opacity-70' : ''}
            `}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isPlaying || isAnswered}
          className={`p-4 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Mic className="w-8 h-8" />
        </button>
        <p className="text-sm text-gray-500 mt-2">{isRecording ? 'Recording your answer...' : 'Record your pronunciation'}</p>
      </div>

      {feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-center mb-3">{feedback}</p>
          
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Suggestions for improvement:</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Next button for manual progression */}
          {isAnswered && selectedOption !== currentQuestion.correctAnswer && (
            <button
              onClick={nextQuestion}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center mx-auto"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue to Next Question
            </button>
          )}
        </div>
      )}

      {accuracy > 0 && (
        <div className="text-center text-gray-700 mt-4">
          <p className="text-lg font-semibold">Pronunciation Accuracy: <span className="text-green-600">{Math.round(accuracy)}%</span></p>
        </div>
      )}
    </div>
  );
};

export default AudioQuizGame;
