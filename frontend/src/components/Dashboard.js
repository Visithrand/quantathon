import React, { useState } from 'react';
import { 
  Home,
  BookOpen,
  Users,
  Infinity,
  TrendingUp,
  Crown,
  User,
  FileText,
  Bot,
  Target,
  MessageCircle,
  Trophy,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';

function Dashboard({ userProgress, setCurrentPage }) {
  const [activePage, setActivePage] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home className="w-5 h-5" />, active: true },
    { id: 'storytelling', name: 'Storytelling', icon: <BookOpen className="w-5 h-5" />, active: false },
    { id: 'daily-scenario', name: 'Daily Scenario', icon: <Users className="w-5 h-5" />, active: false },
    { id: 'pronunciation-games', name: 'Pronunciation Games', icon: <Infinity className="w-5 h-5" />, active: false },
    { id: 'progress', name: 'Progress', icon: <TrendingUp className="w-5 h-5" />, active: false },
    { id: 'rewards', name: 'Rewards', icon: <Crown className="w-5 h-5" />, active: false },
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" />, active: false },
    { id: 'resources', name: 'Resources', icon: <FileText className="w-5 h-5" />, active: false },
    { id: 'ai-assistant', name: 'AI Assistant', icon: <Bot className="w-5 h-5" />, active: false }
  ];

  const featureCards = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Build Confidence",
      description: "Clear communication helps you express yourself with assurance in any situation."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Better",
      description: "Improve your social interactions and make meaningful connections with others."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achieve Goals",
      description: "From classroom presentations to job interviews, clear speech opens doors."
    }
  ];

  const handleNavigation = (pageId) => {
    setActivePage(pageId);
    if (pageId === 'dashboard') {
      // Stay on dashboard
    } else {
      setCurrentPage(pageId);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 shadow-2xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Enhanced Brand Section */}
        <div className="relative z-10 p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">VocaCare</h1>
            <p className="text-sm text-blue-200">Speech Therapy for Teens</p>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="relative z-10 mt-8 px-6">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`group block w-full mb-4 p-5 rounded-2xl transition-all duration-500 hover:scale-105 transform ${
                item.active
                  ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-2xl shadow-blue-500/25 border-l-4 border-cyan-300'
                  : 'text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-xl ${
                  item.active 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-slate-700/50 group-hover:bg-white/10'
                }`}>
                  <div className={`text-slate-300 group-hover:text-white transition-colors duration-300 ${
                    item.active ? 'text-white' : ''
                  }`}>
                    {item.icon}
                  </div>
                </div>
                <span className="font-semibold text-lg">{item.name}</span>
              </div>
              
              {/* Hover Effect Indicator */}
              {!item.active && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                SpeechSpark - Teen
              </h1>
              <p className="text-slate-600 mt-1">Your Personal Speech Therapy Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-slate-800 font-semibold text-lg">Teen User</span>
                <div className="text-sm text-slate-500">Active Session</div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content Area */}
        <main className="p-12">
          {/* Enhanced Welcome Section */}
          <div className="text-center mb-16 relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg">
              <Target className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Welcome to SpeechSpark!</span>
            </div>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome back, Teen User!
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Every day you practice, you're building communication skills that will benefit you for a lifetime.
            </p>
          </div>

          {/* Enhanced Quote Card */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-200/50 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="text-6xl text-blue-600 mb-6 font-serif">"</div>
                <p className="text-2xl italic text-slate-800 mb-6 leading-relaxed">
                  Your voice matters. Every word you speak brings you closer to confident communication.
                </p>
                <div className="text-right">
                  <span className="text-lg text-blue-600 font-medium">- Speech Coach Maria</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Why Your Practice Matters */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                Why Your Practice Matters
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Every exercise builds essential skills for confident communication
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {featureCards.map((card, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <div className="text-white">
                        {card.icon}
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-4">{card.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-lg">{card.description}</p>
                  </div>
                  
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Progress Overview */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                    Your Progress This Week
                  </h3>
                  <p className="text-lg text-slate-600">Track your speech therapy journey and celebrate your achievements</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{Math.floor(userProgress.exercisesCompleted * 3)}</div>
                      <div className="text-blue-800 font-medium">Minutes Completed</div>
                      <div className="text-sm text-blue-600">of {userProgress.weeklyGoal} goal</div>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">{userProgress.exercisesCompleted}</div>
                      <div className="text-green-800 font-medium">Exercises Done</div>
                      <div className="text-sm text-green-600">This week</div>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">{userProgress.totalPoints}</div>
                      <div className="text-purple-800 font-medium">Points Earned</div>
                      <div className="text-sm text-purple-600">Keep going!</div>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200/50 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">{userProgress.streakDays}</div>
                      <div className="text-orange-800 font-medium">Day Streak</div>
                      <div className="text-sm text-orange-600">🔥 Amazing!</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-purple-800 mb-8">Ready to Practice?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setCurrentPage('exercises')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Exercise
              </button>
              <button
                onClick={() => setCurrentPage('progress')}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Progress
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
