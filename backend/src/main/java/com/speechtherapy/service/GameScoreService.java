package com.speechtherapy.service;

import com.speechtherapy.model.GameScore;
import com.speechtherapy.model.User;
import com.speechtherapy.repository.GameScoreRepository;
import com.speechtherapy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GameScoreService {
    
    @Autowired
    private GameScoreRepository gameScoreRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Save a new game score
    public GameScore saveGameScore(GameScore gameScore) {
        return gameScoreRepository.save(gameScore);
    }
    
    // Create a new game score from data
    public GameScore createGameScore(Long userId, String gameId, Integer points, Integer accuracy, 
                                   Integer attempts, Integer hintsUsed, Long totalTime, 
                                   Double averageSpeed, String difficulty, Integer roundsCompleted,
                                   Integer wordsCompleted, Integer sentencesCompleted, 
                                   Integer questionsCompleted, Integer twistersCompleted) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        GameScore gameScore = new GameScore();
        gameScore.setUser(userOpt.get());
        gameScore.setGameId(gameId);
        gameScore.setPoints(points);
        gameScore.setAccuracy(accuracy);
        gameScore.setAttempts(attempts);
        gameScore.setHintsUsed(hintsUsed);
        gameScore.setTotalTime(totalTime);
        gameScore.setAverageSpeed(averageSpeed);
        gameScore.setDifficulty(difficulty);
        gameScore.setRoundsCompleted(roundsCompleted);
        gameScore.setWordsCompleted(wordsCompleted);
        gameScore.setSentencesCompleted(sentencesCompleted);
        gameScore.setQuestionsCompleted(questionsCompleted);
        gameScore.setTwistersCompleted(twistersCompleted);
        
        return gameScoreRepository.save(gameScore);
    }
    
    // Get all scores for a user
    public List<GameScore> getUserScores(Long userId) {
        return gameScoreRepository.findByUserIdOrderByTimestampDesc(userId);
    }
    
    // Get scores for a user in a specific game
    public List<GameScore> getUserGameScores(Long userId, String gameId) {
        return gameScoreRepository.findByUserIdAndGameIdOrderByTimestampDesc(userId, gameId);
    }
    
    // Get best score for a user in a specific game
    public Optional<GameScore> getUserBestGameScore(Long userId, String gameId) {
        return gameScoreRepository.findTopByUserIdAndGameIdOrderByPointsDesc(userId, gameId);
    }
    
    // Get recent scores for a user (last 30 days)
    public List<GameScore> getUserRecentScores(Long userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return gameScoreRepository.findRecentScoresByUserId(userId, thirtyDaysAgo);
    }
    
    // Get user statistics
    public Map<String, Object> getUserStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Total points
        Integer totalPoints = gameScoreRepository.getTotalPointsByUserId(userId);
        stats.put("totalPoints", totalPoints != null ? totalPoints : 0);
        
        // Average accuracy
        Double avgAccuracy = gameScoreRepository.getAverageAccuracyByUserId(userId);
        stats.put("averageAccuracy", avgAccuracy != null ? avgAccuracy : 0.0);
        
        // Total games played
        long totalGames = gameScoreRepository.countByUserId(userId);
        stats.put("totalGames", totalGames);
        
        // Best score
        Optional<GameScore> bestScore = gameScoreRepository.findTopScoresByUserId(userId)
                .stream().findFirst();
        stats.put("bestScore", bestScore.map(GameScore::getPoints).orElse(0));
        
        // Game breakdown
        List<Object[]> gameStats = gameScoreRepository.getGameStatisticsByUserId(userId);
        Map<String, Object> gameBreakdown = new HashMap<>();
        for (Object[] stat : gameStats) {
            String gameId = (String) stat[0];
            Long count = (Long) stat[1];
            Double avgPoints = (Double) stat[2];
            Double avgAcc = (Double) stat[3];
            
            Map<String, Object> gameStat = new HashMap<>();
            gameStat.put("count", count);
            gameStat.put("averagePoints", avgPoints != null ? avgPoints : 0.0);
            gameStat.put("averageAccuracy", avgAcc != null ? avgAcc : 0.0);
            gameBreakdown.put(gameId, gameStat);
        }
        stats.put("gameBreakdown", gameBreakdown);
        
        // Difficulty breakdown
        List<Object[]> difficultyStats = gameScoreRepository.getDifficultyStatisticsByUserId(userId);
        Map<String, Object> difficultyBreakdown = new HashMap<>();
        for (Object[] stat : difficultyStats) {
            String difficulty = (String) stat[0];
            Long count = (Long) stat[1];
            Double avgPoints = (Double) stat[2];
            Double avgAcc = (Double) stat[3];
            
            Map<String, Object> difficultyStat = new HashMap<>();
            difficultyStat.put("count", count);
            difficultyStat.put("averagePoints", avgPoints != null ? avgPoints : 0.0);
            difficultyStat.put("averageAccuracy", avgAcc != null ? avgAcc : 0.0);
            difficultyBreakdown.put(difficulty, difficultyStat);
        }
        stats.put("difficultyBreakdown", difficultyBreakdown);
        
        return stats;
    }
    
    // Get leaderboard for a specific game
    public List<GameScore> getGameLeaderboard(String gameId, int limit) {
        List<GameScore> topScores = gameScoreRepository.findTopScoresByGame(gameId);
        return topScores.stream().limit(limit).toList();
    }
    
    // Get overall leaderboard
    public List<GameScore> getOverallLeaderboard(int limit) {
        List<GameScore> topScores = gameScoreRepository.findTopScores();
        return topScores.stream().limit(limit).toList();
    }
    
    // Get high accuracy scores
    public List<GameScore> getHighAccuracyScores(Integer threshold) {
        return gameScoreRepository.findHighAccuracyScores(threshold);
    }
    
    // Get high accuracy scores for a user
    public List<GameScore> getUserHighAccuracyScores(Long userId, Integer threshold) {
        return gameScoreRepository.findHighAccuracyScoresByUserId(userId, threshold);
    }
    
    // Get scores by date range
    public List<GameScore> getScoresByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return gameScoreRepository.findScoresByDateRange(startDate, endDate);
    }
    
    // Get user scores by date range
    public List<GameScore> getUserScoresByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return gameScoreRepository.findScoresByUserIdAndDateRange(userId, startDate, endDate);
    }
    
    // Get weekly progress for a user
    public Map<String, Object> getUserWeeklyProgress(Long userId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        LocalDateTime now = LocalDateTime.now();
        
        List<GameScore> weeklyScores = gameScoreRepository.findScoresByUserIdAndDateRange(userId, weekAgo, now);
        
        Map<String, Object> weeklyProgress = new HashMap<>();
        weeklyProgress.put("totalGames", weeklyScores.size());
        
        Integer weeklyPoints = weeklyScores.stream()
                .mapToInt(GameScore::getPoints)
                .sum();
        weeklyProgress.put("totalPoints", weeklyPoints);
        
        Double weeklyAccuracy = weeklyScores.stream()
                .filter(gs -> gs.getAccuracy() != null)
                .mapToInt(GameScore::getAccuracy)
                .average()
                .orElse(0.0);
        weeklyProgress.put("averageAccuracy", weeklyAccuracy);
        
        // Daily breakdown
        Map<String, Integer> dailyPoints = new HashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDateTime day = now.minusDays(i);
            String dayKey = day.toLocalDate().toString();
            
            Integer dayPoints = weeklyScores.stream()
                    .filter(gs -> gs.getTimestamp().toLocalDate().equals(day.toLocalDate()))
                    .mapToInt(GameScore::getPoints)
                    .sum();
            dailyPoints.put(dayKey, dayPoints);
        }
        weeklyProgress.put("dailyPoints", dailyPoints);
        
        return weeklyProgress;
    }
    
    // Clean up old scores (older than specified days)
    public void cleanupOldScores(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        gameScoreRepository.deleteOldScores(cutoffDate);
    }
    
    // Get game completion statistics
    public Map<String, Object> getGameCompletionStats(Long userId) {
        Map<String, Object> completionStats = new HashMap<>();
        
        // Count completed games by type
        long wordRepetitionGames = gameScoreRepository.countByUserIdAndGameId(userId, "word-repetition");
        long tongueTwisterGames = gameScoreRepository.countByUserIdAndGameId(userId, "tongue-twister");
        long fillInBlankGames = gameScoreRepository.countByUserIdAndGameId(userId, "fill-in-blank");
        long soundMatchingGames = gameScoreRepository.countByUserIdAndGameId(userId, "sound-matching");
        long audioQuizGames = gameScoreRepository.countByUserIdAndGameId(userId, "audio-quiz");
        long timedPronunciationGames = gameScoreRepository.countByUserIdAndGameId(userId, "timed-pronunciation");
        long phonemeBlendingGames = gameScoreRepository.countByUserIdAndGameId(userId, "phoneme-blending");
        
        completionStats.put("wordRepetition", wordRepetitionGames);
        completionStats.put("tongueTwister", tongueTwisterGames);
        completionStats.put("fillInBlank", fillInBlankGames);
        completionStats.put("soundMatching", soundMatchingGames);
        completionStats.put("audioQuiz", audioQuizGames);
        completionStats.put("timedPronunciation", timedPronunciationGames);
        completionStats.put("phonemeBlending", phonemeBlendingGames);
        
        // Total unique games played
        long totalUniqueGames = List.of(wordRepetitionGames, tongueTwisterGames, fillInBlankGames,
                soundMatchingGames, audioQuizGames, timedPronunciationGames, phonemeBlendingGames)
                .stream().filter(count -> count > 0).count();
        completionStats.put("totalUniqueGames", totalUniqueGames);
        
        return completionStats;
    }
}
