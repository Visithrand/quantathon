import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Mic, Volume2, Clock, Target, 
  CheckCircle, XCircle, ArrowLeft, Trophy, BarChart3 
} from 'lucide-react';

const ExerciseModule = ({ exercise, onComplete, onBack, userProgress }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const startTimeRef = useRef(null);

  // Exercise steps based on type and difficulty
  const getExerciseSteps = () => {
    const baseSteps = {
      'Pronunciation': [
        'Take a deep breath and relax your vocal cords',
        'Listen carefully to the target sound',
        'Practice the sound slowly and clearly',
        'Repeat with increasing speed',
        'Maintain clarity throughout'
      ],
      'Fluency': [
        'Start with slow, deliberate speech',
        'Focus on smooth transitions between words',
        'Practice breathing rhythmically',
        'Gradually increase your pace',
        'Maintain consistent flow'
      ],
      'Articulation': [
        'Warm up your mouth and tongue',
        'Practice each sound individually',
        'Combine sounds into words',
        'Focus on precision and clarity',
        'Build up to full sentences'
      ],
      'Voice': [
        'Begin with gentle humming',
        'Practice pitch variations',
        'Work on volume control',
        'Develop vocal resonance',
        'Express emotions through voice'
      ],
      'Language': [
        'Read the text silently first',
        'Understand the content and context',
        'Practice pronunciation of difficult words',
        'Focus on natural expression',
        'Deliver with confidence and clarity'
      ],
      'Breathing': [
        'Sit comfortably with your back straight',
        'Place one hand on your chest, one on your belly',
        'Breathe in slowly through your nose',
        'Feel your belly expand, not your chest',
        'Exhale slowly and completely',
        'Practice this rhythm for 5 minutes'
      ],
      'Resonance': [
        'Start with gentle humming',
        'Feel the vibration in your chest',
        'Move the sound to your nasal cavity',
        'Practice with different vowel sounds',
        'Maintain steady pitch and volume',
        'Feel the resonance throughout your body'
      ],
      'Projection': [
        'Stand with good posture',
        'Take a deep breath from your diaphragm',
        'Speak from your chest, not your throat',
        'Project your voice to the back of the room',
        'Maintain clear articulation',
        'Practice with increasing distance'
      ],
      'Expression': [
        'Read the text with different emotions',
        'Practice happy, sad, angry, and calm tones',
        'Use facial expressions to enhance emotion',
        'Vary your pitch and pace',
        'Connect emotionally with your audience',
        'Maintain authenticity in expression'
      ],
      'Confidence': [
        'Stand tall with open posture',
        'Make eye contact with your audience',
        'Speak clearly and at a steady pace',
        'Use positive self-talk',
        'Practice power poses before speaking',
        'Celebrate small victories'
      ]
    };

    return baseSteps[exercise.type] || baseSteps['Pronunciation'];
  };

  // Practice content for each exercise type
  const getPracticeContent = () => {
    const practiceContent = {
      'Pronunciation': {
        title: "Vowel Sound Practice",
        content: [
          "A - Say 'ah' as in 'father' - Hold for 3 seconds",
          "E - Say 'eh' as in 'bed' - Hold for 3 seconds", 
          "I - Say 'ee' as in 'see' - Hold for 3 seconds",
          "O - Say 'oh' as in 'go' - Hold for 3 seconds",
          "U - Say 'oo' as in 'moon' - Hold for 3 seconds"
        ],
        practiceText: "Practice each vowel sound clearly and hold each one. Focus on opening your mouth wide and maintaining consistent volume."
      },
      'Fluency': {
        title: "Smooth Speech Practice",
        content: [
          "The quick brown fox jumps over the lazy dog",
          "Peter Piper picked a peck of pickled peppers",
          "How much wood would a woodchuck chuck",
          "She sells seashells by the seashore",
          "Red lorry, yellow lorry, red lorry, yellow lorry"
        ],
        practiceText: "Read each phrase slowly at first, then gradually increase your speed while maintaining clarity and smooth transitions."
      },
      'Articulation': {
        title: "Tongue Twister Practice",
        content: [
          "Betty Botter bought some butter",
          "But she said the butter's bitter",
          "If I put it in my batter",
          "It will make my batter bitter",
          "But a bit of better butter",
          "Will make my batter better"
        ],
        practiceText: "Start slowly and clearly. Focus on each word and sound. Gradually increase speed while maintaining precision."
      },
      'Voice': {
        title: "Voice Control Practice",
        content: [
          "Hum 'mmmm' - Feel the vibration in your chest",
          "Say 'la la la' - Practice pitch variations",
          "Count 1-10 - Vary your volume (whisper to loud)",
          "Say 'hello' - Practice different emotions",
          "Practice 'ah-oh-ee' - Work on resonance"
        ],
        practiceText: "Focus on feeling the vibrations in your chest and face. Practice different pitches and volumes with control."
      },
      'Language': {
        title: "Reading Comprehension Practice",
        content: [
          "The sun was setting behind the mountains, casting long shadows across the valley. Birds were returning to their nests, and a gentle breeze rustled through the trees. It was a perfect evening for reflection and gratitude."
        ],
        practiceText: "Read the passage with expression and emotion. Vary your pace and tone to bring the scene to life."
      },
      'Breathing': {
        title: "Diaphragmatic Breathing Practice",
        content: [
          "Place one hand on your chest, one on your belly",
          "Breathe in slowly through your nose (4 counts)",
          "Feel your belly expand, not your chest",
          "Hold the breath (4 counts)",
          "Exhale slowly through your mouth (6 counts)",
          "Repeat this cycle 10 times"
        ],
        practiceText: "Focus on breathing from your diaphragm. Your belly should rise and fall, not your chest. Practice this rhythm slowly and mindfully."
      },
      'Resonance': {
        title: "Vocal Resonance Practice",
        content: [
          "Hum 'mmmm' - Feel chest vibration",
          "Say 'nnnn' - Feel nasal resonance",
          "Practice 'ng' sound - Feel throat vibration",
          "Say 'ah' - Feel full body resonance",
          "Combine sounds: 'mm-ah', 'nn-oh', 'ng-ee'"
        ],
        practiceText: "Focus on feeling the vibrations in different parts of your body. Resonance should feel like a gentle hum throughout your chest and face."
      },
      'Projection': {
        title: "Voice Projection Practice",
        content: [
          "Stand 5 feet from a wall and speak clearly",
          "Say 'Hello, can you hear me?'",
          "Move to 10 feet and repeat",
          "Move to 15 feet and project your voice",
          "Practice: 'The weather is beautiful today!'",
          "Project to the back of an imaginary room"
        ],
        practiceText: "Stand with good posture, breathe from your diaphragm, and speak from your chest. Imagine your voice reaching the back of a large room."
      },
      'Expression': {
        title: "Emotional Expression Practice",
        content: [
          "Happy: 'What a wonderful day this is!'",
          "Sad: 'I feel a bit down today'",
          "Excited: 'I can't wait to see you!'",
          "Calm: 'Everything will be alright'",
          "Confident: 'I know I can do this'",
          "Surprised: 'Oh my goodness, really?'"
        ],
        practiceText: "Practice each phrase with genuine emotion. Use facial expressions, vary your pitch, and connect with the feeling behind each word."
      },
      'Confidence': {
        title: "Confidence Building Practice",
        content: [
          "Stand tall with open posture",
          "Make eye contact with yourself in the mirror",
          "Say 'I am confident and capable'",
          "Practice power poses for 2 minutes",
          "Speak clearly: 'My voice matters'",
          "End with: 'I am proud of my progress'"
        ],
        practiceText: "Stand in front of a mirror. Practice power poses, make eye contact, and speak with conviction. Believe in what you're saying."
      }
    };

    return practiceContent[exercise.type] || practiceContent['Pronunciation'];
  };

  const steps = getExerciseSteps();

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    // Initialize media recorder
    initializeMediaRecorder();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const initializeMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const speakInstruction = (text) => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setShowInstructions(false);
    setCurrentStep(0);
    setTimeElapsed(0);
    setExerciseProgress(0);
    startTimeRef.current = Date.now();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    // Speak first instruction
    speakInstruction(`Starting ${exercise.title}. ${steps[0]}`);
    
    // Start recording
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const pauseExercise = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
    }
    if (speechSynthesis) {
      speechSynthesis.pause();
    }
  };

  const resumeExercise = () => {
    setIsActive(true);
    startTimeRef.current = Date.now() - (timeElapsed * 1000);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
    }
    if (speechSynthesis) {
      speechSynthesis.resume();
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      setExerciseProgress(((nextStepIndex + 1) / steps.length) * 100);
      
      // Speak next instruction
      speakInstruction(steps[nextStepIndex]);
    } else {
      completeExercise();
    }
  };

  const completeExercise = async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate exercise metrics
    const duration = Math.ceil(timeElapsed / 60); // minutes
    const performanceScore = Math.min(100, Math.max(0, 
      (exerciseProgress * 0.4) + 
      (Math.min(timeElapsed, exercise.duration * 60) / (exercise.duration * 60) * 100 * 0.6)
    ));

    // Send completion data to backend
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      
      const exerciseData = {
        userId: userId,
        exerciseData: {
          exerciseId: exercise.id,
          status: 'completed',
          completedAt: new Date().toISOString(),
          type: 'exercise',
          duration: duration,
          score: performanceScore,
          points: Math.round(performanceScore / 10),
          exerciseType: exercise.type,
          difficulty: exercise.difficulty,
          timeSpent: timeElapsed,
          progress: exerciseProgress
        }
      };

      const response = await fetch('http://localhost:5001/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(exerciseData)
      });

      if (response.ok) {
        console.log('Exercise completed and progress updated!');
        onComplete({
          exercise,
          duration,
          score: performanceScore,
          timeSpent: timeElapsed,
          progress: exerciseProgress
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{exercise.title}</h1>
              <p className="text-white/60">{getCurrentDate()}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white/80">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-white/80">{exercise.duration}m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showInstructions ? (
          /* Exercise Instructions */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {exercise.icon}
                </div>
                <h2 className="text-3xl font-bold mb-2">{exercise.title}</h2>
                <p className="text-xl text-white/80 mb-4">{exercise.description}</p>
                <div className="flex items-center justify-center space-x-6 text-white/60">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>{exercise.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>{exercise.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{exercise.duration} minutes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-center mb-4">Exercise Steps:</h3>
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white/5 rounded-xl">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-white/90">{step}</p>
                  </div>
                ))}
              </div>

              {/* Practice Content Section */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-center mb-4">Practice Materials:</h3>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="text-lg font-semibold text-center mb-4 text-blue-300">
                    {getPracticeContent().title}
                  </h4>
                  
                  <div className="space-y-3 mb-4">
                    {getPracticeContent().content.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <p className="text-blue-200 text-sm leading-relaxed">
                      <strong>Practice Tip:</strong> {getPracticeContent().practiceText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={startExercise}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <Play className="w-6 h-6 inline mr-2" />
                  Start Exercise
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active Exercise */
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Progress</span>
                <span className="text-blue-400 font-bold">{Math.round(exerciseProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${exerciseProgress}%` }}
                ></div>
              </div>
            </div>

                        {/* Current Step */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{currentStep + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Step {currentStep + 1} of {steps.length}</h3>
                <p className="text-xl text-white/80 mb-6">{steps[currentStep]}</p>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    {currentStep < steps.length - 1 ? 'Next Step' : 'Complete Exercise'}
                  </button>
                </div>
              </div>
            </div>

            {/* Practice Content Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
              <h3 className="text-xl font-semibold text-center mb-4">Current Practice:</h3>
              <div className="bg-white/5 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-center mb-3 text-blue-300">
                  {getPracticeContent().title}
                </h4>
                
                <div className="space-y-2 mb-3">
                  {getPracticeContent().content.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-white/90 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-blue-200 text-xs leading-relaxed">
                    <strong>Focus:</strong> {getPracticeContent().practiceText}
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise Controls */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={resumeExercise}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseExercise}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
                  >
                    <Pause className="w-5 h-5 inline mr-2" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={completeExercise}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Complete
                </button>
              </div>

              {/* Recording Status */}
              <div className="mt-4 text-center">
                {isRecording && (
                  <div className="flex items-center justify-center space-x-2 text-red-400">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <Mic className="w-5 h-5" />
                    <span>Recording in progress...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseModule;
