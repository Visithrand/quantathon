import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AIExercises({ userId }) {
  const [aiExercises, setAiExercises] = useState([]);
  const [activeExercises, setActiveExercises] = useState([]);
  const [bodyExercises, setBodyExercises] = useState([]);
  const [fluencyAnalysis, setFluencyAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedExerciseType, setSelectedExerciseType] = useState('sentence');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  const API_BASE = 'http://localhost:8080/api';

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load AI exercises
      const exercisesResponse = await axios.get(`${API_BASE}/ai/exercises/${userId}`);
      setAiExercises(exercisesResponse.data.exercises || []);

      // Load active exercises
      const activeResponse = await axios.get(`${API_BASE}/ai/exercises/${userId}/active`);
      setActiveExercises(activeResponse.data.activeExercises || []);

      // Load body exercises
      const bodyResponse = await axios.get(`${API_BASE}/ai/body-exercises/${userId}`);
      setBodyExercises(bodyResponse.data.suggestions || []);

      // Load fluency analysis
      const fluencyResponse = await axios.get(`${API_BASE}/ai/fluency-analysis/${userId}`);
      setFluencyAnalysis(fluencyResponse.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewExercise = async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai/generate-exercise/${userId}`, null, {
        params: { exerciseType: selectedExerciseType }
      });
      const newExercise = response.data.exercise;
      setAiExercises(prev => [newExercise, ...prev]);
      setActiveExercises(prev => [newExercise, ...prev]);
      setCurrentExercise(newExercise);
    } catch (error) {
      console.error('Error generating exercise:', error);
      alert('Failed to generate exercise. Please try again.');
    }
  };

  const generateWeeklyPlan = async () => {
    try {
      const response = await axios.post(`${API_BASE}/ai/generate-weekly-plan/${userId}`);
      const weeklyPlan = response.data.weeklyPlan;
      setAiExercises(prev => [...weeklyPlan, ...prev]);
      setActiveExercises(prev => [...weeklyPlan, ...prev]);
      alert('Weekly plan generated successfully!');
    } catch (error) {
      console.error('Error generating weekly plan:', error);
      alert('Failed to generate weekly plan. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setChunks(audioChunks);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const completeExercise = async (exerciseId, performanceScore = null) => {
    try {
      const params = performanceScore ? { performanceScore } : {};
      await axios.post(`${API_BASE}/ai/exercises/${exerciseId}/complete`, null, { params });
      
      // Update local state
      setActiveExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      setAiExercises(prev => prev.map(ex => 
        ex.id === exerciseId ? { ...ex, isCompleted: true } : ex
      ));
      
      // Reload fluency analysis
      const fluencyResponse = await axios.get(`${API_BASE}/ai/fluency-analysis/${userId}`);
      setFluencyAnalysis(fluencyResponse.data);
      
      alert('Exercise completed successfully!');
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Failed to complete exercise. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 AI-Powered Speech Therapy</h2>
        <p className="text-gray-600 mb-6">
          Get personalized exercises and real-time fluency analysis to improve your speech skills.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateNewExercise}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Generate New Exercise
          </button>
          <button
            onClick={generateWeeklyPlan}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Generate Weekly Plan
          </button>
        </div>
      </div>

      {/* Exercise Type Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Exercise Type</h3>
        <div className="flex flex-wrap gap-3">
          {['sentence', 'story', 'conversation', 'tongue_twister'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedExerciseType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedExerciseType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Active AI Exercises */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Active AI Exercises</h3>
        {activeExercises.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active exercises. Generate some to get started!</p>
        ) : (
          <div className="space-y-4">
            {activeExercises.map(exercise => (
              <div key={exercise.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{exercise.exerciseType.replace('_', ' ').toUpperCase()}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficultyLevel)}`}>
                      {exercise.difficultyLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentExercise(exercise)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Practice
                  </button>
                </div>
                
                <p className="text-gray-700 mb-3">{exercise.exerciseContent}</p>
                
                {exercise.targetPhonemes && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Target Phonemes:</strong> {exercise.targetPhonemes}
                  </p>
                )}
                
                {exercise.targetSkills && (
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Target Skills:</strong> {exercise.targetSkills}
                  </p>
                )}
                
                <p className="text-sm text-gray-500 mb-3">{exercise.aiReasoning}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => completeExercise(exercise.id, 85)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Complete (Good)
                  </button>
                  <button
                    onClick={() => completeExercise(exercise.id, 70)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Complete (Needs Work)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Exercise Practice */}
      {currentExercise && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Practice Current Exercise</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-800 mb-2">{currentExercise.exerciseType.replace('_', ' ').toUpperCase()}</h4>
            <p className="text-blue-700 text-lg leading-relaxed">{currentExercise.exerciseContent}</p>
          </div>
          
          <div className="flex gap-4 mb-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                ⏹️ Stop Recording
              </button>
            )}
          </div>
          
          {audioUrl && (
            <div className="space-y-4">
              <audio controls src={audioUrl} className="w-full" />
              <div className="flex gap-2">
                <button
                  onClick={() => completeExercise(currentExercise.id, 85)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Complete Exercise
                </button>
                <button
                  onClick={() => setAudioUrl(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Record Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Body Exercises */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🧘 Body & Breathing Exercises</h3>
        {bodyExercises.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No body exercises available.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bodyExercises.map(exercise => (
              <div key={exercise.id} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-2">{exercise.exerciseName}</h4>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficultyLevel)} mb-2`}>
                  {exercise.difficultyLevel}
                </span>
                <p className="text-gray-700 text-sm mb-3">{exercise.description}</p>
                <p className="text-gray-600 text-xs mb-2">
                  <strong>Duration:</strong> {exercise.durationSeconds}s
                </p>
                <p className="text-gray-600 text-xs mb-3">
                  <strong>Target:</strong> {exercise.targetMuscles}
                </p>
                <p className="text-gray-500 text-xs">{exercise.benefits}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fluency Analysis */}
      {fluencyAnalysis && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Fluency Analysis</h3>
          
          {fluencyAnalysis.averages && (
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {Object.entries(fluencyAnalysis.averages).map(([skill, score]) => (
                <div key={skill} className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {fluencyAnalysis.trends && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Performance Trends</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(fluencyAnalysis.trends).map(([skill, trend]) => (
                  <div key={skill} className="text-center">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trend === 'excellent' ? 'bg-green-100 text-green-800' :
                      trend === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {trend}
                    </div>
                    <div className="text-xs text-gray-600 capitalize mt-1">
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {fluencyAnalysis.recommendations && fluencyAnalysis.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {fluencyAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            Based on {fluencyAnalysis.totalSessions || 0} practice sessions
          </div>
        </div>
      )}
    </div>
  );
}

export default AIExercises;
