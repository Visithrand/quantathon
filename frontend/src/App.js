const { useState, useEffect, useRef } = React;

// Main Speech Therapy App Component
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    totalPoints: 0,
    streakDays: 0,
    exercisesCompleted: 0,
    weeklyGoal: 105,
    dailyGoal: 15
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use speech exercises.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const submitAudio = async (exerciseType, targetText) => {
    if (!audioUrl) return;

    try {
      // Convert audio URL to blob
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');
      formData.append('exerciseType', exerciseType);
      formData.append('targetText', targetText);

      // Send to Spring Boot backend
      const analysisResponse = await fetch('/api/speech/analyze', {
        method: 'POST',
        body: formData
      });

      const result = await analysisResponse.json();
      
      // Update user progress
      setUserProgress(prev => ({
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1,
        totalPoints: prev.totalPoints + Math.floor(result.overallScore / 10)
      }));

      return result;
    } catch (error) {
      console.error('Error submitting audio:', error);
      // Return mock data for demo
      return {
        overallScore: Math.floor(Math.random() * 30) + 70,
        accuracyScore: Math.floor(Math.random() * 30) + 70,
        clarityScore: Math.floor(Math.random() * 30) + 70,
        feedback: ['Good pronunciation!', 'Try to speak more clearly', 'Practice this sound more']
      };
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userProgress={userProgress} setCurrentPage={setCurrentPage} />;
      case 'exercises':
        return <Exercises 
          isRecording={isRecording}
          audioUrl={audioUrl}
          startRecording={startRecording}
          stopRecording={stopRecording}
          submitAudio={submitAudio}
          setAudioUrl={setAudioUrl}
        />;
      case 'progress':
        return <Progress userProgress={userProgress} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard userProgress={userProgress} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} userProgress={userProgress} />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

// Navigation Component
function Navbar({ currentPage, setCurrentPage, userProgress }) {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'exercises', name: 'Exercises', icon: '🎯' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🗣️</span>
              <h1 className="text-xl font-bold text-gray-800">Speech Therapy Assistant</h1>
            </div>
            <div className="flex space-x-6">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Points: {userProgress.totalPoints}
            </div>
            <div className="text-sm text-gray-600">
              Streak: {userProgress.streakDays} days
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Dashboard Component
function Dashboard({ userProgress, setCurrentPage }) {
  const quickActions = [
    { id: 'phoneme', name: 'Phoneme Practice', icon: '🔤', description: 'Practice individual sounds' },
    { id: 'words', name: 'Word Exercises', icon: '📝', description: 'Improve word pronunciation' },
    { id: 'sentences', name: 'Sentence Practice', icon: '📖', description: 'Work on fluency' },
    { id: 'conversation', name: 'Conversations', icon: '💬', description: 'Real-world scenarios' }
  ];

  const weeklyProgress = (userProgress.exercisesCompleted * 3 / userProgress.weeklyGoal) * 100;
  const dailyProgress = 60; // Mock daily progress

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Speech Journey! 🎯</h2>
        <p className="text-lg text-gray-600">Let's practice and improve together</p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Goal</h3>
          <div className="text-2xl font-bold text-blue-600 mb-2">{Math.floor(dailyProgress)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: `${dailyProgress}%`}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">9 of 15 minutes completed</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Weekly Progress</h3>
          <div className="text-2xl font-bold text-green-600 mb-2">{Math.floor(weeklyProgress)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{width: `${weeklyProgress}%`}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{userProgress.exercisesCompleted * 3} of {userProgress.weeklyGoal} minutes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Points</h3>
          <div className="text-2xl font-bold text-purple-600">{userProgress.totalPoints}</div>
          <p className="text-sm text-gray-500 mt-2">🏆 Keep earning more!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Current Streak</h3>
          <div className="text-2xl font-bold text-orange-600">{userProgress.streakDays} days</div>
          <p className="text-sm text-gray-500 mt-2">🔥 Great consistency!</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => setCurrentPage('exercises')}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{action.name}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements 🏆</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">🎯 Completed 5 exercises in a row</span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">🔥 Maintained 7-day streak</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">📈 Improved by 10%</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">🎪 Mastered 'TH' sound</span>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white text-center">
        <p className="text-lg font-medium">💪 "Great speech comes from great practice! Keep going!"</p>
      </div>
    </div>
  );
}

// Exercises Component
function Exercises({ isRecording, audioUrl, startRecording, stopRecording, submitAudio, setAudioUrl }) {
  const [currentExercise, setCurrentExercise] = useState('phoneme');
  const [selectedPhoneme, setSelectedPhoneme] = useState('th');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const exerciseTypes = [
    { id: 'phoneme', name: 'Phoneme Practice', icon: '🔤' },
    { id: 'words', name: 'Word Exercises', icon: '📝' },
    { id: 'sentences', name: 'Sentence Repetition', icon: '📖' },
    { id: 'conversation', name: 'Conversation Practice', icon: '💬' },
    { id: 'tongue-twisters', name: 'Tongue Twisters', icon: '🌪️' }
  ];

  const phonemes = [
    { symbol: 'th', description: 'TH sound as in "think"', examples: ['think', 'both', 'three'] },
    { symbol: 's', description: 'S sound as in "sun"', examples: ['sun', 'house', 'lesson'] },
    { symbol: 'r', description: 'R sound as in "red"', examples: ['red', 'car', 'sorry'] },
    { symbol: 'l', description: 'L sound as in "love"', examples: ['love', 'help', 'yellow'] }
  ];

  const handleAnalyzeAudio = async () => {
    if (!audioUrl) return;
    
    setIsAnalyzing(true);
    try {
      const result = await submitAudio(currentExercise, selectedPhoneme);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Speech Exercises 🎯</h2>
        <p className="text-gray-600">Choose an exercise type and start practicing!</p>
      </div>

      {/* Exercise Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {exerciseTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setCurrentExercise(type.id)}
              className={`p-4 rounded-lg text-center transition-all ${
                currentExercise === type.id
                  ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="text-sm font-medium">{type.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Content */}
      {currentExercise === 'phoneme' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phoneme Practice</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Phoneme:</label>
            <select
              value={selectedPhoneme}
              onChange={(e) => setSelectedPhoneme(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {phonemes.map(phoneme => (
                <option key={phoneme.symbol} value={phoneme.symbol}>
                  {phoneme.symbol} - {phoneme.description}
                </option>
              ))}
            </select>
          </div>

          {selectedPhoneme && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Practicing: {phonemes.find(p => p.symbol === selectedPhoneme)?.description}
              </h4>
              <div>
                <strong>Example words:</strong> {phonemes.find(p => p.symbol === selectedPhoneme)?.examples.join(', ')}
              </div>
            </div>
          )}

          {/* Recording Controls */}
          <AudioRecorder
            isRecording={isRecording}
            audioUrl={audioUrl}
            startRecording={startRecording}
            stopRecording={stopRecording}
            resetRecording={resetRecording}
            handleAnalyzeAudio={handleAnalyzeAudio}
            isAnalyzing={isAnalyzing}
          />

          {/* Analysis Results */}
          {analysisResult && (
            <AnalysisResults result={analysisResult} />
          )}
        </div>
      )}
    </div>
  );
}

// Audio Recorder Component
function AudioRecorder({ isRecording, audioUrl, startRecording, stopRecording, resetRecording, handleAnalyzeAudio, isAnalyzing }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>🎤</span>
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 animate-pulse"
          >
            <span>⏹️</span>
            <span>Stop Recording</span>
          </button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex space-x-4">
            <audio controls src={audioUrl} className="h-12" />
            <button
              onClick={handleAnalyzeAudio}
              disabled={isAnalyzing}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isAnalyzing ? 'Analyzing...' : '📊 Analyze'}
            </button>
            <button
              onClick={resetRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              🔄 Reset
            </button>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span>Recording... Speak clearly into your microphone</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Analysis Results Component
function AnalysisResults({ result }) {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Analysis Results</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${getScoreBg(result.overallScore)}`}>
          <div className="text-sm font-medium text-gray-600">Overall Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
            {result.overallScore}/100
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBg(result.accuracyScore)}`}>
          <div className="text-sm font-medium text-gray-600">Accuracy</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.accuracyScore)}`}>
            {result.accuracyScore}/100
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBg(result.clarityScore)}`}>
          <div className="text-sm font-medium text-gray-600">Clarity</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.clarityScore)}`}>
            {result.clarityScore}/100
          </div>
        </div>
      </div>

      {result.feedback && result.feedback.length > 0 && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Feedback:</h5>
          <ul className="space-y-1">
            {result.feedback.map((tip, index) => (
              <li key={index} className="text-gray-700">• {tip}</li>
            ))}
          </ul>
        </div>
      )}

      {result.overallScore >= 85 && (
        <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700">
          🎉 Excellent! You've mastered this exercise!
        </div>
      )}
    </div>
  );
}

// Progress Component
function Progress({ userProgress }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Progress 📈</h2>
        <p className="text-gray-600">Track your speech therapy journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-blue-600">{userProgress.totalPoints}</div>
          <div className="text-sm text-gray-600 mt-1">Total Points</div>
          <div className="text-xs text-gray-500 mt-2">+15 this week</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-green-600">{userProgress.exercisesCompleted}</div>
          <div className="text-sm text-gray-600 mt-1">Exercises Completed</div>
          <div className="text-xs text-gray-500 mt-2">+3 today</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-purple-600">{userProgress.streakDays}</div>
          <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          <div className="text-xs text-gray-500 mt-2">Keep it up! 🔥</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-orange-600">84%</div>
          <div className="text-sm text-gray-600 mt-1">Average Score</div>
          <div className="text-xs text-gray-500 mt-2">+5% improvement</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
            const progress = Math.max(0, 100 - (index * 15) + Math.random() * 30);
            return (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">{day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{width: `${Math.min(100, progress)}%`}}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-600">{Math.floor(progress)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements 🏆</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-yellow-800">First Steps</div>
                <div className="text-sm text-yellow-600">Completed first exercise</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-semibold text-green-800">Week Champion</div>
                <div className="text-sm text-green-600">7-day practice streak</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-blue-800">Dedicated Learner</div>
                <div className="text-sm text-blue-600">50 exercises completed</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎪</span>
              <div>
                <div className="font-semibold text-purple-800">Sound Master</div>
                <div className="text-sm text-purple-600">Mastered 'TH' phoneme</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Component
function Settings() {
  const [settings, setSettings] = useState({
    voiceSpeed: 'normal',
    audioQuality: 'high',
    feedbackDetail: 'detailed',
    notifications: true,
    autoPlay: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings ⚙️</h2>
        <p className="text-gray-600">Customize your speech therapy experience</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Speed</label>
              <select
                value={settings.voiceSpeed}
                onChange={(e) => handleSettingChange('voiceSpeed', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
              <select
                value={settings.audioQuality}
                onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPlay"
                checked={settings.autoPlay}
                onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoPlay" className="ml-2 block text-sm text-gray-700">
                Auto-play pronunciation examples
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Detail Level</label>
            <select
              value={settings.feedbackDetail}
              onChange={(e) => handleSettingChange('feedbackDetail', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="simple">Simple</option>
              <option value="detailed">Detailed</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
              Enable daily practice reminders
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));