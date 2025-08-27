"""
AI-powered scoring engine for speech therapy exercises
Provides mock AI analysis for pronunciation, fluency, and speech quality assessment
"""
import random
import numpy as np
from typing import Dict, List, Optional, Tuple
import json
from datetime import datetime

class ScoringEngine:
    """
    Mock AI scoring engine that simulates speech analysis and provides feedback
    In production, this would integrate with actual speech recognition and analysis APIs
    """
    
    def __init__(self):
        self.phoneme_weights = {
            'accuracy': 0.4,
            'clarity': 0.3,
            'consistency': 0.2,
            'timing': 0.1
        }
        
        self.word_weights = {
            'pronunciation': 0.35,
            'stress_pattern': 0.25,
            'vowel_clarity': 0.25,
            'consonant_clarity': 0.15
        }
        
        self.sentence_weights = {
            'fluency': 0.3,
            'rhythm': 0.25,
            'pace': 0.25,
            'expression': 0.2
        }
        
        # Common phoneme difficulties for feedback generation
        self.phoneme_tips = {
            'th': [
                "Place tongue tip between teeth",
                "Let air flow through the tongue-teeth gap",
                "Don't substitute with 'd' or 'z' sounds"
            ],
            's': [
                "Keep tongue tip near but not touching roof of mouth",
                "Create narrow channel for air flow",
                "Avoid lateral air escape"
            ],
            'r': [
                "Curl tongue tip up and back slightly",
                "Don't let tongue touch roof of mouth",
                "Practice with 'er' sound first"
            ],
            'l': [
                "Touch tongue tip to roof of mouth behind teeth",
                "Let air flow around sides of tongue",
                "Keep tongue tip firm and pointed"
            ]
        }
    
    def analyze_phoneme(self, audio_bytes: bytes, target_phoneme: str) -> Dict:
        """
        Analyze phoneme pronunciation and provide detailed feedback
        
        Args:
            audio_bytes: Raw audio data
            target_phoneme: The phoneme being practiced
            
        Returns:
            Dict: Comprehensive phoneme analysis with scores and feedback
        """
        # Simulate processing time variance
        base_score = random.randint(65, 95)
        
        # Adjust score based on phoneme difficulty
        difficulty_adjustments = {
            'th': -5,  # Harder phoneme
            'r': -7,   # Very difficult for many learners
            'l': -3,
            's': -2,
            'vowels': +5  # Generally easier
        }
        
        phoneme_key = target_phoneme.lower()
        adjustment = difficulty_adjustments.get(phoneme_key, 0)
        base_score = max(50, min(100, base_score + adjustment))
        
        # Generate component scores
        accuracy_score = max(40, base_score + random.randint(-10, 15))
        clarity_score = max(45, base_score + random.randint(-8, 12))
        consistency_score = max(50, base_score + random.randint(-12, 10))
        
        # Calculate overall score using weighted average
        overall_score = int(
            accuracy_score * self.phoneme_weights['accuracy'] +
            clarity_score * self.phoneme_weights['clarity'] +
            consistency_score * self.phoneme_weights['consistency'] +
            base_score * self.phoneme_weights['timing']
        )
        
        # Generate improvement tips
        improvement_tips = self._generate_phoneme_tips(
            target_phoneme, accuracy_score, clarity_score, consistency_score
        )
        
        # Calculate improvement from previous attempts (mock)
        improvement = random.randint(-3, 8)  # Generally trending upward
        
        return {
            'overall_score': overall_score,
            'accuracy_score': accuracy_score,
            'clarity_score': clarity_score,
            'consistency_score': consistency_score,
            'improvement': improvement,
            'improvement_tips': improvement_tips,
            'phoneme_specific_feedback': self._get_phoneme_specific_feedback(
                target_phoneme, overall_score
            ),
            'practice_recommendations': self._get_practice_recommendations(overall_score),
            'confidence_level': self._calculate_confidence(overall_score)
        }
    
    def analyze_word(self, audio_bytes: bytes, target_word: str) -> Dict:
        """
        Analyze word pronunciation with focus on stress patterns and syllables
        
        Args:
            audio_bytes: Raw audio data
            target_word: The word being practiced
            
        Returns:
            Dict: Comprehensive word analysis
        """
        # Base scoring with word complexity consideration
        word_length = len(target_word)
        syllable_count = self._estimate_syllables(target_word)
        
        # Adjust difficulty based on word characteristics
        complexity_factor = min(1.2, (word_length / 10) + (syllable_count / 5))
        base_score = random.randint(70, 92)
        adjusted_score = int(base_score / complexity_factor)
        
        # Component scores
        pronunciation_score = max(50, adjusted_score + random.randint(-8, 12))
        stress_score = max(55, adjusted_score + random.randint(-10, 15))
        vowel_score = max(60, adjusted_score + random.randint(-5, 10))
        consonant_score = max(58, adjusted_score + random.randint(-7, 8))
        
        # Weighted overall score
        overall_score = int(
            pronunciation_score * self.word_weights['pronunciation'] +
            stress_score * self.word_weights['stress_pattern'] +
            vowel_score * self.word_weights['vowel_clarity'] +
            consonant_score * self.word_weights['consonant_clarity']
        )
        
        return {
            'overall_score': overall_score,
            'accuracy_score': pronunciation_score,
            'stress_score': stress_score,
            'vowel_score': vowel_score,
            'consonant_score': consonant_score,
            'syllable_analysis': self._analyze_syllables(target_word, overall_score),
            'improvement_tips': self._generate_word_tips(
                target_word, pronunciation_score, stress_score
            ),
            'word_breakdown': self._break_down_word(target_word),
            'difficulty_level': self._assess_word_difficulty(target_word)
        }
    
    def analyze_sentence(self, audio_bytes: bytes, target_sentence: str) -> Dict:
        """
        Analyze sentence fluency, rhythm, and overall delivery
        
        Args:
            audio_bytes: Raw audio data
            target_sentence: The sentence being practiced
            
        Returns:
            Dict: Comprehensive sentence analysis
        """
        sentence_length = len(target_sentence.split())
        complexity = self._assess_sentence_complexity(target_sentence)
        
        # Base scoring adjusted for sentence complexity
        base_score = random.randint(65, 88)
        complexity_adjustment = max(0.8, min(1.15, 1.0 - (complexity - 1) * 0.1))
        adjusted_score = int(base_score * complexity_adjustment)
        
        # Component scores
        fluency_score = max(45, adjusted_score + random.randint(-12, 15))
        rhythm_score = max(50, adjusted_score + random.randint(-8, 12))
        pace_score = max(55, adjusted_score + random.randint(-10, 10))
        expression_score = max(48, adjusted_score + random.randint(-15, 18))
        
        # Calculate overall score
        overall_score = int(
            fluency_score * self.sentence_weights['fluency'] +
            rhythm_score * self.sentence_weights['rhythm'] +
            pace_score * self.sentence_weights['pace'] +
            expression_score * self.sentence_weights['expression']
        )
        
        return {
            'overall_score': overall_score,
            'fluency_score': fluency_score,
            'rhythm_score': rhythm_score,
            'pace_score': pace_score,
            'expression_score': expression_score,
            'detailed_feedback': self._generate_sentence_feedback(
                fluency_score, rhythm_score, pace_score, expression_score
            ),
            'pacing_analysis': self._analyze_pacing(target_sentence),
            'stress_pattern_analysis': self._analyze_sentence_stress(target_sentence),
            'improvement_suggestions': self._generate_sentence_suggestions(overall_score)
        }
    
    def analyze_conversation(self, audio_bytes: bytes, expected_response: str) -> Dict:
        """
        Analyze conversational speech for naturalness and communication effectiveness
        
        Args:
            audio_bytes: Raw audio data
            expected_response: Expected or sample response
            
        Returns:
            Dict: Conversation analysis results
        """
        base_score = random.randint(60, 85)
        
        # Conversation-specific scoring
        confidence_score = max(45, base_score + random.randint(-15, 20))
        clarity_score = max(50, base_score + random.randint(-10, 15))
        naturalness_score = max(40, base_score + random.randint(-20, 25))
        engagement_score = max(55, base_score + random.randint(-8, 12))
        
        overall_score = int((confidence_score + clarity_score + naturalness_score + engagement_score) / 4)
        
        # Communication aspects breakdown
        communication_aspects = {
            'Vocal Confidence': confidence_score,
            'Message Clarity': clarity_score,
            'Natural Flow': naturalness_score,
            'Listener Engagement': engagement_score,
            'Appropriate Pace': max(50, base_score + random.randint(-5, 8)),
            'Emotional Expression': max(45, base_score + random.randint(-10, 15))
        }
        
        return {
            'overall_score': overall_score,
            'confidence_score': confidence_score,
            'clarity_score': clarity_score,
            'naturalness_score': naturalness_score,
            'engagement_score': engagement_score,
            'communication_aspects': communication_aspects,
            'conversation_feedback': self._generate_conversation_feedback(overall_score),
            'improvement_areas': self._identify_conversation_improvements(
                confidence_score, clarity_score, naturalness_score
            ),
            'communication_strengths': self._identify_communication_strengths(communication_aspects)
        }
    
    def analyze_tongue_twister(self, audio_bytes: bytes, twister_text: str) -> Dict:
        """
        Analyze tongue twister performance focusing on speed and accuracy
        
        Args:
            audio_bytes: Raw audio data
            twister_text: The tongue twister text
            
        Returns:
            Dict: Tongue twister analysis
        """
        difficulty = self._assess_twister_difficulty(twister_text)
        base_score = random.randint(55, 80)
        
        # Adjust for twister difficulty
        difficulty_adjustment = max(0.7, min(1.2, 1.1 - (difficulty - 1) * 0.15))
        adjusted_score = int(base_score * difficulty_adjustment)
        
        speed_score = max(40, adjusted_score + random.randint(-15, 20))
        clarity_score = max(45, adjusted_score + random.randint(-12, 15))
        accuracy_score = max(50, adjusted_score + random.randint(-10, 12))
        
        overall_score = int((speed_score + clarity_score + accuracy_score) / 3)
        
        return {
            'overall_score': overall_score,
            'speed_score': speed_score,
            'clarity_score': clarity_score,
            'accuracy_score': accuracy_score,
            'difficulty_rating': difficulty,
            'challenge_areas': self._identify_twister_challenges(twister_text),
            'improvement_tips': self._generate_twister_tips(speed_score, clarity_score),
            'mastery_level': self._assess_twister_mastery(overall_score)
        }
    
    def _generate_phoneme_tips(self, phoneme: str, accuracy: int, clarity: int, consistency: int) -> List[str]:
        """Generate specific tips for phoneme improvement"""
        tips = []
        phoneme_lower = phoneme.lower()
        
        # Get phoneme-specific tips
        if phoneme_lower in self.phoneme_tips:
            tips.extend(self.phoneme_tips[phoneme_lower])
        
        # Add performance-based tips
        if accuracy < 70:
            tips.append("Focus on correct tongue and lip positioning")
            tips.append("Practice the sound in isolation before using in words")
        
        if clarity < 70:
            tips.append("Speak more slowly to ensure clear articulation")
            tips.append("Exaggerate the mouth movements initially")
        
        if consistency < 70:
            tips.append("Practice the same sound multiple times in a row")
            tips.append("Record yourself to hear variations in your pronunciation")
        
        # Add general encouragement
        tips.append("Regular practice will improve muscle memory")
        
        return tips[:4]  # Limit to 4 most relevant tips
    
    def _get_phoneme_specific_feedback(self, phoneme: str, score: int) -> str:
        """Get specific feedback for the phoneme performance"""
        phoneme_lower = phoneme.lower()
        
        if score >= 85:
            return f"Excellent {phoneme} sound production! Your articulation is very clear."
        elif score >= 70:
            return f"Good {phoneme} pronunciation with minor adjustments needed."
        elif score >= 55:
            return f"Your {phoneme} sound needs practice. Focus on tongue placement."
        else:
            return f"The {phoneme} sound requires significant practice. Start with isolated sound practice."
    
    def _get_practice_recommendations(self, score: int) -> List[str]:
        """Get practice recommendations based on score"""
        if score >= 85:
            return [
                "Continue practicing to maintain your excellent form",
                "Try using this sound in more complex words",
                "Help others by demonstrating the correct pronunciation"
            ]
        elif score >= 70:
            return [
                "Practice this sound daily for 5-10 minutes",
                "Use a mirror to check your mouth position",
                "Try the sound in different word positions"
            ]
        else:
            return [
                "Start with isolated sound practice",
                "Use visual guides for tongue placement",
                "Practice for short sessions multiple times daily",
                "Consider working with a speech therapist"
            ]
    
    def _calculate_confidence(self, score: int) -> str:
        """Calculate confidence level description"""
        if score >= 85:
            return "High - You're speaking with great confidence!"
        elif score >= 70:
            return "Good - Your confidence is building nicely"
        elif score >= 55:
            return "Moderate - Keep practicing to build confidence"
        else:
            return "Developing - Practice will boost your confidence"
    
    def _estimate_syllables(self, word: str) -> int:
        """Rough syllable estimation for scoring adjustment"""
        # Simple vowel counting method
        vowels = 'aeiouy'
        word_lower = word.lower()
        syllable_count = 0
        prev_char_was_vowel = False
        
        for char in word_lower:
            if char in vowels:
                if not prev_char_was_vowel:
                    syllable_count += 1
                prev_char_was_vowel = True
            else:
                prev_char_was_vowel = False
        
        # Handle silent e
        if word_lower.endswith('e') and syllable_count > 1:
            syllable_count -= 1
        
        return max(1, syllable_count)
    
    def _analyze_syllables(self, word: str, overall_score: int) -> Dict:
        """Analyze syllable pronunciation within the word"""
        syllable_count = self._estimate_syllables(word)
        
        # Mock syllable analysis
        syllables = []
        for i in range(syllable_count):
            syllable_score = max(40, overall_score + random.randint(-15, 15))
            syllables.append({
                'position': i + 1,
                'score': syllable_score,
                'clarity': 'Good' if syllable_score >= 70 else 'Needs Practice'
            })
        
        return {
            'count': syllable_count,
            'breakdown': syllables,
            'stress_pattern': 'Initial' if syllable_count > 1 else 'Single'
        }
    
    def _generate_word_tips(self, word: str, pronunciation_score: int, stress_score: int) -> List[str]:
        """Generate word-specific improvement tips"""
        tips = []
        
        if pronunciation_score < 70:
            tips.append(f"Break '{word}' into syllables and practice each part")
            tips.append("Focus on clear consonant sounds")
        
        if stress_score < 70:
            tips.append("Practice emphasizing the correct syllable")
            tips.append("Listen to native speakers pronouncing this word")
        
        tips.append(f"Use '{word}' in sentences for context practice")
        tips.append("Record yourself saying the word multiple times")
        
        return tips[:3]
    
    def _break_down_word(self, word: str) -> Dict:
        """Break down word into components for analysis"""
        return {
            'length': len(word),
            'syllables': self._estimate_syllables(word),
            'complexity': 'High' if len(word) > 8 or self._estimate_syllables(word) > 3 else 'Medium' if len(word) > 5 else 'Low',
            'common_sounds': self._identify_challenging_sounds(word)
        }
    
    def _assess_word_difficulty(self, word: str) -> str:
        """Assess the difficulty level of the word"""
        length = len(word)
        syllables = self._estimate_syllables(word)
        
        if length <= 4 and syllables <= 2:
            return "Easy"
        elif length <= 7 and syllables <= 3:
            return "Medium"
        else:
            return "Hard"
    
    def _identify_challenging_sounds(self, word: str) -> List[str]:
        """Identify potentially challenging sounds in the word"""
        challenging = []
        word_lower = word.lower()
        
        if 'th' in word_lower:
            challenging.append('th')
        if any(combo in word_lower for combo in ['ch', 'sh', 'ph']):
            challenging.append('consonant clusters')
        if any(r in word_lower for r in ['r', 'l']):
            challenging.append('liquid sounds')
        
        return challenging
    
    def _assess_sentence_complexity(self, sentence: str) -> float:
        """Assess sentence complexity for scoring adjustment"""
        words = sentence.split()
        avg_word_length = sum(len(word.strip('.,!?')) for word in words) / len(words)
        
        complexity = 1.0
        if len(words) > 10:
            complexity += 0.3
        if avg_word_length > 6:
            complexity += 0.2
        if any(punct in sentence for punct in [',', ';', ':']):
            complexity += 0.1
        
        return complexity
    
    def _generate_sentence_feedback(self, fluency: int, rhythm: int, pace: int, expression: int) -> List[str]:
        """Generate detailed sentence feedback"""
        feedback = []
        
        if fluency < 70:
            feedback.append("Work on smoother word transitions")
        if rhythm < 70:
            feedback.append("Practice natural speech rhythm and timing")
        if pace < 70:
            feedback.append("Adjust your speaking pace - too fast or too slow")
        if expression < 70:
            feedback.append("Add more vocal variety and expression")
        
        if not feedback:
            feedback.append("Excellent sentence delivery! Keep up the great work!")
        
        return feedback
    
    def _analyze_pacing(self, sentence: str) -> Dict:
        """Analyze sentence pacing characteristics"""
        word_count = len(sentence.split())
        return {
            'estimated_duration': f"{word_count * 0.5:.1f} seconds",
            'optimal_pace': f"{120 + random.randint(-20, 20)} words per minute",
            'pacing_recommendation': 'Good' if 100 <= (word_count * 120) <= 180 else 'Adjust'
        }
    
    def _analyze_sentence_stress(self, sentence: str) -> Dict:
        """Analyze sentence stress patterns"""
        words = sentence.split()
        content_words = [w for w in words if len(w.strip('.,!?')) > 3]  # Rough content word detection
        
        return {
            'content_words': len(content_words),
            'stress_points': content_words[:3],  # Main stress points
            'pattern': 'Natural stress pattern expected'
        }
    
    def _generate_sentence_suggestions(self, score: int) -> List[str]:
        """Generate sentence improvement suggestions"""
        if score >= 80:
            return [
                "Excellent sentence delivery!",
                "Try more complex sentences to challenge yourself",
                "Focus on adding emotional expression"
            ]
        elif score >= 65:
            return [
                "Good progress! Practice reading aloud daily",
                "Work on connecting words smoothly",
                "Pay attention to natural pauses"
            ]
        else:
            return [
                "Practice reading simple sentences slowly",
                "Focus on one aspect at a time (pace, then rhythm)",
                "Record yourself to identify improvement areas"
            ]
    
    def _generate_conversation_feedback(self, score: int) -> List[str]:
        """Generate conversation-specific feedback"""
        if score >= 80:
            return [
                "Great conversational skills!",
                "Your communication is clear and engaging",
                "Ready for more complex dialogue scenarios"
            ]
        elif score >= 65:
            return [
                "Good conversational foundation",
                "Work on speaking with more confidence",
                "Practice maintaining natural flow"
            ]
        else:
            return [
                "Focus on speaking clearly and at steady pace",
                "Practice common conversation phrases",
                "Build confidence through regular practice"
            ]
    
    def _identify_conversation_improvements(self, confidence: int, clarity: int, naturalness: int) -> List[str]:
        """Identify specific conversation improvement areas"""
        improvements = []
        
        if confidence < 70:
            improvements.append("Build speaking confidence through regular practice")
        if clarity < 70:
            improvements.append("Focus on clear articulation and volume")
        if naturalness < 70:
            improvements.append("Practice natural speech rhythm and intonation")
        
        return improvements
    
    def _identify_communication_strengths(self, aspects: Dict) -> List[str]:
        """Identify communication strengths"""
        strengths = []
        for aspect, score in aspects.items():
            if score >= 75:
                strengths.append(f"Strong {aspect.lower()}")
        
        if not strengths:
            strengths.append("Shows potential for improvement in all areas")
        
        return strengths
    
    def _assess_twister_difficulty(self, twister: str) -> int:
        """Assess tongue twister difficulty level"""
        # Check for common challenging combinations
        challenging_patterns = ['th', 'sh', 'ch', 'st', 'tr', 'br', 'pr', 'sl', 'sp']
        difficulty = 1
        
        for pattern in challenging_patterns:
            if pattern in twister.lower():
                difficulty += 0.5
        
        # Length factor
        if len(twister.split()) > 8:
            difficulty += 1
        
        return min(5, int(difficulty))
    
    def _identify_twister_challenges(self, twister: str) -> List[str]:
        """Identify specific challenges in tongue twister"""
        challenges = []
        twister_lower = twister.lower()
        
        if 'th' in twister_lower:
            challenges.append("TH sound combinations")
        if any(combo in twister_lower for combo in ['sh', 'ch']):
            challenges.append("Sibilant sounds")
        if any(combo in twister_lower for combo in ['tr', 'br', 'pr']):
            challenges.append("Consonant clusters")
        
        return challenges
    
    def _generate_twister_tips(self, speed: int, clarity: int) -> List[str]:
        """Generate tongue twister improvement tips"""
        tips = []
        
        if speed < 70:
            tips.append("Start slowly and gradually increase speed")
            tips.append("Focus on accuracy before speed")
        
        if clarity < 70:
            tips.append("Exaggerate mouth movements initially")
            tips.append("Practice difficult sound combinations separately")
        
        tips.append("Warm up with easier tongue twisters first")
        return tips
    
    def _assess_twister_mastery(self, score: int) -> str:
        """Assess tongue twister mastery level"""
        if score >= 85:
            return "Master Level - Excellent speed and clarity!"
        elif score >= 70:
            return "Advanced - Good control with minor improvements needed"
        elif score >= 55:
            return "Intermediate - Building skills, keep practicing"
        else:
            return "Beginner - Focus on accuracy before speed"
    
    def get_difficulty_recommendation(self, recent_scores: List[int]) -> str:
        """Recommend difficulty adjustment based on recent performance"""
        if not recent_scores:
            return "intermediate"
        
        avg_score = sum(recent_scores) / len(recent_scores)
        
        if avg_score >= 85:
            return "advanced"
        elif avg_score >= 65:
            return "intermediate"
        else:
            return "beginner"
    
    def calculate_improvement_trend(self, score_history: List[int]) -> Dict:
        """Calculate improvement trend from score history"""
        if len(score_history) < 2:
            return {'trend': 'insufficient_data', 'improvement_rate': 0}
        
        # Simple linear trend calculation
        recent_avg = sum(score_history[-3:]) / len(score_history[-3:])
        earlier_avg = sum(score_history[:3]) / len(score_history[:3])
        
        improvement = recent_avg - earlier_avg
        
        if improvement > 5:
            trend = 'improving'
        elif improvement > -2:
            trend = 'stable'
        else:
            trend = 'declining'
        
        return {
            'trend': trend,
            'improvement_rate': improvement,
            'confidence': min(100, max(0, int(recent_avg)))
        }
