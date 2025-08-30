package com.speechtherapy.controller;

import com.speechtherapy.model.GameScore;
import com.speechtherapy.service.GameScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameScoreController {
    
    @Autowired
    private GameScoreService gameScoreService;
    
    // Submit a new game score
    @PostMapping("/score")
    public ResponseEntity<?> submitScore(@RequestBody Map<String, Object> scoreData) {
        try {
            Long userId = Long.parseLong(scoreData.get("userId").toString());
            String gameId = (String) scoreData.get("gameId");
            Integer points = Integer.parseInt(scoreData.get("points").toString());
            
            // Extract optional fields
            Integer accuracy = scoreData.get("accuracy") != null ? 
                Integer.parseInt(scoreData.get("accuracy").toString()) : null;
            Integer attempts = scoreData.get("attempts") != null ? 
                Integer.parseInt(scoreData.get("attempts").toString()) : null;
            Integer hintsUsed = scoreData.get("hintsUsed") != null ? 
                Integer.parseInt(scoreData.get("hintsUsed").toString()) : null;
            Long totalTime = scoreData.get("totalTime") != null ? 
                Long.parseLong(scoreData.get("totalTime").toString()) : null;
            Double averageSpeed = scoreData.get("averageSpeed") != null ? 
                Double.parseDouble(scoreData.get("averageSpeed").toString()) : null;
            String difficulty = (String) scoreData.get("difficulty");
            Integer roundsCompleted = scoreData.get("roundsCompleted") != null ? 
                Integer.parseInt(scoreData.get("roundsCompleted").toString()) : null;
            Integer wordsCompleted = scoreData.get("wordsCompleted") != null ? 
                Integer.parseInt(scoreData.get("wordsCompleted").toString()) : null;
            Integer sentencesCompleted = scoreData.get("sentencesCompleted") != null ? 
                Integer.parseInt(scoreData.get("sentencesCompleted").toString()) : null;
            Integer questionsCompleted = scoreData.get("questionsCompleted") != null ? 
                Integer.parseInt(scoreData.get("questionsCompleted").toString()) : null;
            Integer twistersCompleted = scoreData.get("twistersCompleted") != null ? 
                Integer.parseInt(scoreData.get("twistersCompleted").toString()) : null;
            
            GameScore gameScore = gameScoreService.createGameScore(
                userId, gameId, points, accuracy, attempts, hintsUsed, totalTime,
                averageSpeed, difficulty, roundsCompleted, wordsCompleted,
                sentencesCompleted, questionsCompleted, twistersCompleted
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Score submitted successfully");
            response.put("scoreId", gameScore.getId());
            response.put("points", gameScore.getPoints());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to submit score: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user statistics
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = gameScoreService.getUserStatistics(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get user stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user scores
    @GetMapping("/user/{userId}/scores")
    public ResponseEntity<?> getUserScores(@PathVariable Long userId) {
        try {
            List<GameScore> scores = gameScoreService.getUserScores(userId);
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get user scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user scores for a specific game
    @GetMapping("/user/{userId}/game/{gameId}/scores")
    public ResponseEntity<?> getUserGameScores(@PathVariable Long userId, @PathVariable String gameId) {
        try {
            List<GameScore> scores = gameScoreService.getUserGameScores(userId, gameId);
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get user game scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user's best score for a specific game
    @GetMapping("/user/{userId}/game/{gameId}/best")
    public ResponseEntity<?> getUserBestGameScore(@PathVariable Long userId, @PathVariable String gameId) {
        try {
            var bestScore = gameScoreService.getUserBestGameScore(userId, gameId);
            if (bestScore.isPresent()) {
                return ResponseEntity.ok(bestScore.get());
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No scores found for this game");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get best score: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user's recent scores
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<?> getUserRecentScores(@PathVariable Long userId) {
        try {
            List<GameScore> recentScores = gameScoreService.getUserRecentScores(userId);
            return ResponseEntity.ok(recentScores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get recent scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get weekly progress for a user
    @GetMapping("/user/{userId}/weekly-progress")
    public ResponseEntity<?> getUserWeeklyProgress(@PathVariable Long userId) {
        try {
            Map<String, Object> weeklyProgress = gameScoreService.getUserWeeklyProgress(userId);
            return ResponseEntity.ok(weeklyProgress);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get weekly progress: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get game completion statistics
    @GetMapping("/user/{userId}/completion-stats")
    public ResponseEntity<?> getGameCompletionStats(@PathVariable Long userId) {
        try {
            Map<String, Object> completionStats = gameScoreService.getGameCompletionStats(userId);
            return ResponseEntity.ok(completionStats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get completion stats: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get leaderboard for a specific game
    @GetMapping("/leaderboard/{gameId}")
    public ResponseEntity<?> getGameLeaderboard(@PathVariable String gameId, 
                                             @RequestParam(defaultValue = "10") int limit) {
        try {
            List<GameScore> leaderboard = gameScoreService.getGameLeaderboard(gameId, limit);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get leaderboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get overall leaderboard
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getOverallLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<GameScore> leaderboard = gameScoreService.getOverallLeaderboard(limit);
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get overall leaderboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get high accuracy scores
    @GetMapping("/high-accuracy")
    public ResponseEntity<?> getHighAccuracyScores(@RequestParam(defaultValue = "80") int threshold) {
        try {
            List<GameScore> highAccuracyScores = gameScoreService.getHighAccuracyScores(threshold);
            return ResponseEntity.ok(highAccuracyScores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get high accuracy scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user's high accuracy scores
    @GetMapping("/user/{userId}/high-accuracy")
    public ResponseEntity<?> getUserHighAccuracyScores(@PathVariable Long userId, 
                                                    @RequestParam(defaultValue = "80") int threshold) {
        try {
            List<GameScore> highAccuracyScores = gameScoreService.getUserHighAccuracyScores(userId, threshold);
            return ResponseEntity.ok(highAccuracyScores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get high accuracy scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get scores by date range
    @GetMapping("/scores/date-range")
    public ResponseEntity<?> getScoresByDateRange(@RequestParam String startDate, 
                                                @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<GameScore> scores = gameScoreService.getScoresByDateRange(start, end);
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get scores by date range: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Get user scores by date range
    @GetMapping("/user/{userId}/scores/date-range")
    public ResponseEntity<?> getUserScoresByDateRange(@PathVariable Long userId,
                                                    @RequestParam String startDate, 
                                                    @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<GameScore> scores = gameScoreService.getUserScoresByDateRange(userId, start, end);
            return ResponseEntity.ok(scores);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get user scores by date range: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Clean up old scores (admin only)
    @DeleteMapping("/cleanup")
    public ResponseEntity<?> cleanupOldScores(@RequestParam(defaultValue = "365") int daysOld) {
        try {
            gameScoreService.cleanupOldScores(daysOld);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Old scores cleaned up successfully (older than " + daysOld + " days)");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to cleanup old scores: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
