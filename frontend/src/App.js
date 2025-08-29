import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import SpeechTherapy from './components/SpeechTherapy';
import Home from './components/Home';
import Progress from './components/Progress';
import Storytelling from './components/Storytelling';
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
              <Route path="/dashboard" element={<SpeechTherapy userId={user?.id} />} />
              <Route path="/progress" element={<Progress userProgress={{
                totalPoints: 150,
                exercisesCompleted: 12,
                streakDays: 5,
                weeklyGoal: 30
              }} />} />
              <Route path="/storytelling" element={<Storytelling />} />
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