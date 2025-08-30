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
import './App.css';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

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
  );
}

export default App;