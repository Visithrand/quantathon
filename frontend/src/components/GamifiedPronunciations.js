import React, { useState, useEffect } from 'react';
import { Trophy, Gamepad2, BarChart3, Home, TrendingUp, Award, Calendar, Target } from 'lucide-react';
import gameService from '../services/gameService';
import WordRepetitionGame from './games/WordRepetitionGame';
import TongueTwisterGame from './games/TongueTwisterGame';
import FillInBlankGame from './games/FillInBlankGame';
import SoundMatchingGame from './games/SoundMatchingGame';
import AudioQuizGame from './games/AudioQuizGame';
import TimedPronunciationGame from './games/TimedPronunciationGame';
import PhonemeBlendingGame from './games/PhonemeBlendingGame';
import BackButton from './BackButton';

const GamifiedPronunciations = ({ userId }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([]);
  const [userStats, setUserStats] = useState({
    gamesPlayed: 0,
    totalPoints: 0,
    averageAccuracy: 0,
    bestGame: null
  });

  const games = [
    {
      id: 'word-repetition',
      name: 'Word Repetition Challenge',
      description: 'Practice pronunciation by repeating words with audio feedback',
      difficulty: 'Beginner',
      icon: '🎯',
      component: WordRepetitionGame
    },
    {
      id: 'tongue-twister',
      name: 'Tongue Twister Challenge',
      description: 'Master difficult phrases with increasing complexity',
      difficulty: 'Intermediate',
      icon: '🌀',
      component: TongueTwisterGame
    },
    {
      id: 'fill-in-blank',
      name: 'Fill-in-the-Blank',
      description: 'Complete sentences by pronouncing missing words',
      difficulty: 'Mixed',
      icon: '📝',
      component: FillInBlankGame
    },
    {
      id: 'sound-matching',
      name: 'Sound Matching',
      description: 'Listen and match sounds to correct pronunciations',
      difficulty: 'Beginner',
      icon: '🎵',
      component: SoundMatchingGame
    },
    {
      id: 'audio-quiz',
      name: 'Audio Quiz',
      description: 'Answer questions based on audio clips',
      difficulty: 'Intermediate',
      icon: '🧠',
      component: AudioQuizGame
    },
    {
      id: 'timed-pronunciation',
      name: 'Timed Challenge',
      description: 'Race against time to pronounce words correctly',
      difficulty: 'Advanced',
      icon: '⏱️',
      component: TimedPronunciationGame
    },
    {
      id: 'phoneme-blending',
      name: 'Phoneme Blending',
      description: 'Combine sounds to form complete words',
      difficulty: 'Advanced',
      icon: '🔤',
      component: PhonemeBlendingGame
    }
  ];

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    if (!userId) return;
    
    try {
      const stats = await gameService.getUserStats(userId);
      setUserStats(stats);
      setTotalScore(stats.totalPoints || 0);
    } catch (error) {
      console.error('Failed to load user stats:', error);
      // Set default stats if backend is not available
      setUserStats({
        gamesPlayed: 0,
        totalPoints: 0,
        averageAccuracy: 0,
        bestGame: null,
        weeklyProgress: [],
        recentScores: []
      });
    }
  };

  const handleGameComplete = async (gameData) => {
    const newGameRecord = {
      ...gameData,
      completedAt: new Date().toISOString()
    };

    setGameHistory(prev => [newGameRecord, ...prev]);
    setTotalScore(prev => prev + gameData.points);

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalPoints: prev.totalPoints + gameData.points,
      averageAccuracy: ((prev.averageAccuracy * prev.gamesPlayed + gameData.accuracy) / (prev.gamesPlayed + 1)),
      bestGame: !prev.bestGame || gameData.points > prev.bestGame.points ? gameData : prev.bestGame
    }));

    // Send score to backend
    try {
      await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
    } catch (error) {
      console.error('Failed to send score:', error);
    }
  };

  const selectGame = (gameId) => {
    setSelectedGame(gameId);
  };

  const goBackToGames = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game.component;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goBackToGames}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Games
              </button>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              {game.icon} {game.name}
            </h1>
            <p className="text-gray-600 text-center mb-4">{game.description}</p>
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                game.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {game.difficulty}
              </span>
            </div>
          </div>
          
          <GameComponent 
            userId={userId} 
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Back Button */}
          <div className="mb-4">
            <BackButton to="/home" variant="outline">
              Back to Home
            </BackButton>
          </div>
          
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Gamified Pronunciations</h1>
            <p className="text-xl text-gray-600">Master pronunciation through interactive games!</p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalScore}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.gamesPlayed || 0}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{Math.round(userStats.averageAccuracy || 0)}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.bestGame?.points || 0}</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
          </div>
          
          {/* Enhanced Progress Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Progress Overview
            </h3>
            
            {/* Weekly Progress Chart */}
            {userStats.weeklyProgress && userStats.weeklyProgress.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Weekly Progress</h4>
                <div className="flex items-end justify-between h-24">
                  {userStats.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t-lg transition-all duration-300"
                        style={{ 
                          height: `${(day.points / Math.max(...userStats.weeklyProgress.map(d => d.points))) * 100}%`,
                          minHeight: '20px'
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                      <span className="text-xs font-semibold text-blue-600">{day.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Scores */}
            {userStats.recentScores && userStats.recentScores.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Recent Scores
                </h4>
                <div className="space-y-2">
                  {userStats.recentScores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium text-gray-800">{score.gameName || score.gameId}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Accuracy: {score.accuracy || 0}%</span>
                        <span className="font-semibold text-green-600">+{score.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => selectGame(game.id)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    game.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {game.difficulty}
                  </span>
                  <Gamepad2 className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Games */}
        {gameHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Recent Games
            </h2>
            <div className="space-y-3">
              {gameHistory.slice(0, 5).map((game, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{game.gameId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(game.completedAt).toLocaleDateString()} at {new Date(game.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">+{game.points}</div>
                    <div className="text-sm text-gray-600">{game.accuracy}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamifiedPronunciations;
