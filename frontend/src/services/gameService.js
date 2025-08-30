import { api } from '../config/api';

class GameService {
  // Submit game score to backend
  async submitScore(gameData) {
    try {
      const response = await fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  // Get user's game statistics
  async getUserStats(userId) {
    try {
      const response = await fetch(`/api/games/stats/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get user's recent scores
  async getRecentScores(userId, limit = 10) {
    try {
      const response = await fetch(`/api/games/scores/${userId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent scores');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching recent scores:', error);
      throw error;
    }
  }

  // Get leaderboard for a specific game
  async getLeaderboard(gameId, limit = 20) {
    try {
      const response = await fetch(`/api/games/leaderboard/${gameId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // Analyze pronunciation using backend (replace mock data)
  async analyzePronunciation(audioBlob, targetText, gameType) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'pronunciation.wav');
      formData.append('targetText', targetText);
      formData.append('gameType', gameType);
      
      const response = await fetch('/api/analysis/pronunciation', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze pronunciation');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      // Fallback to simulated analysis if backend is not available
      return this.getSimulatedAnalysis(targetText, gameType);
    }
  }

  // Fallback simulated analysis (when backend is not available)
  getSimulatedAnalysis(targetText, gameType) {
    // More realistic simulation based on game type and target text
    const baseAccuracy = 70 + Math.random() * 25; // 70-95% base accuracy
    
    let accuracy = baseAccuracy;
    let feedback = '';
    
    switch (gameType) {
      case 'word-repetition':
        // Word repetition tends to have higher accuracy
        accuracy = Math.min(100, baseAccuracy + 5);
        feedback = this.getWordRepetitionFeedback(accuracy, targetText);
        break;
        
      case 'tongue-twister':
        // Tongue twisters are more challenging
        accuracy = Math.max(50, baseAccuracy - 10);
        feedback = this.getTongueTwisterFeedback(accuracy, targetText);
        break;
        
      case 'fill-in-blank':
        // Context-based games
        accuracy = Math.min(100, baseAccuracy + 3);
        feedback = this.getFillInBlankFeedback(accuracy, targetText);
        break;
        
      case 'sound-matching':
        // Sound recognition games
        accuracy = Math.min(100, baseAccuracy + 2);
        feedback = this.getSoundMatchingFeedback(accuracy, targetText);
        break;
        
      case 'audio-quiz':
        // Quiz games
        accuracy = Math.min(100, baseAccuracy + 4);
        feedback = this.getAudioQuizFeedback(accuracy, targetText);
        break;
        
      case 'timed-pronunciation':
        // Timed games have time pressure
        accuracy = Math.max(60, baseAccuracy - 5);
        feedback = this.getTimedPronunciationFeedback(accuracy, targetText);
        break;
        
      case 'phoneme-blending':
        // Phoneme blending is complex
        accuracy = Math.max(55, baseAccuracy - 8);
        feedback = this.getPhonemeBlendingFeedback(accuracy, targetText);
        break;
        
      default:
        accuracy = baseAccuracy;
        feedback = this.getGeneralFeedback(accuracy, targetText);
    }
    
    return {
      accuracy: Math.round(accuracy),
      feedback: feedback,
      pronunciationScore: Math.round(accuracy),
      fluencyScore: Math.round(accuracy * 0.9),
      clarityScore: Math.round(accuracy * 0.95),
      confidence: accuracy > 80 ? 'high' : accuracy > 60 ? 'medium' : 'low',
      suggestions: this.getSuggestions(accuracy, gameType, targetText)
    };
  }

  getWordRepetitionFeedback(accuracy, targetText) {
    if (accuracy > 90) {
      return `Excellent pronunciation of "${targetText}"! Your articulation is clear and accurate.`;
    } else if (accuracy > 80) {
      return `Very good pronunciation of "${targetText}". Minor improvements in clarity would make it perfect.`;
    } else if (accuracy > 70) {
      return `Good attempt at "${targetText}". Focus on the vowel sounds and consonant clarity.`;
    } else {
      return `Keep practicing "${targetText}". Pay attention to the syllable structure and stress patterns.`;
    }
  }

  getTongueTwisterFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Outstanding! You mastered "${targetText}" with excellent speed and clarity.`;
    } else if (accuracy > 75) {
      return `Great job on "${targetText}"! Work on maintaining clarity while increasing speed.`;
    } else if (accuracy > 65) {
      return `Good effort on "${targetText}". Practice the challenging consonant clusters slowly first.`;
    } else {
      return `"${targetText}" is challenging! Break it down into smaller parts and practice each section.`;
    }
  }

  getFillInBlankFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Perfect! You correctly pronounced "${targetText}" in context.`;
    } else if (accuracy > 75) {
      return `Well done! Your pronunciation of "${targetText}" fits well in the sentence.`;
    } else if (accuracy > 65) {
      return `Good attempt! Focus on how "${targetText}" connects with the surrounding words.`;
    } else {
      return `Keep practicing! Consider the context when pronouncing "${targetText}".`;
    }
  }

  getSoundMatchingFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Excellent sound recognition! You accurately identified "${targetText}".`;
    } else if (accuracy > 75) {
      return `Good sound matching! You're close to perfect recognition of "${targetText}".`;
    } else if (accuracy > 65) {
      return `Keep practicing! Focus on the distinctive features of "${targetText}".`;
    } else {
      return `"${targetText}" can be tricky! Listen carefully to the sound characteristics.`;
    }
  }

  getAudioQuizFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Brilliant! You correctly answered the question about "${targetText}".`;
    } else if (accuracy > 75) {
      return `Well done! You understood the audio content about "${targetText}".`;
    } else if (accuracy > 65) {
      return `Good effort! Listen more carefully to the details about "${targetText}".`;
    } else {
      return `Keep practicing! Pay attention to the audio cues for "${targetText}".`;
    }
  }

  getTimedPronunciationFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Excellent! You pronounced "${targetText}" accurately under time pressure.`;
    } else if (accuracy > 75) {
      return `Good job! You completed "${targetText}" with good accuracy and timing.`;
    } else if (accuracy > 65) {
      return `Keep practicing! Work on speed and accuracy for "${targetText}".`;
    } else {
      return `"${targetText}" needs more practice. Focus on clear pronunciation first, then speed.`;
    }
  }

  getPhonemeBlendingFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Outstanding! You perfectly blended the phonemes to form "${targetText}".`;
    } else if (accuracy > 75) {
      return `Great blending! You're close to perfect phoneme combination for "${targetText}".`;
    } else if (accuracy > 65) {
      return `Good effort! Practice the individual sounds before blending for "${targetText}".`;
    } else {
      return `"${targetText}" requires careful phoneme blending. Start with individual sounds.`;
    }
  }

  getGeneralFeedback(accuracy, targetText) {
    if (accuracy > 85) {
      return `Excellent pronunciation of "${targetText}"!`;
    } else if (accuracy > 75) {
      return `Very good pronunciation of "${targetText}".`;
    } else if (accuracy > 65) {
      return `Good attempt at "${targetText}". Keep practicing!`;
    } else {
      return `Keep working on "${targetText}". Practice makes perfect!`;
    }
  }

  getSuggestions(accuracy, gameType, targetText) {
    const suggestions = [];
    
    if (accuracy < 80) {
      suggestions.push('Practice the word slowly and clearly');
      suggestions.push('Focus on each syllable individually');
      suggestions.push('Record yourself and compare with the target');
    }
    
    if (gameType === 'tongue-twister') {
      suggestions.push('Start slowly and gradually increase speed');
      suggestions.push('Practice difficult consonant clusters separately');
    }
    
    if (gameType === 'phoneme-blending') {
      suggestions.push('Say each phoneme separately first');
      suggestions.push('Blend sounds gradually from slow to normal speed');
    }
    
    if (accuracy < 70) {
      suggestions.push('Use a mirror to check mouth positioning');
      suggestions.push('Listen to native speakers if possible');
    }
    
    return suggestions;
  }
}

export default new GameService();
