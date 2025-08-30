import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Calendar, 
  BarChart3, 
  Activity,
  Award,
  Zap,
  Clock,
  Star,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Mic,
  Users,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import BackButton from './BackButton';

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeStats, setRealTimeStats] = useState({
    currentSession: 0,
    todayExercises: 0,
    weeklyGoalProgress: 0
  });

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Fetch user progress from backend
  useEffect(() => {
    fetchUserProgress();
  }, []);

  // Real-time progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateRealTimeStats();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [progress]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const userId = user?.id || 'default_user';
      const response = await fetch(`http://localhost:5001/api/progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }

      const data = await response.json();
      setProgress(data.progress);
      updateRealTimeStats(data.progress);
    } catch (err) {
      setError(err.message);
      // Initialize with default progress if fetch fails
      setProgress({
        totalPoints: 0,
        exercisesCompleted: 0,
        streakDays: 0,
        averageScore: 0,
        weeklyGoal: 30,
        dailyProgress: {},
        exerciseHistory: [],
        achievements: [],
        weeklyProgress: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRealTimeStats = (currentProgress = progress) => {
    if (!currentProgress) return;

    const today = new Date().toISOString().split('T')[0];
    const todayData = currentProgress.dailyProgress[today] || { minutes: 0, exercises: 0 };
    
    setRealTimeStats({
      currentSession: todayData.minutes,
      todayExercises: todayData.exercises,
      weeklyGoalProgress: Math.min(100, (todayData.minutes / currentProgress.weeklyGoal) * 100)
    });
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-blue-500 to-cyan-500';
    if (percentage >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getAchievementIcon = (achievement) => {
    switch (achievement) {
      case 'First Steps': return '🎯';
      case 'Week Champion': return '🔥';
      case 'Dedicated Learner': return '📚';
      case 'Sound Master': return '🎪';
      default: return '🏆';
    }
  };

  const getAchievementColor = (achievement) => {
    switch (achievement) {
      case 'First Steps': return 'from-yellow-500 to-orange-500';
      case 'Week Champion': return 'from-green-500 to-emerald-500';
      case 'Dedicated Learner': return 'from-blue-500 to-cyan-500';
      case 'Sound Master': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-slate-600">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !progress) {
    return (
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Progress</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <button 
              onClick={fetchUserProgress}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="p-12">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Enhanced Welcome Section */}
        <div className="text-center mb-16 relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg">
            <TrendingUp className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Real-Time Progress Tracking</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Your Progress Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Track your speech therapy journey with real-time analytics and personalized insights
          </p>
      </div>

        {/* Real-Time Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {progress?.totalPoints || 0}
              </div>
              <div className="text-lg font-semibold text-slate-800 mb-2">Total Points</div>
              <div className="text-sm text-slate-500">+{realTimeStats.todayExercises * 10} this week</div>
            </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {progress?.exercisesCompleted || 0}
              </div>
              <div className="text-lg font-semibold text-slate-800 mb-2">Exercises Completed</div>
              <div className="text-sm text-slate-500">+{realTimeStats.todayExercises} today</div>
            </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {progress?.streakDays || 0}
              </div>
              <div className="text-lg font-semibold text-slate-800 mb-2">Day Streak</div>
              <div className="text-sm text-slate-500">Keep it up! 🔥</div>
            </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {progress?.averageScore || 0}%
              </div>
              <div className="text-lg font-semibold text-slate-800 mb-2">Average Score</div>
              <div className="text-sm text-slate-500">+{Math.max(0, (progress?.averageScore || 0) - 75)}% improvement</div>
            </div>
        </div>
      </div>

        {/* Weekly Progress Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              Weekly Progress
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Track your daily practice and stay motivated to reach your weekly goals
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span className="text-xl font-semibold text-slate-800">
                    Weekly Goal: {progress?.weeklyGoal || 30} minutes
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(realTimeStats.weeklyGoalProgress)}%
                  </div>
                  <div className="text-sm text-slate-500">Goal Progress</div>
                </div>
          </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
            <div 
                  className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(realTimeStats.weeklyGoalProgress)} transition-all duration-1000 ease-out`}
                  style={{width: `${Math.min(100, realTimeStats.weeklyGoalProgress)}%`}}
            ></div>
          </div>
        </div>
        
            <div className="space-y-6">
              {getWeekDays().map((date, index) => {
                const dayData = progress?.weeklyProgress?.[date] || { minutes: 0, exercises: 0, score: 0, percentage: 0 };
                const dayName = getDayName(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                
            return (
                  <div key={date} className={`flex items-center space-x-6 p-4 rounded-2xl transition-all duration-300 ${
                    isToday ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200' : 'hover:bg-slate-50'
                  }`}>
                    <div className="w-24 text-lg font-semibold text-slate-700">
                      {dayName}
                      {isToday && <span className="ml-2 text-blue-600">(Today)</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">
                          {dayData.minutes} min • {dayData.exercises} exercises
                        </span>
                        <span className="text-lg font-semibold text-slate-800">
                          {Math.floor(dayData.percentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(dayData.percentage)} transition-all duration-1000 ease-out`}
                          style={{width: `${Math.min(100, dayData.percentage)}%`}}
                  ></div>
                </div>
                    </div>
              </div>
            );
          })}
        </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              Your Achievements
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Celebrate your milestones and stay motivated on your speech therapy journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progress?.achievements?.map((achievement, index) => (
              <div 
                key={achievement}
                className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                     style={{ backgroundImage: `radial-gradient(circle at 20% 80%, ${getAchievementColor(achievement).split(' ')[1]} 0%, transparent 50%)` }}>
      </div>

                <div className="relative p-8">
                  <div className="flex items-center space-x-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getAchievementColor(achievement)} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <span className="text-3xl">{getAchievementIcon(achievement)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{achievement}</h3>
                      <p className="text-slate-600 leading-relaxed">
                        {achievement === 'First Steps' && 'Completed your first exercise'}
                        {achievement === 'Week Champion' && 'Maintained a 7-day practice streak'}
                        {achievement === 'Dedicated Learner' && 'Completed 50 exercises'}
                        {achievement === 'Sound Master' && 'Achieved 85%+ average score'}
                      </p>
              </div>
            </div>
          </div>
          
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getAchievementColor(achievement)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              </div>
            ))}
            
            {(!progress?.achievements || progress.achievements.length === 0) && (
              <div className="col-span-full text-center py-16">
                <Trophy className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-slate-600 mb-2">No Achievements Yet</h3>
                <p className="text-slate-500">Complete your first exercise to earn your first achievement!</p>
              </div>
            )}
            </div>
          </div>
          
        {/* Exercise Type Breakdown */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              Exercise Analytics
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Detailed breakdown of your practice patterns and performance metrics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {progress?.exerciseHistory?.filter(ex => ex.type === 'speech').length || 0}
              </div>
                <div className="text-lg font-semibold text-slate-800 mb-2">Speech Exercises</div>
                <div className="text-sm text-slate-500">Most practiced</div>
            </div>
          </div>
          
            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {progress?.exerciseHistory?.filter(ex => ex.type === 'storytelling').length || 0}
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-2">Storytelling</div>
                <div className="text-sm text-slate-500">Good progress</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {progress?.exerciseHistory?.filter(ex => ex.type === 'conversation').length || 0}
          </div>
                <div className="text-lg font-semibold text-slate-800 mb-2">Conversations</div>
                <div className="text-sm text-slate-500">Keep practicing</div>
        </div>
      </div>

            <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {progress?.exerciseHistory?.filter(ex => ex.type === 'pronunciation').length || 0}
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-2">Pronunciation</div>
                <div className="text-sm text-slate-500">Challenge yourself</div>
              </div>
            </div>
          </div>
          </div>
          
        {/* Real-Time Activity Monitor */}
        <div className="text-center">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-12">
            Live Activity Monitor
          </h3>
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {realTimeStats.currentSession} min
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">Today's Practice</div>
                <div className="text-sm text-slate-500">Real-time tracking</div>
          </div>
          
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {realTimeStats.todayExercises}
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">Exercises Today</div>
                <div className="text-sm text-slate-500">Live count</div>
          </div>
          
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.floor(realTimeStats.weeklyGoalProgress)}%
                </div>
                <div className="text-lg font-semibold text-slate-800 mb-1">Weekly Goal</div>
                <div className="text-sm text-slate-500">Current progress</div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
