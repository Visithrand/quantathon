import React from 'react';
import { 
  Home, 
  Target, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Trophy, 
  TrendingUp,
  Calendar,
  Award,
  Brain,
  Heart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../config/api';

/**
 * Sidebar Component
 * Navigation sidebar with user profile and quick stats
 * 
 * @param {Object} stats - User statistics and progress data
 * @param {Function} onLogout - Logout callback function
 */
function Sidebar({ stats = {}, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', color: 'text-blue-600' },
    { name: 'Exercises', icon: Target, path: '/exercises', color: 'text-purple-600' },
    { name: 'Speech Analysis', icon: Brain, path: '/speech-analysis', color: 'text-teal-600' },
    { name: 'Progress', icon: TrendingUp, path: '/progress', color: 'text-green-600' },
    { name: 'Profile', icon: User, path: '/profile', color: 'text-orange-600' },
    { name: 'Settings', icon: Settings, path: '/settings', color: 'text-gray-600' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout?.();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getCurrentStreak = () => {
    return stats.streakDays || 0;
  };

  const getStreakBadge = (streak) => {
    if (streak >= 30) return { icon: '🏆', label: 'Master', color: 'text-yellow-600' };
    if (streak >= 21) return { icon: '⭐', label: 'Expert', color: 'text-purple-600' };
    if (streak >= 14) return { icon: '🚀', label: 'Advanced', color: 'text-blue-600' };
    if (streak >= 7) return { icon: '🔥', label: 'Intermediate', color: 'text-green-600' };
    if (streak >= 3) return { icon: '🌱', label: 'Beginner', color: 'text-teal-600' };
    return { icon: '🎯', label: 'New', color: 'text-gray-600' };
  };

  const getLevelBadge = (score) => {
    if (score >= 90) return { icon: '👑', label: 'Elite', color: 'text-yellow-600' };
    if (score >= 80) return { icon: '💎', label: 'Master', color: 'text-purple-600' };
    if (score >= 70) return { icon: '🌟', label: 'Advanced', color: 'text-blue-600' };
    if (score >= 60) return { icon: '✨', label: 'Intermediate', color: 'text-green-600' };
    return { icon: '🎯', label: 'Beginner', color: 'text-teal-600' };
  };

  const streakBadge = getStreakBadge(getCurrentStreak());
  const levelBadge = getLevelBadge(stats.averageScore || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 h-fit">
      {/* User Profile Section */}
      <div className="text-center mb-6 pb-6 border-b border-slate-200">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          {currentUser?.name || 'Speech Learner'}
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          {currentUser?.email || 'learner@speechtherapy.com'}
        </p>
        
        {/* Level Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
          <span className="text-lg">{levelBadge.icon}</span>
          <span className={`text-sm font-medium ${levelBadge.color}`}>
            {levelBadge.label}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Current Streak</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">{getCurrentStreak()}</div>
            <div className="text-xs text-slate-500">days</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Exercises</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{stats.totalExercises || 0}</div>
            <div className="text-xs text-slate-500">completed</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Avg Score</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {Math.round(stats.averageScore || 0)}%
            </div>
            <div className="text-xs text-slate-500">overall</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-slate-700">This Week</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600">{stats.weeklyProgress || 0}</div>
            <div className="text-xs text-slate-500">sessions</div>
          </div>
        </div>
      </div>

      {/* Streak Achievement */}
      {getCurrentStreak() > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{streakBadge.icon}</span>
            <div>
              <div className="text-sm font-medium text-yellow-800">
                {streakBadge.label} Streak
              </div>
              <div className="text-xs text-yellow-600">
                {getCurrentStreak()} consecutive days
              </div>
            </div>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((getCurrentStreak() / 30) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : item.color}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Logout</span>
      </button>

      {/* Motivational Quote */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-800">Daily Motivation</span>
        </div>
        <p className="text-xs text-indigo-700 leading-relaxed">
          "Every word you practice brings you closer to clear, confident communication."
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
