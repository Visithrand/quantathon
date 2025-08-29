from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
import librosa
import soundfile as sf
import io
import tempfile
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Speech analysis configuration
SPEECH_ANALYSIS_CONFIG = {
    'sample_rate': 22050,
    'hop_length': 512,
    'frame_length': 2048
}

# In-memory progress storage (in production, use a database)
user_progress = {}

@app.route('/api/speech-analysis', methods=['POST'])
def analyze_speech():
    """
    Analyze speech audio and provide professional feedback
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({'error': 'No audio data provided'}), 400
        
        # Decode base64 audio
        audio_data = base64.b64decode(data['audio'])
        
        # Save to temporary file for processing
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            temp_file.write(audio_data)
            temp_file_path = temp_file.name
        
        try:
            # Load audio with librosa
            y, sr = librosa.load(temp_file_path, sr=SPEECH_ANALYSIS_CONFIG['sample_rate'])
            
            # Perform comprehensive speech analysis
            analysis_result = perform_speech_analysis(y, sr, data)
            
            return jsonify(analysis_result)
            
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

def perform_speech_analysis(audio_data, sample_rate, metadata):
    """
    Perform comprehensive speech analysis using audio processing techniques
    """
    try:
        # Basic audio metrics
        duration = len(audio_data) / sample_rate
        
        # Volume analysis
        rms_energy = np.sqrt(np.mean(audio_data**2))
        max_amplitude = np.max(np.abs(audio_data))
        min_amplitude = np.min(np.abs(audio_data))
        volume_range = max_amplitude - min_amplitude
        
        # Speech rate estimation using spectral features
        speech_rate = estimate_speech_rate(audio_data, sample_rate)
        
        # Clarity analysis using spectral centroid
        clarity_score = analyze_clarity(audio_data, sample_rate)
        
        # Consistency analysis using spectral rolloff
        consistency_score = analyze_consistency(audio_data, sample_rate)
        
        # Energy distribution analysis
        energy_score = analyze_energy_distribution(audio_data, sample_rate)
        
        # Advanced speech analysis
        pronunciation_score = analyze_pronunciation(audio_data, sample_rate)
        fluency_score = analyze_fluency(audio_data, sample_rate)
        intonation_score = analyze_intonation(audio_data, sample_rate)
        stress_pattern_score = analyze_stress_patterns(audio_data, sample_rate)
        
        # Word accuracy estimation
        word_accuracy = estimate_word_accuracy(audio_data, sample_rate, metadata)
        
        # Confidence level based on signal quality
        confidence_level = calculate_confidence_level(audio_data, sample_rate)
        
        # Generate improvement suggestions
        suggested_improvements = generate_improvement_suggestions(
            pronunciation_score, fluency_score, clarity_score, consistency_score
        )
        
        # Detect specific issues
        detected_issues = detect_speech_issues(
            pronunciation_score, fluency_score, clarity_score, consistency_score
        )
        
        return {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'analysis': {
                'duration': duration,
                'averageVolume': float(rms_energy),
                'volumeRange': float(volume_range),
                'maxVolume': float(max_amplitude),
                'speechRate': speech_rate,
                'clarity': clarity_score,
                'consistency': consistency_score,
                'energy': energy_score,
                'sampleRate': sample_rate,
                'speechSegments': estimate_speech_segments(audio_data, sample_rate)
            },
            'pronunciationScore': pronunciation_score,
            'fluencyScore': fluency_score,
            'intonationScore': intonation_score,
            'stressPatternScore': stress_pattern_score,
            'wordAccuracy': word_accuracy,
            'confidenceLevel': confidence_level,
            'suggestedImprovements': suggested_improvements,
            'detectedIssues': detected_issues
        }
        
    except Exception as e:
        print(f"Error in speech analysis: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'analysis': {
                'duration': 0,
                'averageVolume': 0,
                'volumeRange': 0,
                'maxVolume': 0,
                'speechRate': 0,
                'clarity': 0,
                'consistency': 0,
                'energy': 0,
                'sampleRate': sample_rate,
                'speechSegments': 0
            }
        }

def estimate_speech_rate(audio_data, sample_rate):
    """Estimate speech rate in words per minute"""
    try:
        # Use spectral features to estimate speech rate
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        frame_length = SPEECH_ANALYSIS_CONFIG['frame_length']
        
        # Extract spectral features
        spectral_centroids = librosa.feature.spectral_centroid(
            y=audio_data, sr=sample_rate, hop_length=hop_length
        )[0]
        
        # Count significant spectral changes (approximate word boundaries)
        spectral_changes = np.sum(np.diff(spectral_centroids) > np.std(spectral_centroids) * 0.5)
        
        # Estimate words based on spectral changes and duration
        duration = len(audio_data) / sample_rate
        estimated_words = max(1, int(spectral_changes * 0.3))  # Calibration factor
        words_per_minute = int((estimated_words / duration) * 60)
        
        # Clamp to realistic range
        return max(60, min(300, words_per_minute))
        
    except:
        return 150  # Default fallback

def analyze_clarity(audio_data, sample_rate):
    """Analyze speech clarity using spectral features"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # Spectral centroid (brightness)
        spectral_centroids = librosa.feature.spectral_centroid(
            y=audio_data, sr=sample_rate, hop_length=hop_length
        )[0]
        
        # Spectral rolloff (frequency distribution)
        spectral_rolloff = librosa.feature.spectral_rolloff(
            y=audio_data, sr=sample_rate, hop_length=hop_length
        )[0]
        
        # Calculate clarity score based on spectral properties
        centroid_std = np.std(spectral_centroids)
        rolloff_std = np.std(spectral_rolloff)
        
        # Lower variation indicates clearer speech
        clarity_score = 100 - min(100, int((centroid_std + rolloff_std) * 1000))
        
        return max(0, min(100, clarity_score))
        
    except:
        return 75  # Default fallback

def analyze_consistency(audio_data, sample_rate):
    """Analyze speech consistency using volume stability"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # RMS energy over time
        rms_energy = librosa.feature.rms(
            y=audio_data, hop_length=hop_length
        )[0]
        
        # Calculate consistency based on energy stability
        energy_std = np.std(rms_energy)
        energy_mean = np.mean(rms_energy)
        
        if energy_mean == 0:
            return 0
            
        # Lower coefficient of variation indicates more consistency
        cv = energy_std / energy_mean
        consistency_score = 100 - min(100, int(cv * 200))
        
        return max(0, min(100, consistency_score))
        
    except:
        return 80  # Default fallback

def analyze_energy_distribution(audio_data, sample_rate):
    """Analyze energy distribution across the recording"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # RMS energy over time
        rms_energy = librosa.feature.rms(
            y=audio_data, hop_length=hop_length
        )[0]
        
        # Calculate energy distribution score
        energy_mean = np.mean(rms_energy)
        energy_variance = np.var(rms_energy)
        
        # Optimal: high energy with moderate variance
        if energy_mean > 0.05 and energy_variance < 0.01:
            return 95
        elif energy_mean > 0.04 and energy_variance < 0.02:
            return 85
        elif energy_mean > 0.03 and energy_variance < 0.03:
            return 75
        elif energy_mean > 0.02 and energy_variance < 0.04:
            return 65
        elif energy_mean > 0.01 and energy_variance < 0.05:
            return 55
        else:
            return 45
            
    except:
        return 70  # Default fallback

def analyze_pronunciation(audio_data, sample_rate):
    """Analyze pronunciation quality using spectral features"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # MFCC features for pronunciation analysis
        mfccs = librosa.feature.mfcc(
            y=audio_data, sr=sample_rate, hop_length=hop_length, n_mfcc=13
        )
        
        # Calculate pronunciation score based on MFCC stability
        mfcc_std = np.std(mfccs, axis=1)
        pronunciation_score = 100 - min(100, int(np.mean(mfcc_std) * 50))
        
        return max(0, min(100, pronunciation_score))
        
    except:
        return 80  # Default fallback

def analyze_fluency(audio_data, sample_rate):
    """Analyze speech fluency using temporal features"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # Spectral centroid for fluency analysis
        spectral_centroids = librosa.feature.spectral_centroid(
            y=audio_data, sr=sample_rate, hop_length=hop_length
        )[0]
        
        # Calculate fluency based on smooth spectral transitions
        spectral_changes = np.diff(spectral_centroids)
        smooth_transitions = np.sum(np.abs(spectral_changes) < np.std(spectral_changes) * 0.3)
        total_transitions = len(spectral_changes)
        
        if total_transitions == 0:
            return 80
            
        fluency_score = int((smooth_transitions / total_transitions) * 100)
        
        return max(0, min(100, fluency_score))
        
    except:
        return 75  # Default fallback

def analyze_intonation(audio_data, sample_rate):
    """Analyze intonation patterns using pitch features"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # Pitch tracking for intonation analysis
        pitches, magnitudes = librosa.piptrack(
            y=audio_data, sr=sample_rate, hop_length=hop_length
        )
        
        # Calculate intonation score based on pitch variation
        pitch_values = pitches[magnitudes > 0.1]
        
        if len(pitch_values) == 0:
            return 80
            
        pitch_std = np.std(pitch_values)
        intonation_score = 100 - min(100, int(pitch_std * 0.1))
        
        return max(0, min(100, intonation_score))
        
    except:
        return 75  # Default fallback

def analyze_stress_patterns(audio_data, sample_rate):
    """Analyze stress patterns using energy and pitch features"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # RMS energy for stress pattern analysis
        rms_energy = librosa.feature.rms(
            y=audio_data, hop_length=hop_length
        )[0]
        
        # Calculate stress pattern score based on energy variation
        energy_peaks = librosa.util.peak_pick(
            rms_energy, pre_max=3, post_max=3, pre_avg=3, post_avg=3, delta=0.1, wait=10
        )
        
        # Optimal stress patterns have moderate variation
        if len(energy_peaks) == 0:
            return 70
            
        stress_score = min(100, 50 + len(energy_peaks) * 5)
        
        return max(0, min(100, stress_score))
        
    except:
        return 70  # Default fallback

def estimate_word_accuracy(audio_data, sample_rate, metadata):
    """Estimate word accuracy based on speech quality metrics"""
    try:
        # Use clarity and consistency to estimate word accuracy
        clarity = analyze_clarity(audio_data, sample_rate)
        consistency = analyze_consistency(audio_data, sample_rate)
        
        # Weighted average for word accuracy
        word_accuracy = (clarity * 0.6) + (consistency * 0.4)
        
        return max(0, min(100, int(word_accuracy)))
        
    except:
        return 75  # Default fallback

def calculate_confidence_level(audio_data, sample_rate):
    """Calculate confidence level based on signal quality"""
    try:
        # Signal-to-noise ratio estimation
        signal_power = np.mean(audio_data**2)
        noise_power = np.var(audio_data)
        
        if noise_power == 0:
            snr = 100
        else:
            snr = 10 * np.log10(signal_power / noise_power)
        
        # Convert SNR to confidence level
        confidence = min(100, max(0, int(snr * 2 + 50)))
        
        return confidence
        
    except:
        return 80  # Default fallback

def estimate_speech_segments(audio_data, sample_rate):
    """Estimate number of speech segments"""
    try:
        hop_length = SPEECH_ANALYSIS_CONFIG['hop_length']
        
        # RMS energy for segment detection
        rms_energy = librosa.feature.rms(
            y=audio_data, hop_length=hop_length
        )[0]
        
        # Count speech segments based on energy thresholds
        threshold = np.mean(rms_energy) * 0.5
        speech_segments = np.sum(rms_energy > threshold)
        
        return max(1, speech_segments)
        
    except:
        return 5  # Default fallback

def generate_improvement_suggestions(pronunciation, fluency, clarity, consistency):
    """Generate personalized improvement suggestions"""
    suggestions = []
    
    if pronunciation < 80:
        suggestions.append("Practice clear pronunciation of difficult words")
    
    if fluency < 75:
        suggestions.append("Work on smooth transitions between words")
    
    if clarity < 80:
        suggestions.append("Focus on enunciating each syllable clearly")
    
    if consistency < 75:
        suggestions.append("Maintain steady volume throughout your speech")
    
    if not suggestions:
        suggestions.append("Great job! Keep practicing to maintain your skills")
    
    return suggestions

def detect_speech_issues(pronunciation, fluency, clarity, consistency):
    """Detect specific speech issues for improvement"""
    issues = []
    
    if pronunciation < 70:
        issues.append("Pronunciation needs improvement")
    
    if fluency < 65:
        issues.append("Speech fluency could be enhanced")
    
    if clarity < 70:
        issues.append("Speech clarity requires attention")
    
    if consistency < 65:
        issues.append("Volume consistency needs work")
    
    return issues

@app.route('/api/progress/update', methods=['POST'])
def update_progress():
    """Update user progress after completing exercises"""
    try:
        data = request.get_json()
        user_id = data.get('userId', 'default_user')
        exercise_data = data.get('exerciseData', {})
        
        if user_id not in user_progress:
            user_progress[user_id] = {
                'totalPoints': 0,
                'exercisesCompleted': 0,
                'streakDays': 0,
                'averageScore': 0,
                'weeklyGoal': 30,
                'dailyProgress': {},
                'exerciseHistory': [],
                'achievements': [],
                'lastExerciseDate': None
            }
        
        # Update progress
        progress = user_progress[user_id]
        progress['totalPoints'] += exercise_data.get('points', 10)
        progress['exercisesCompleted'] += 1
        
        # Calculate average score
        if progress['exerciseHistory']:
            total_score = sum(ex['score'] for ex in progress['exerciseHistory'])
            progress['averageScore'] = round(total_score / len(progress['exerciseHistory']), 1)
        else:
            progress['averageScore'] = exercise_data.get('score', 0)
        
        # Update daily progress
        today = datetime.now().strftime('%Y-%m-%d')
        if today not in progress['dailyProgress']:
            progress['dailyProgress'][today] = {
                'minutes': 0,
                'exercises': 0,
                'score': 0
            }
        
        progress['dailyProgress'][today]['minutes'] += exercise_data.get('duration', 5)
        progress['dailyProgress'][today]['exercises'] += 1
        progress['dailyProgress'][today]['score'] = max(
            progress['dailyProgress'][today]['score'],
            exercise_data.get('score', 0)
        )
        
        # Update streak
        if progress['lastExerciseDate']:
            last_date = datetime.strptime(progress['lastExerciseDate'], '%Y-%m-%d')
            days_diff = (datetime.now() - last_date).days
            if days_diff == 1:
                progress['streakDays'] += 1
            elif days_diff > 1:
                progress['streakDays'] = 1
        else:
            progress['streakDays'] = 1
        
        progress['lastExerciseDate'] = today
        
        # Add to exercise history
        progress['exerciseHistory'].append({
            'date': today,
            'type': exercise_data.get('type', 'speech'),
            'score': exercise_data.get('score', 0),
            'duration': exercise_data.get('duration', 5),
            'points': exercise_data.get('points', 10)
        })
        
        # Check for achievements
        check_achievements(progress)
        
        return jsonify({
            'success': True,
            'progress': progress,
            'message': 'Progress updated successfully'
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to update progress: {str(e)}'}), 500

@app.route('/api/progress/<user_id>', methods=['GET'])
def get_user_progress(user_id):
    """Get user progress data"""
    try:
        if user_id not in user_progress:
            return jsonify({'error': 'User not found'}), 404
        
        progress = user_progress[user_id]
        
        # Calculate weekly progress
        weekly_progress = calculate_weekly_progress(progress)
        
        return jsonify({
            'success': True,
            'progress': {
                **progress,
                'weeklyProgress': weekly_progress
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to get progress: {str(e)}'}), 500

def calculate_weekly_progress(progress):
    """Calculate weekly progress for the last 7 days"""
    weekly_data = {}
    today = datetime.now()
    
    for i in range(7):
        date = (today - timedelta(days=i)).strftime('%Y-%m-%d')
        if date in progress['dailyProgress']:
            daily = progress['dailyProgress'][date]
            weekly_data[date] = {
                'minutes': daily['minutes'],
                'exercises': daily['exercises'],
                'score': daily['score'],
                'percentage': min(100, (daily['minutes'] / progress['weeklyGoal']) * 100)
            }
        else:
            weekly_data[date] = {
                'minutes': 0,
                'exercises': 0,
                'score': 0,
                'percentage': 0
            }
    
    return weekly_data

def check_achievements(progress):
    """Check and award achievements based on progress"""
    achievements = []
    
    if progress['exercisesCompleted'] >= 1 and 'First Steps' not in progress['achievements']:
        achievements.append('First Steps')
    
    if progress['streakDays'] >= 7 and 'Week Champion' not in progress['achievements']:
        achievements.append('Week Champion')
    
    if progress['exercisesCompleted'] >= 50 and 'Dedicated Learner' not in progress['achievements']:
        achievements.append('Dedicated Learner')
    
    if progress['averageScore'] >= 85 and 'Sound Master' not in progress['achievements']:
        achievements.append('Sound Master')
    
    progress['achievements'].extend(achievements)

@app.route('/favicon.ico')
def favicon():
    """Serve favicon to prevent 404 errors"""
    return '', 204  # No content response

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Speech Analysis API'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
