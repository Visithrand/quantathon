"""
Audio processing utilities for speech therapy application
"""
import streamlit as st
import io
import numpy as np
from typing import Dict, List, Optional, Tuple
import json

class AudioProcessor:
    """Handles audio processing tasks including recording, analysis, and feature extraction"""
    
    def __init__(self):
        self.sample_rate = 44100  # Standard sample rate
        self.chunk_size = 1024
        self.audio_format = "wav"
        
    def validate_audio(self, audio_bytes: bytes) -> bool:
        """
        Validate audio input for processing
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            bool: True if audio is valid for processing
        """
        if not audio_bytes or len(audio_bytes) < 1000:  # Minimum audio length
            return False
            
        # Additional validation can be added here
        # e.g., check audio format, duration, etc.
        return True
    
    def extract_audio_features(self, audio_bytes: bytes) -> Dict:
        """
        Extract basic audio features for analysis
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            Dict: Dictionary containing extracted features
        """
        # In a real implementation, this would use librosa or similar
        # For now, we'll return mock features for demonstration
        
        if not self.validate_audio(audio_bytes):
            return {
                'duration': 0,
                'amplitude': 0,
                'frequency_stats': {},
                'energy': 0,
                'valid': False
            }
        
        # Mock feature extraction
        # In real implementation, convert bytes to numpy array and analyze
        mock_duration = len(audio_bytes) / (self.sample_rate * 2)  # Rough estimate
        
        features = {
            'duration': mock_duration,
            'amplitude': np.random.uniform(0.3, 0.8),  # Mock amplitude
            'frequency_stats': {
                'mean_frequency': np.random.uniform(150, 300),
                'frequency_range': np.random.uniform(50, 150),
                'dominant_frequency': np.random.uniform(200, 400)
            },
            'energy': np.random.uniform(0.4, 0.9),
            'pitch_stability': np.random.uniform(0.6, 0.9),
            'voice_quality': np.random.uniform(0.5, 0.8),
            'valid': True
        }
        
        return features
    
    def analyze_pronunciation_quality(self, audio_bytes: bytes, target_phoneme: str = None) -> Dict:
        """
        Analyze pronunciation quality of audio input
        
        Args:
            audio_bytes: Raw audio data in bytes
            target_phoneme: Expected phoneme if analyzing specific sound
            
        Returns:
            Dict: Pronunciation quality metrics
        """
        features = self.extract_audio_features(audio_bytes)
        
        if not features['valid']:
            return {
                'overall_quality': 0,
                'clarity': 0,
                'accuracy': 0,
                'confidence': 0,
                'error': 'Invalid audio input'
            }
        
        # Mock pronunciation analysis
        # In real implementation, this would use speech recognition and phonetic analysis
        
        base_quality = np.random.uniform(0.6, 0.9)
        
        # Adjust based on audio features
        duration_factor = min(1.0, features['duration'] / 2.0)  # Optimal around 2 seconds
        amplitude_factor = features['amplitude']
        energy_factor = features['energy']
        
        overall_quality = base_quality * duration_factor * amplitude_factor * energy_factor
        
        analysis = {
            'overall_quality': min(100, int(overall_quality * 100)),
            'clarity': min(100, int((features['amplitude'] * features['energy']) * 100)),
            'accuracy': min(100, int(base_quality * 100)),
            'confidence': min(100, int(features['pitch_stability'] * 100)),
            'pronunciation_score': min(100, int(overall_quality * 100)),
            'detected_issues': self._identify_potential_issues(features),
            'improvement_suggestions': self._generate_improvement_suggestions(features, target_phoneme)
        }
        
        return analysis
    
    def analyze_fluency(self, audio_bytes: bytes, expected_text: str = None) -> Dict:
        """
        Analyze speech fluency including pace, rhythm, and flow
        
        Args:
            audio_bytes: Raw audio data in bytes
            expected_text: Expected text if analyzing specific content
            
        Returns:
            Dict: Fluency analysis results
        """
        features = self.extract_audio_features(audio_bytes)
        
        if not features['valid']:
            return {
                'fluency_score': 0,
                'pace_score': 0,
                'rhythm_score': 0,
                'error': 'Invalid audio input'
            }
        
        # Mock fluency analysis
        # In real implementation, this would analyze speech rate, pauses, rhythm, etc.
        
        duration = features['duration']
        estimated_words = len(expected_text.split()) if expected_text else int(duration * 2)  # ~2 words per second
        
        # Calculate speaking rate
        words_per_minute = (estimated_words / duration) * 60 if duration > 0 else 0
        
        # Optimal WPM is around 150-180
        pace_score = 100 - abs(words_per_minute - 165) * 2  # Penalty for deviation from optimal
        pace_score = max(0, min(100, pace_score))
        
        rhythm_score = int(features['pitch_stability'] * 100)
        
        # Calculate overall fluency
        fluency_score = (pace_score + rhythm_score + features['energy'] * 100) / 3
        
        analysis = {
            'fluency_score': int(fluency_score),
            'pace_score': int(pace_score),
            'rhythm_score': rhythm_score,
            'speaking_rate': words_per_minute,
            'optimal_rate_range': [150, 180],
            'detected_pauses': self._analyze_pauses(features),
            'rhythm_analysis': self._analyze_rhythm(features)
        }
        
        return analysis
    
    def compare_with_reference(self, user_audio: bytes, reference_audio: bytes = None) -> Dict:
        """
        Compare user audio with reference pronunciation
        
        Args:
            user_audio: User's recorded audio
            reference_audio: Reference audio for comparison (optional)
            
        Returns:
            Dict: Comparison results and similarity scores
        """
        user_features = self.extract_audio_features(user_audio)
        
        if not user_features['valid']:
            return {
                'similarity_score': 0,
                'error': 'Invalid user audio'
            }
        
        # If no reference audio provided, use mock reference features
        if reference_audio is None:
            # Mock "perfect" reference features
            reference_features = {
                'frequency_stats': {
                    'mean_frequency': 200,
                    'frequency_range': 100,
                    'dominant_frequency': 250
                },
                'amplitude': 0.7,
                'energy': 0.8,
                'pitch_stability': 0.9
            }
        else:
            reference_features = self.extract_audio_features(reference_audio)
        
        # Calculate similarity scores
        frequency_similarity = self._calculate_frequency_similarity(
            user_features['frequency_stats'],
            reference_features['frequency_stats']
        )
        
        amplitude_similarity = 1 - abs(user_features['amplitude'] - reference_features['amplitude'])
        energy_similarity = 1 - abs(user_features['energy'] - reference_features['energy'])
        
        overall_similarity = (frequency_similarity + amplitude_similarity + energy_similarity) / 3
        
        comparison = {
            'similarity_score': int(overall_similarity * 100),
            'frequency_similarity': int(frequency_similarity * 100),
            'amplitude_similarity': int(amplitude_similarity * 100),
            'energy_similarity': int(energy_similarity * 100),
            'improvement_areas': self._identify_improvement_areas(user_features, reference_features),
            'specific_feedback': self._generate_comparison_feedback(user_features, reference_features)
        }
        
        return comparison
    
    def detect_speech_patterns(self, audio_bytes: bytes) -> Dict:
        """
        Detect specific speech patterns and characteristics
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            Dict: Detected speech patterns and characteristics
        """
        features = self.extract_audio_features(audio_bytes)
        
        if not features['valid']:
            return {
                'patterns_detected': [],
                'error': 'Invalid audio input'
            }
        
        patterns = []
        
        # Mock pattern detection
        # In real implementation, this would use advanced speech analysis
        
        if features['frequency_stats']['mean_frequency'] < 180:
            patterns.append({
                'pattern': 'Low pitch tendency',
                'confidence': 0.8,
                'suggestion': 'Try speaking with slightly higher pitch'
            })
        
        if features['amplitude'] < 0.5:
            patterns.append({
                'pattern': 'Quiet speech',
                'confidence': 0.7,
                'suggestion': 'Speak with more volume and confidence'
            })
        
        if features['pitch_stability'] < 0.7:
            patterns.append({
                'pattern': 'Pitch instability',
                'confidence': 0.6,
                'suggestion': 'Practice maintaining steady pitch'
            })
        
        detection_results = {
            'patterns_detected': patterns,
            'speech_characteristics': {
                'voice_type': self._classify_voice_type(features),
                'speaking_style': self._classify_speaking_style(features),
                'confidence_level': self._estimate_confidence(features)
            },
            'recommendations': self._generate_pattern_recommendations(patterns)
        }
        
        return detection_results
    
    def _identify_potential_issues(self, features: Dict) -> List[str]:
        """Identify potential pronunciation issues from audio features"""
        issues = []
        
        if features['amplitude'] < 0.4:
            issues.append("Volume too low")
        elif features['amplitude'] > 0.9:
            issues.append("Volume too high")
        
        if features['energy'] < 0.5:
            issues.append("Low energy/unclear articulation")
        
        if features['pitch_stability'] < 0.6:
            issues.append("Inconsistent pitch")
        
        if features['duration'] < 0.5:
            issues.append("Speech too fast")
        elif features['duration'] > 4.0:
            issues.append("Speech too slow")
        
        return issues
    
    def _generate_improvement_suggestions(self, features: Dict, target_phoneme: str = None) -> List[str]:
        """Generate specific improvement suggestions based on analysis"""
        suggestions = []
        
        if features['amplitude'] < 0.5:
            suggestions.append("Speak louder and with more confidence")
        
        if features['energy'] < 0.6:
            suggestions.append("Focus on clear articulation and mouth movement")
        
        if features['pitch_stability'] < 0.7:
            suggestions.append("Practice maintaining steady pitch and tone")
        
        if target_phoneme:
            suggestions.append(f"Review tongue and lip position for '{target_phoneme}' sound")
            suggestions.append("Practice the sound slowly, then gradually increase speed")
        
        suggestions.append("Record yourself regularly to track improvement")
        
        return suggestions
    
    def _analyze_pauses(self, features: Dict) -> Dict:
        """Analyze pause patterns in speech"""
        # Mock pause analysis
        return {
            'pause_count': np.random.randint(1, 5),
            'average_pause_duration': np.random.uniform(0.2, 0.8),
            'pause_appropriateness': np.random.uniform(0.6, 0.9)
        }
    
    def _analyze_rhythm(self, features: Dict) -> Dict:
        """Analyze speech rhythm and timing"""
        return {
            'rhythm_consistency': features['pitch_stability'],
            'stress_pattern_accuracy': np.random.uniform(0.6, 0.9),
            'timing_regularity': np.random.uniform(0.5, 0.8)
        }
    
    def _calculate_frequency_similarity(self, user_freq: Dict, ref_freq: Dict) -> float:
        """Calculate similarity between frequency characteristics"""
        mean_diff = abs(user_freq['mean_frequency'] - ref_freq['mean_frequency']) / ref_freq['mean_frequency']
        range_diff = abs(user_freq['frequency_range'] - ref_freq['frequency_range']) / ref_freq['frequency_range']
        
        similarity = 1 - (mean_diff + range_diff) / 2
        return max(0, min(1, similarity))
    
    def _identify_improvement_areas(self, user_features: Dict, reference_features: Dict) -> List[str]:
        """Identify specific areas for improvement based on comparison"""
        areas = []
        
        freq_diff = abs(user_features['frequency_stats']['mean_frequency'] - 
                       reference_features['frequency_stats']['mean_frequency'])
        
        if freq_diff > 50:
            if user_features['frequency_stats']['mean_frequency'] > reference_features['frequency_stats']['mean_frequency']:
                areas.append("Lower your pitch slightly")
            else:
                areas.append("Raise your pitch slightly")
        
        amp_diff = user_features['amplitude'] - reference_features['amplitude']
        if abs(amp_diff) > 0.2:
            if amp_diff > 0:
                areas.append("Reduce volume slightly")
            else:
                areas.append("Increase volume")
        
        return areas
    
    def _generate_comparison_feedback(self, user_features: Dict, reference_features: Dict) -> List[str]:
        """Generate specific feedback based on comparison"""
        feedback = []
        
        similarity = self._calculate_frequency_similarity(
            user_features['frequency_stats'],
            reference_features['frequency_stats']
        )
        
        if similarity > 0.8:
            feedback.append("Excellent! Your pronunciation closely matches the target")
        elif similarity > 0.6:
            feedback.append("Good pronunciation with minor adjustments needed")
        else:
            feedback.append("Practice needed to match target pronunciation more closely")
        
        return feedback
    
    def _classify_voice_type(self, features: Dict) -> str:
        """Classify voice type based on frequency characteristics"""
        mean_freq = features['frequency_stats']['mean_frequency']
        
        if mean_freq < 165:
            return "Lower range"
        elif mean_freq > 265:
            return "Higher range"
        else:
            return "Middle range"
    
    def _classify_speaking_style(self, features: Dict) -> str:
        """Classify speaking style based on features"""
        if features['energy'] > 0.7 and features['amplitude'] > 0.6:
            return "Confident and clear"
        elif features['energy'] < 0.5:
            return "Hesitant or unclear"
        else:
            return "Moderate clarity"
    
    def _estimate_confidence(self, features: Dict) -> str:
        """Estimate speaker confidence level"""
        confidence_score = (features['amplitude'] + features['energy'] + features['pitch_stability']) / 3
        
        if confidence_score > 0.8:
            return "High confidence"
        elif confidence_score > 0.6:
            return "Moderate confidence"
        else:
            return "Low confidence - practice will help!"
    
    def _generate_pattern_recommendations(self, patterns: List[Dict]) -> List[str]:
        """Generate recommendations based on detected patterns"""
        recommendations = []
        
        if any("Low pitch" in p['pattern'] for p in patterns):
            recommendations.append("Practice speaking with varied pitch for expressiveness")
        
        if any("Quiet speech" in p['pattern'] for p in patterns):
            recommendations.append("Practice diaphragmatic breathing for stronger voice projection")
        
        if any("instability" in p['pattern'] for p in patterns):
            recommendations.append("Practice sustained vowel sounds to improve pitch control")
        
        return recommendations

    def get_audio_duration(self, audio_bytes: bytes) -> float:
        """
        Estimate audio duration from bytes
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            float: Duration in seconds
        """
        if not audio_bytes:
            return 0.0
        
        # Rough estimation based on typical audio encoding
        # In real implementation, would parse actual audio format
        estimated_duration = len(audio_bytes) / (self.sample_rate * 2)  # 16-bit audio
        return max(0.1, min(10.0, estimated_duration))  # Clamp between 0.1 and 10 seconds
    
    def normalize_audio(self, audio_bytes: bytes) -> bytes:
        """
        Normalize audio levels for consistent analysis
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            bytes: Normalized audio data
        """
        # In real implementation, would normalize amplitude levels
        # For now, return original audio
        return audio_bytes
    
    def filter_noise(self, audio_bytes: bytes) -> bytes:
        """
        Apply basic noise filtering to audio
        
        Args:
            audio_bytes: Raw audio data in bytes
            
        Returns:
            bytes: Filtered audio data
        """
        # In real implementation, would apply noise reduction algorithms
        # For now, return original audio
        return audio_bytes
