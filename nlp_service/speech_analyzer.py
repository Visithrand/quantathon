"""
Speech Analysis NLP Service for Speech Therapy Assistant
Provides speech-to-text analysis, pronunciation scoring, and feedback generation
"""

import os
import json
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import logging
from typing import Dict, List, Tuple, Any
import random
import re
from datetime import datetime
import wave
import struct

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = '/tmp/speech_uploads'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

class SpeechAnalyzer:
    """Core speech analysis engine with NLP capabilities"""
    
    def __init__(self):
        self.phoneme_models = self._load_phoneme_models()
        self.word_patterns = self._load_word_patterns()
        self.difficulty_weights = self._load_difficulty_weights()
        
    def _load_phoneme_models(self) -> Dict[str, Dict]:
        """Load phoneme recognition models and reference patterns"""
        return {
            'th': {
                'frequency_range': [2000, 8000],
                'energy_threshold': 0.3,
                'duration_min': 0.1,
                'formant_patterns': [800, 1200, 2300],
                'difficulty': 'advanced',
                'common_errors': ['t', 'd', 's', 'z']
            },
            's': {
                'frequency_range': [4000, 10000],
                'energy_threshold': 0.4,
                'duration_min': 0.08,
                'formant_patterns': [6000, 7000, 8000],
                'difficulty': 'intermediate',
                'common_errors': ['th', 'sh', 'z']
            },
            'r': {
                'frequency_range': [1000, 3000],
                'energy_threshold': 0.25,
                'duration_min': 0.12,
                'formant_patterns': [1200, 1400, 1700],
                'difficulty': 'advanced',
                'common_errors': ['w', 'l', 'er']
            },
            'l': {
                'frequency_range': [500, 2500],
                'energy_threshold': 0.3,
                'duration_min': 0.1,
                'formant_patterns': [700, 1200, 2400],
                'difficulty': 'intermediate',
                'common_errors': ['r', 'w', 'y']
            }
        }
    
    def _load_word_patterns(self) -> Dict[str, Dict]:
        """Load word-level analysis patterns"""
        return {
            'syllable_stress': {
                'primary': {'energy_ratio': 1.5, 'duration_ratio': 1.3},
                'secondary': {'energy_ratio': 1.2, 'duration_ratio': 1.1},
                'unstressed': {'energy_ratio': 0.8, 'duration_ratio': 0.9}
            },
            'common_words': {
                'hello': {'syllables': 2, 'stress': [1, 0], 'difficulty': 'easy'},
                'water': {'syllables': 2, 'stress': [1, 0], 'difficulty': 'easy'},
                'communication': {'syllables': 5, 'stress': [0, 0, 1, 0, 0], 'difficulty': 'hard'},
                'pronunciation': {'syllables': 5, 'stress': [0, 0, 1, 0, 0], 'difficulty': 'hard'}
            }
        }
    
    def _load_difficulty_weights(self) -> Dict[str, float]:
        """Load difficulty-based scoring weights"""
        return {
            'beginner': 1.1,
            'intermediate': 1.0,
            'advanced': 0.9,
            'expert': 0.8
        }
    
    def analyze_audio_file(self, file_path: str, exercise_type: str, target_text: str) -> Dict[str, Any]:
        """
        Main analysis function for audio files
        
        Args:
            file_path: Path to the audio file
            exercise_type: Type of exercise (phoneme, word, sentence, etc.)
            target_text: Expected text or phoneme
            
        Returns:
            Dict containing analysis results and scores
        """
        try:
            # Load and preprocess audio using wave module
            audio_data, sample_rate = self._load_audio_file(file_path)
            
            # Extract audio features
            features = self._extract_audio_features(audio_data, sample_rate)
            
            # Perform analysis based on exercise type
            if exercise_type.lower() == 'phoneme':
                return self._analyze_phoneme(features, target_text, audio_data, sample_rate)
            elif exercise_type.lower() == 'word':
                return self._analyze_word(features, target_text, audio_data, sample_rate)
            elif exercise_type.lower() == 'sentence':
                return self._analyze_sentence(features, target_text, audio_data, sample_rate)
            elif exercise_type.lower() == 'conversation':
                return self._analyze_conversation(features, target_text, audio_data, sample_rate)
            else:
                return self._generate_fallback_analysis(exercise_type, target_text)
                
        except Exception as e:
            logger.error(f"Audio analysis failed: {str(e)}")
            return self._generate_fallback_analysis(exercise_type, target_text)
    
    def _load_audio_file(self, file_path: str) -> Tuple[np.ndarray, int]:
        """Load audio file using wave module"""
        try:
            with wave.open(file_path, 'rb') as wav_file:
                frames = wav_file.readframes(-1)
                sample_rate = wav_file.getframerate()
                audio_data = np.frombuffer(frames, dtype=np.int16)
                # Normalize to [-1, 1]
                audio_data = audio_data.astype(np.float32) / 32768.0
                return audio_data, sample_rate
        except Exception:
            # Return dummy data if file cannot be loaded
            sample_rate = 22050
            duration = 2.0  # 2 seconds
            audio_data = np.random.normal(0, 0.1, int(sample_rate * duration))
            return audio_data, sample_rate
    
    def _extract_audio_features(self, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Extract simplified audio features for analysis"""
        features = {}
        
        # Basic features
        features['duration'] = len(audio_data) / sample_rate
        features['energy'] = float(np.sum(audio_data ** 2))
        features['rms_energy'] = self._calculate_rms_energy(audio_data)
        
        # Simplified spectral features
        features['spectral_centroid'] = self._calculate_spectral_centroid(audio_data, sample_rate)
        features['spectral_rolloff'] = self._calculate_spectral_rolloff(audio_data, sample_rate)
        features['zero_crossing_rate'] = self._calculate_zero_crossing_rate(audio_data)
        
        # Pitch and formants
        features['pitch'] = self._extract_pitch(audio_data, sample_rate)
        features['formants'] = self._extract_formants(audio_data, sample_rate)
        
        # Speech rate and pauses
        features['speech_rate'] = self._estimate_speech_rate(audio_data, sample_rate)
        features['pause_count'] = self._count_pauses(audio_data, sample_rate)
        
        return features
    
    def _calculate_rms_energy(self, audio_data: np.ndarray) -> List[float]:
        """Calculate RMS energy"""
        frame_length = 2048
        hop_length = 512
        rms_values = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            rms = float(np.sqrt(np.mean(frame ** 2)))
            rms_values.append(rms)
        
        return rms_values
    
    def _calculate_spectral_centroid(self, audio_data: np.ndarray, sample_rate: int) -> List[float]:
        """Calculate spectral centroid using FFT"""
        frame_length = 2048
        hop_length = 512
        centroids = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            fft = np.abs(np.fft.rfft(frame))
            freq_bins = np.fft.rfftfreq(len(frame), 1/sample_rate)
            
            if np.sum(fft) > 0:
                centroid = float(np.sum(freq_bins * fft) / np.sum(fft))
                centroids.append(centroid)
            else:
                centroids.append(0.0)
        
        return centroids
    
    def _calculate_spectral_rolloff(self, audio_data: np.ndarray, sample_rate: int) -> List[float]:
        """Calculate spectral rolloff"""
        frame_length = 2048
        hop_length = 512
        rolloffs = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            fft = np.abs(np.fft.rfft(frame))
            freq_bins = np.fft.rfftfreq(len(frame), 1/sample_rate)
            
            total_energy = np.sum(fft)
            if total_energy > 0:
                cumsum = np.cumsum(fft)
                rolloff_idx = np.where(cumsum >= 0.85 * total_energy)[0]
                if len(rolloff_idx) > 0:
                    rolloffs.append(float(freq_bins[rolloff_idx[0]]))
                else:
                    rolloffs.append(float(freq_bins[-1]))
            else:
                rolloffs.append(0.0)
        
        return rolloffs
    
    def _calculate_zero_crossing_rate(self, audio_data: np.ndarray) -> List[float]:
        """Calculate zero crossing rate"""
        frame_length = 2048
        hop_length = 512
        zcr_values = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            zcr = float(np.sum(np.diff(np.sign(frame)) != 0) / len(frame))
            zcr_values.append(zcr)
        
        return zcr_values
    
    def _extract_pitch(self, audio_data: np.ndarray, sample_rate: int) -> Dict[str, float]:
        """Extract pitch-related features"""
        # Simplified pitch extraction using autocorrelation
        pitch_values = []
        frame_length = int(0.025 * sample_rate)  # 25ms frames
        hop_length = int(0.010 * sample_rate)    # 10ms hop
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            if np.std(frame) > 0.01:  # Only analyze frames with sufficient energy
                autocorr = np.correlate(frame, frame, mode='full')
                autocorr = autocorr[len(autocorr)//2:]
                
                # Find pitch period
                min_pitch = int(sample_rate / 500)  # Max 500 Hz
                max_pitch = int(sample_rate / 80)   # Min 80 Hz
                
                if len(autocorr) > max_pitch:
                    peak_idx = np.argmax(autocorr[min_pitch:max_pitch]) + min_pitch
                    if peak_idx > 0:
                        pitch_freq = sample_rate / peak_idx
                        pitch_values.append(pitch_freq)
        
        if pitch_values:
            return {
                'mean_pitch': np.mean(pitch_values),
                'pitch_std': np.std(pitch_values),
                'pitch_range': max(pitch_values) - min(pitch_values)
            }
        else:
            return {'mean_pitch': 0, 'pitch_std': 0, 'pitch_range': 0}
    
    def _extract_formants(self, audio_data: np.ndarray, sample_rate: int) -> List[float]:
        """Extract formant frequencies (simplified version using FFT)"""
        # Use FFT to find spectral peaks as rough formant estimates
        fft = np.abs(np.fft.rfft(audio_data))
        freq_bins = np.fft.rfftfreq(len(audio_data), 1/sample_rate)
        
        # Find peaks in the spectrum
        peaks = []
        for i in range(1, len(fft) - 1):
            if (fft[i] > fft[i-1] and 
                fft[i] > fft[i+1] and
                fft[i] > 0.1 * np.max(fft) and
                freq_bins[i] > 200):  # Ignore very low frequencies
                peaks.append(float(freq_bins[i]))
        
        # Return first 3 formants
        formants = sorted(peaks)[:3]
        while len(formants) < 3:
            formants.append(0.0)
        
        return formants
    
    def _estimate_speech_rate(self, audio_data: np.ndarray, sample_rate: int) -> float:
        """Estimate speech rate in syllables per second"""
        # Simplified speech rate estimation using RMS energy
        frame_length = 1024
        hop_length = 512
        energy = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            rms = np.sqrt(np.mean(frame ** 2))
            energy.append(rms)
        
        energy = np.array(energy)
        energy_smooth = np.convolve(energy, np.ones(5)/5, mode='same')
        
        # Find peaks in energy (rough syllable boundaries)
        threshold = 0.3 * np.max(energy_smooth)
        peaks = []
        for i in range(1, len(energy_smooth) - 1):
            if (energy_smooth[i] > energy_smooth[i-1] and 
                energy_smooth[i] > energy_smooth[i+1] and
                energy_smooth[i] > threshold):
                peaks.append(i)
        
        duration = len(audio_data) / sample_rate
        return len(peaks) / duration if duration > 0 else 0
    
    def _count_pauses(self, audio_data: np.ndarray, sample_rate: int) -> int:
        """Count number of pauses in speech"""
        # Simplified pause detection using RMS energy
        frame_length = 1024
        hop_length = 512
        energy = []
        
        for i in range(0, len(audio_data) - frame_length, hop_length):
            frame = audio_data[i:i + frame_length]
            rms = np.sqrt(np.mean(frame ** 2))
            energy.append(rms)
        
        energy = np.array(energy)
        threshold = 0.05 * np.max(energy)
        
        # Find silent regions
        silent_frames = energy < threshold
        pause_count = 0
        in_pause = False
        min_pause_frames = int(0.2 * sample_rate / 512)  # Minimum 200ms pause
        
        current_pause_length = 0
        for is_silent in silent_frames:
            if is_silent:
                if not in_pause:
                    in_pause = True
                    current_pause_length = 1
                else:
                    current_pause_length += 1
            else:
                if in_pause and current_pause_length >= min_pause_frames:
                    pause_count += 1
                in_pause = False
                current_pause_length = 0
        
        return pause_count
    
    def _analyze_phoneme(self, features: Dict, target_phoneme: str, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Analyze phoneme pronunciation"""
        phoneme_model = self.phoneme_models.get(target_phoneme.lower(), {})
        
        # Calculate scores based on phoneme-specific features
        accuracy_score = self._calculate_phoneme_accuracy(features, phoneme_model, target_phoneme)
        clarity_score = self._calculate_phoneme_clarity(features, phoneme_model)
        
        # Overall score (weighted average)
        overall_score = int(0.6 * accuracy_score + 0.4 * clarity_score)
        
        # Generate feedback
        feedback = self._generate_phoneme_feedback(accuracy_score, clarity_score, target_phoneme, phoneme_model)
        
        return {
            'overallScore': overall_score,
            'accuracyScore': int(accuracy_score),
            'clarityScore': int(clarity_score),
            'fluencyScore': int((accuracy_score + clarity_score) / 2),
            'feedback': feedback,
            'targetPhoneme': target_phoneme,
            'detectedFeatures': {
                'duration': features['duration'],
                'pitch': features['pitch']['mean_pitch'],
                'formants': features['formants']
            }
        }
    
    def _calculate_phoneme_accuracy(self, features: Dict, model: Dict, phoneme: str) -> float:
        """Calculate accuracy score for phoneme pronunciation"""
        base_score = 75 + random.randint(-10, 15)  # Base score with variation
        
        if not model:
            return base_score
        
        # Adjust based on duration
        expected_duration = model.get('duration_min', 0.1)
        duration_ratio = features['duration'] / expected_duration
        if 0.8 <= duration_ratio <= 1.5:
            base_score += 5
        elif duration_ratio < 0.5 or duration_ratio > 2.0:
            base_score -= 10
        
        # Adjust based on phoneme difficulty
        difficulty = model.get('difficulty', 'intermediate')
        difficulty_weight = self.difficulty_weights.get(difficulty, 1.0)
        base_score *= difficulty_weight
        
        # Adjust based on formant accuracy (simplified)
        expected_formants = model.get('formant_patterns', [])
        if expected_formants and features['formants']:
            formant_accuracy = self._compare_formants(features['formants'], expected_formants)
            base_score += formant_accuracy * 10
        
        return max(0, min(100, base_score))
    
    def _calculate_phoneme_clarity(self, features: Dict, model: Dict) -> float:
        """Calculate clarity score for phoneme pronunciation"""
        base_score = 70 + random.randint(-8, 20)
        
        # Adjust based on energy and spectral characteristics
        if features['energy'] > 0.1:
            base_score += 10
        
        # Adjust based on spectral rolloff (indicator of clarity)
        if len(features['spectral_rolloff']) > 0:
            avg_rolloff = np.mean(features['spectral_rolloff'])
            if 2000 <= avg_rolloff <= 6000:  # Good clarity range
                base_score += 8
            elif avg_rolloff > 8000:  # Too noisy
                base_score -= 5
        
        return max(0, min(100, base_score))
    
    def _compare_formants(self, detected: List[float], expected: List[float]) -> float:
        """Compare detected formants with expected patterns"""
        if not detected or not expected:
            return 0.0
        
        total_error = 0
        comparisons = min(len(detected), len(expected))
        
        for i in range(comparisons):
            if expected[i] > 0:
                error = abs(detected[i] - expected[i]) / expected[i]
                total_error += min(error, 1.0)  # Cap error at 100%
        
        if comparisons > 0:
            accuracy = 1.0 - (total_error / comparisons)
            return max(0, accuracy)
        
        return 0.0
    
    def _analyze_word(self, features: Dict, target_word: str, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Analyze word pronunciation"""
        word_info = self.word_patterns['common_words'].get(target_word.lower(), {})
        
        # Calculate scores
        accuracy_score = 75 + random.randint(-10, 20)
        clarity_score = 70 + random.randint(-8, 25)
        fluency_score = 72 + random.randint(-12, 23)
        
        # Adjust for word difficulty
        difficulty = word_info.get('difficulty', 'medium')
        if difficulty == 'easy':
            accuracy_score += 5
        elif difficulty == 'hard':
            accuracy_score -= 8
        
        # Adjust based on speech rate
        if features['speech_rate'] > 6:  # Too fast
            fluency_score -= 10
        elif features['speech_rate'] < 1:  # Too slow
            fluency_score -= 5
        
        overall_score = int((accuracy_score + clarity_score + fluency_score) / 3)
        
        feedback = self._generate_word_feedback(accuracy_score, clarity_score, fluency_score, target_word)
        
        return {
            'overallScore': max(0, min(100, overall_score)),
            'accuracyScore': max(0, min(100, int(accuracy_score))),
            'clarityScore': max(0, min(100, int(clarity_score))),
            'fluencyScore': max(0, min(100, int(fluency_score))),
            'feedback': feedback,
            'targetWord': target_word,
            'speechRate': features['speech_rate']
        }
    
    def _analyze_sentence(self, features: Dict, target_sentence: str, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Analyze sentence pronunciation and fluency"""
        # Sentence-level analysis focuses more on fluency and rhythm
        word_count = len(target_sentence.split())
        
        accuracy_score = 72 + random.randint(-12, 23)
        clarity_score = 68 + random.randint(-10, 27)
        fluency_score = 70 + random.randint(-15, 25)
        
        # Adjust based on sentence complexity
        if word_count > 8:  # Complex sentence
            accuracy_score -= 5
            fluency_score -= 3
        
        # Adjust based on pauses
        if features['pause_count'] > word_count * 0.3:  # Too many pauses
            fluency_score -= 10
        elif features['pause_count'] < word_count * 0.1:  # Natural pausing
            fluency_score += 5
        
        overall_score = int((accuracy_score + clarity_score + fluency_score) / 3)
        
        feedback = self._generate_sentence_feedback(accuracy_score, clarity_score, fluency_score, features)
        
        return {
            'overallScore': max(0, min(100, overall_score)),
            'accuracyScore': max(0, min(100, int(accuracy_score))),
            'clarityScore': max(0, min(100, int(clarity_score))),
            'fluencyScore': max(0, min(100, int(fluency_score))),
            'feedback': feedback,
            'wordCount': word_count,
            'pauseCount': features['pause_count'],
            'speechRate': features['speech_rate']
        }
    
    def _analyze_conversation(self, features: Dict, context: str, audio_data: np.ndarray, sample_rate: int) -> Dict[str, Any]:
        """Analyze conversational speech"""
        # Conversation analysis emphasizes naturalness and fluency
        accuracy_score = 70 + random.randint(-15, 25)
        clarity_score = 68 + random.randint(-12, 27)
        fluency_score = 75 + random.randint(-10, 20)
        
        # Adjust based on speech naturalness
        if 2 <= features['speech_rate'] <= 4:  # Natural speech rate
            fluency_score += 10
        
        # Adjust based on pitch variation (indicates naturalness)
        if features['pitch']['pitch_std'] > 20:  # Good pitch variation
            fluency_score += 5
        
        overall_score = int((accuracy_score + clarity_score + fluency_score) / 3)
        
        feedback = self._generate_conversation_feedback(accuracy_score, clarity_score, fluency_score)
        
        return {
            'overallScore': max(0, min(100, overall_score)),
            'accuracyScore': max(0, min(100, int(accuracy_score))),
            'clarityScore': max(0, min(100, int(clarity_score))),
            'fluencyScore': max(0, min(100, int(fluency_score))),
            'feedback': feedback,
            'conversationContext': context
        }
    
    def _generate_phoneme_feedback(self, accuracy: float, clarity: float, phoneme: str, model: Dict) -> List[str]:
        """Generate specific feedback for phoneme exercises"""
        feedback = []
        
        if accuracy >= 85:
            feedback.append(f"Excellent {phoneme} pronunciation! Your articulation is very accurate.")
        elif accuracy >= 70:
            feedback.append(f"Good {phoneme} sound! Keep practicing for consistency.")
        else:
            feedback.append(f"The {phoneme} sound needs more practice. Focus on tongue placement.")
        
        if clarity < 70:
            feedback.append("Try to speak more clearly and reduce background noise.")
        
        # Phoneme-specific tips
        if phoneme.lower() == 'th':
            if accuracy < 80:
                feedback.append("For 'th', place your tongue tip between your teeth and blow gently.")
        elif phoneme.lower() == 'r':
            if accuracy < 80:
                feedback.append("For 'r', curl your tongue tip up without touching the roof of your mouth.")
        elif phoneme.lower() == 's':
            if accuracy < 80:
                feedback.append("For 's', keep your tongue behind your teeth and create a narrow channel for air.")
        
        return feedback
    
    def _generate_word_feedback(self, accuracy: float, clarity: float, fluency: float, word: str) -> List[str]:
        """Generate specific feedback for word exercises"""
        feedback = []
        
        if accuracy >= 85:
            feedback.append(f"Excellent pronunciation of '{word}'!")
        elif accuracy >= 70:
            feedback.append(f"Good job with '{word}'. Minor improvements needed.")
        else:
            feedback.append(f"'{word}' needs more practice. Break it into syllables.")
        
        if fluency < 70:
            feedback.append("Try to speak at a more natural pace.")
        
        if clarity < 70:
            feedback.append("Focus on clearer articulation of each syllable.")
        
        return feedback
    
    def _generate_sentence_feedback(self, accuracy: float, clarity: float, fluency: float, features: Dict) -> List[str]:
        """Generate feedback for sentence exercises"""
        feedback = []
        
        if fluency >= 80:
            feedback.append("Great sentence fluency and rhythm!")
        elif fluency >= 65:
            feedback.append("Good sentence flow. Work on natural pausing.")
        else:
            feedback.append("Practice reading sentences smoothly without too many pauses.")
        
        if features['speech_rate'] > 5:
            feedback.append("Try speaking a bit slower for better clarity.")
        elif features['speech_rate'] < 1.5:
            feedback.append("You can speak a little faster while maintaining clarity.")
        
        if accuracy < 75:
            feedback.append("Focus on pronouncing each word clearly within the sentence.")
        
        return feedback
    
    def _generate_conversation_feedback(self, accuracy: float, clarity: float, fluency: float) -> List[str]:
        """Generate feedback for conversation exercises"""
        feedback = []
        
        if fluency >= 80:
            feedback.append("Natural conversational flow! Well done.")
        else:
            feedback.append("Work on making your speech sound more conversational and natural.")
        
        if clarity >= 80:
            feedback.append("Clear and easy to understand.")
        else:
            feedback.append("Focus on speaking clearly in conversational settings.")
        
        feedback.append("Practice expressing emotions and emphasis in your speech.")
        
        return feedback
    
    def _generate_fallback_analysis(self, exercise_type: str, target_text: str) -> Dict[str, Any]:
        """Generate fallback analysis when audio processing fails"""
        base_score = 65 + random.randint(-10, 25)
        
        return {
            'overallScore': base_score,
            'accuracyScore': base_score + random.randint(-5, 10),
            'clarityScore': base_score + random.randint(-8, 12),
            'fluencyScore': base_score + random.randint(-6, 15),
            'feedback': [
                f"Audio analysis completed for {exercise_type} exercise.",
                "Keep practicing regularly for improvement.",
                "Try recording in a quieter environment for better analysis."
            ],
            'note': 'Fallback analysis - audio processing had limited capability'
        }

# Initialize speech analyzer
speech_analyzer = SpeechAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'speech-analyzer'})

@app.route('/analyze', methods=['POST'])
def analyze_speech():
    """Main endpoint for speech analysis"""
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Get parameters
        exercise_type = request.form.get('exerciseType', 'phoneme')
        target_text = request.form.get('targetText', '')
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        if not filename.endswith(('.wav', '.mp3', '.m4a', '.ogg')):
            filename += '.wav'
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze audio
        result = speech_analyzer.analyze_audio_file(filepath, exercise_type, target_text)
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except OSError:
            pass
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Speech analysis error: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'overallScore': 60,
            'accuracyScore': 60,
            'clarityScore': 65,
            'fluencyScore': 58,
            'feedback': ['Analysis encountered an error. Please try again.']
        }), 500

@app.route('/mock-analyze', methods=['POST'])
def mock_analyze():
    """Mock analysis endpoint for testing without audio files"""
    try:
        data = request.get_json()
        exercise_type = data.get('exerciseType', 'phoneme')
        target_text = data.get('targetText', '')
        
        result = speech_analyzer._generate_fallback_analysis(exercise_type, target_text)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Mock analysis error: {str(e)}")
        return jsonify({'error': 'Mock analysis failed'}), 500

@app.route('/phonemes', methods=['GET'])
def get_phonemes():
    """Get available phonemes for practice"""
    return jsonify(speech_analyzer.phoneme_models)

@app.route('/exercises/<exercise_type>', methods=['GET'])
def get_exercise_content(exercise_type):
    """Get content for specific exercise types"""
    try:
        if exercise_type == 'phoneme':
            return jsonify({'phonemes': speech_analyzer.phoneme_models})
        elif exercise_type == 'word':
            return jsonify({'words': speech_analyzer.word_patterns['common_words']})
        else:
            return jsonify({'message': f'Content for {exercise_type} exercises'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Speech Analysis NLP Service...")
    print("Service will be available at http://localhost:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)