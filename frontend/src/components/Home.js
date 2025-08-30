import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home as HomeIcon,
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
  Heart,
  Star,
  Zap,
  Settings,
  LogOut,
  Sparkles,
  Target as TargetIcon,
  Brain,
  Mic,
  MessageSquare
} from 'lucide-react';

// Animated Logo Component
const AnimatedLogo = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative group">
        {/* Main Logo Container */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center transform transition-all duration-700 hover:scale-110 hover:rotate-3">
          {/* Animated Background Rings */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 animate-pulse opacity-75"></div>
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600"></div>
          
          {/* Logo Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="relative">
              {/* Speech Bubble */}
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <MessageSquare className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
              </div>
              
              {/* Sound Waves */}
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce opacity-80 group-hover:animate-spin transition-all duration-500"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-80 group-hover:animate-ping transition-all duration-500" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 -left-3 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-60 group-hover:animate-bounce transition-all duration-500"></div>
          <div className="absolute top-1/2 -right-3 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-60 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '1s' }}></div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl scale-125"></div>
        </div>
        
        {/* Logo Text */}
        <div className="text-center mt-6 transform transition-all duration-500 group-hover:scale-105">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            SpeechCoach
          </h1>
          <p className="text-sm text-slate-600 font-medium tracking-wide group-hover:text-slate-800 transition-colors duration-300">
            AI-Powered Speech Therapy
          </p>
        </div>
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-110"></div>
        
        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.9s' }}></div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      id: 'home', 
      name: 'Dashboard', 
      icon: <HomeIcon className="w-5 h-5" />, 
      active: true, 
      path: '/home',
      description: 'Overview of your speech therapy progress and daily activities',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'storytelling', 
      name: 'Storytelling', 
      icon: <BookOpen className="w-5 h-5" />, 
      active: false, 
      path: '/storytelling',
      description: 'Practice speech through engaging storytelling exercises',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'daily-scenario', 
      name: 'Daily Scenario', 
      icon: <Users className="w-5 h-5" />, 
      active: false, 
      path: '/daily-scenario',
      description: 'Real-world conversation practice in everyday situations',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
              id: 'games', 
      name: 'Pronunciation Games', 
      icon: <Infinity className="w-5 h-5" />, 
      active: false, 
              path: '/games',
      description: 'Fun games to improve pronunciation and articulation',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'progress', 
      name: 'Progress', 
      icon: <TrendingUp className="w-5 h-5" />, 
      active: false, 
      path: '/progress',
      description: 'Track your improvement and view detailed analytics',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      id: 'rewards', 
      name: 'Points Redemption', 
      icon: <Crown className="w-5 h-5" />, 
      active: false, 
      path: '/points-redemption',
      description: 'Redeem your earned points for vouchers, gifts, and rewards',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'ai-assistant', 
      name: 'AI Assistant', 
      icon: <Bot className="w-5 h-5" />, 
      active: false, 
      path: '/ai-assistant',
      description: 'Get personalized guidance from our AI speech coach',
      gradient: 'from-teal-500 to-cyan-500'
    },
    { 
      id: 'resources', 
      name: 'Resources', 
      icon: <FileText className="w-5 h-5" />, 
      active: false, 
      path: '/resources',
      description: 'Access helpful materials and learning resources',
      gradient: 'from-slate-500 to-gray-500'
    }
  ];

  const featureCards = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Build Confidence",
      description: "Clear communication helps you express yourself with assurance in any situation.",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect Better",
      description: "Improve your social interactions and make meaningful connections with others.",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achieve Goals",
      description: "From classroom presentations to job interviews, clear speech opens doors.",
      gradient: "from-purple-400 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    }
  ];

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

        {/* User Profile Section */}
        <div className="relative z-10 p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-blue-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-blue-200 font-medium">{user?.name || 'User'}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Online</span>
              </div>
            </div>
        </div>

          {/* Enhanced Logout Button */}
            <button
            onClick={logout}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-3">
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="relative z-10 mt-8 px-6 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          {navigationItems.map((item, index) => (
            <Link
              key={item.id}
              to={item.path}
              className={`group block mb-4 p-5 rounded-2xl transition-all duration-500 hover:scale-105 transform ${
                item.active
                  ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-2xl shadow-blue-500/25 border-l-4 border-cyan-300'
                  : 'text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-3">
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
              <p className={`text-sm leading-relaxed ${
                item.active ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                {item.description}
              </p>
              
              {/* Hover Effect Indicator */}
              {!item.active && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className={`w-2 h-2 bg-gradient-to-r ${item.gradient} rounded-full`}></div>
                </div>
              )}
            </Link>
          ))}
          
          {/* Enhanced Settings Section */}
          <div className="mt-8 pt-8 border-t border-slate-700/50 pb-6">
            <Link
              to="/settings"
              className="group flex items-center space-x-4 p-5 text-slate-200 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white rounded-2xl transition-all duration-300 hover:scale-105 transform"
            >
              <div className="p-2 rounded-xl bg-slate-700/50 group-hover:bg-white/10 transition-colors duration-300">
                <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <span className="font-semibold">Settings</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Main Content Area */}
        <main className="p-12">
          {/* Enhanced Welcome Section */}
          <div className="text-center mb-16 relative">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
              </div>
            
            {/* Animated Logo */}
            <AnimatedLogo />
            
            <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">AI-Powered Speech Therapy</span>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Every day you practice, you're building communication skills that will benefit you for a lifetime.
              <span className="text-blue-600 font-semibold"> Let's make today count!</span>
            </p>
          </div>

          {/* Enhanced Quote Card */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-12 text-center border border-slate-200/50 backdrop-blur-sm">
                <div className="text-8xl text-gradient-to-b from-blue-400 to-cyan-500 mb-8 font-serif">"</div>
                <p className="text-3xl italic text-slate-800 mb-8 leading-relaxed font-light">
                Your voice matters. Every word you speak brings you closer to confident communication.
              </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-semibold text-slate-800">Speech Coach Maria</div>
                    <div className="text-sm text-slate-500">AI Speech Therapy Specialist</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Why Your Practice Matters */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              Why Your Practice Matters
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Discover the transformative impact of consistent speech therapy practice
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featureCards.map((card, index) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform border border-slate-200/50"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Card Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                       style={{ backgroundImage: `radial-gradient(circle at 20% 80%, ${card.gradient.split(' ')[1]} 0%, transparent 50%)` }}>
                  </div>
                  
                  <div className="relative p-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${card.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <div className="text-slate-700">
                      {card.icon}
                    </div>
                  </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">{card.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-center">{card.description}</p>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-12">
              Ready to Practice?
            </h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/dashboard"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <TargetIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Start Exercise</span>
                  <div className="w-2 h-2 bg-white rounded-full group-hover:animate-ping"></div>
                </div>
              </Link>
              
              <Link
                to="/progress"
                className="group relative overflow-hidden bg-white text-slate-700 hover:text-slate-800 px-10 py-5 rounded-2xl font-bold text-lg border-2 border-slate-300 hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>View Progress</span>
                </div>
              </Link>
            </div>
            
            {/* Additional Action Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <Brain className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">AI Assessment</h4>
                <p className="text-sm opacity-90">Get personalized speech analysis</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <Users className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Community</h4>
                <p className="text-sm opacity-90">Connect with other learners</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
                <Trophy className="w-8 h-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Achievements</h4>
                <p className="text-sm opacity-90">Track your milestones</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
