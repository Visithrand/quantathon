import React from 'react';
import { CheckCircle, Star, Target, Clock, Zap } from 'lucide-react';

/**
 * ExerciseCard Component
 * Displays exercise information in a modern card format
 * 
 * @param {Object} exercise - Exercise data object
 * @param {Function} onSelect - Callback when exercise is selected
 * @param {boolean} isSelected - Whether this exercise is currently selected
 * @param {string} difficulty - Difficulty level filter
 * @param {string} category - Category filter
 */
function ExerciseCard({ exercise, onSelect, isSelected, difficulty, category }) {
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return '🌱';
      case 'intermediate':
        return '🚀';
      case 'advanced':
        return '⭐';
      default:
        return '📚';
    }
  };

  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'phoneme':
        return '🔤';
      case 'word':
        return '📝';
      case 'sentence':
        return '📖';
      case 'conversation':
        return '💬';
      case 'fluency':
        return '🌊';
      case 'emotion':
        return '😊';
      default:
        return '🎯';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-lg'
          : exercise.completed
          ? 'border-green-300 bg-green-50 hover:border-green-400'
          : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
      }`}
      onClick={() => onSelect(exercise)}
    >
      {/* Header with completion status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(exercise.exerciseType)}</span>
          <h4 className="font-semibold text-slate-800 text-lg">{exercise.name}</h4>
        </div>
        {exercise.completed && (
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
        )}
      </div>

      {/* Difficulty and Category Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(exercise.difficultyLevel)}`}>
          <span>{getDifficultyIcon(exercise.difficultyLevel)}</span>
          {exercise.difficultyLevel || 'Beginner'}
        </span>
        
        {exercise.exerciseType && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <span>{getCategoryIcon(exercise.exerciseType)}</span>
            {exercise.exerciseType}
          </span>
        )}
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        {exercise.instructions || 'Practice your speech with this exercise'}
      </p>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(exercise.sessionDuration)}</span>
        </div>
        
        {exercise.attemptsCount > 0 && (
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{exercise.attemptsCount} attempts</span>
          </div>
        )}
      </div>

      {/* Score Display */}
      {exercise.completed && exercise.overallScore && (
        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
          <Star className="h-4 w-4 text-yellow-500" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Score</span>
              <span className="text-lg font-bold text-slate-800">
                {exercise.overallScore}/100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
              <div 
                className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exercise.overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Percentage */}
      {exercise.progressPercentage !== undefined && (
        <div className="mt-3 text-center">
          <div className="text-xs text-slate-500 mb-1">Progress</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exercise.progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-600">{exercise.progressPercentage}%</span>
        </div>
      )}

      {/* Best Score */}
      {exercise.bestScore && exercise.bestScore > exercise.overallScore && (
        <div className="mt-3 text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs text-yellow-700 font-medium">🏆 Best Score</div>
          <div className="text-lg font-bold text-yellow-800">{exercise.bestScore}/100</div>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
