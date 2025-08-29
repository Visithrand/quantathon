import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Settings, Play, Pause, RotateCcw } from 'lucide-react';

/**
 * VoiceFeedback Component
 * Handles AI voice feedback using speech synthesis with configurable settings
 * 
 * @param {string} text - Text to be spoken
 * @param {Object} config - Speech synthesis configuration
 * @param {boolean} autoPlay - Whether to automatically play on mount
 * @param {Function} onStart - Callback when speech starts
 * @param {Function} onEnd - Callback when speech ends
 * @param {Function} onError - Callback when speech fails
 */
function VoiceFeedback({ 
  text, 
  config = {}, 
  autoPlay = false, 
  onStart, 
  onEnd, 
  onError 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [speechConfig, setSpeechConfig] = useState({
    rate: config.rate || 1.0,
    pitch: config.pitch || 1.0,
    volume: config.volume || 1.0,
    voice: config.voice || null
  });

  const utteranceRef = useRef(null);
  const availableVoices = useRef([]);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load available voices
      const loadVoices = () => {
        availableVoices.current = speechSynthesis.getVoices();
      };

      // Handle voice loading
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();

      // Auto-play if enabled
      if (autoPlay && text) {
        speak(text);
      }
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [autoPlay, text]);

  // Update speech config when config prop changes
  useEffect(() => {
    setSpeechConfig(prev => ({
      ...prev,
      ...config
    }));
  }, [config]);

  // Speak the given text
  const speak = (textToSpeak) => {
    if (!textToSpeak || !('speechSynthesis' in window)) {
      onError?.('Speech synthesis not supported or no text provided');
      return;
    }

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Apply configuration
      utterance.rate = speechConfig.rate;
      utterance.pitch = speechConfig.pitch;
      utterance.volume = speechConfig.volume;
      
      // Set voice if specified
      if (speechConfig.voice) {
        utterance.voice = speechConfig.voice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        onStart?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        setIsPaused(false);
        onError?.(`Speech error: ${event.error}`);
      };

      // Store reference and speak
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);

    } catch (error) {
      onError?.(`Failed to start speech: ${error.message}`);
    }
  };

  // Pause speech
  const pause = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Resume speech
  const resume = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Stop speech
  const stop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  // Update speech configuration
  const updateSpeechConfig = (key, value) => {
    setSpeechConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Get available voice names
  const getVoiceNames = () => {
    return availableVoices.current.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default
    }));
  };

  // Check if speech synthesis is supported
  if (!('speechSynthesis' in window)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <VolumeX className="h-5 w-5 text-yellow-600" />
          <p className="text-yellow-800 text-sm">
            Speech synthesis is not supported in this browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-blue-900">AI Voice Feedback</h4>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
          title="Speech Settings"
        >
          <Settings className="h-5 w-5 text-blue-600" />
        </button>
      </div>

      {/* Text Display */}
      <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
        <p className="text-blue-900 leading-relaxed">{text}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handlePlayPause}
          disabled={!text}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isPlaying
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            )
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Listen
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <VolumeX className="h-4 w-4" />
            Stop
          </button>
        )}

        <button
          onClick={() => speak(text)}
          disabled={!text || isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Replay
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h5 className="font-medium text-blue-900 mb-3">Speech Settings</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rate Control */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Speed: {speechConfig.rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechConfig.rate}
                onChange={(e) => updateSpeechConfig('rate', parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Pitch Control */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Pitch: {speechConfig.pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechConfig.pitch}
                onChange={(e) => updateSpeechConfig('pitch', parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Volume Control */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Volume: {Math.round(speechConfig.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={speechConfig.volume}
                onChange={(e) => updateSpeechConfig('volume', parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Voice Selection */}
          {availableVoices.current.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Voice
              </label>
              <select
                value={speechConfig.voice?.name || ''}
                onChange={(e) => {
                  const selectedVoice = availableVoices.current.find(v => v.name === e.target.value);
                  updateSpeechConfig('voice', selectedVoice);
                }}
                className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Default Voice</option>
                {getVoiceNames().map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.default ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Status Indicator */}
      {isPlaying && (
        <div className="flex items-center gap-2 text-blue-700">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {isPaused ? 'Paused' : 'Speaking...'}
          </span>
        </div>
      )}
    </div>
  );
}

export default VoiceFeedback;
