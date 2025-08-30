import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Progress from './components/Progress';
import Storytelling from './components/Storytelling';
import DailyScenario from './components/DailyScenario';
import GamifiedPronunciations from './components/GamifiedPronunciations';
import PointsRedemption from './components/PointsRedemption';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">The app encountered an error. Please refresh the page or try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Speech Therapy App...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          {isAuthenticated ? (
            <main className="main-content">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard setCurrentPage={(page) => {
                  // Handle navigation to different pages
                  if (page === 'progress') window.location.href = '/progress';
                  if (page === 'storytelling') window.location.href = '/storytelling';
                  if (page === 'daily-scenario') window.location.href = '/daily-scenario';
                  if (page === 'exercises') window.location.href = '/home';
                  if (page === 'games') window.location.href = '/games';
                }} />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/storytelling" element={<Storytelling />} />
                <Route path="/daily-scenario" element={<DailyScenario />} />
                <Route path="/games" element={<GamifiedPronunciations userId={user?.id} />} />
                <Route path="/points-redemption" element={<PointsRedemption />} />
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </main>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;