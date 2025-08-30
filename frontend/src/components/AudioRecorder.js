import React from 'react';
import BackButton from './BackButton'; // Added import for BackButton

function AudioRecorder({ isRecording, audioUrl, startRecording, stopRecording, resetRecording, handleAnalyzeAudio, isAnalyzing }) {
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton to="/home" variant="outline">
          Back to Home
        </BackButton>
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <span>🎤</span>
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 animate-pulse transition-colors"
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
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isAnalyzing ? 'Analyzing...' : '📊 Analyze'}
            </button>
            <button
              onClick={resetRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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

      {!isRecording && !audioUrl && (
        <div className="text-center text-gray-500 text-sm">
          <p>Click "Start Recording" to begin your speech exercise</p>
          <p className="mt-1">Make sure your microphone is working and speak clearly</p>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
