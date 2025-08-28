package com.speechtherapy.service;

import com.speechtherapy.model.CompletedExercise;
import com.speechtherapy.model.User;
import com.speechtherapy.repository.CompletedExerciseRepository;
import com.speechtherapy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class CompletedExerciseService {
    
    @Autowired
    private CompletedExerciseRepository completedExerciseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Mark an exercise as completed
     */
    public CompletedExercise markExerciseCompleted(Long userId, String exerciseName, 
                                                 String exerciseType, String difficultyLevel, 
                                                 Integer durationSeconds, String notes) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        CompletedExercise completedExercise = new CompletedExercise(
            userOpt.get(), exerciseName, exerciseType, difficultyLevel, durationSeconds
        );
        
        if (notes != null && !notes.trim().isEmpty()) {
            completedExercise.setNotes(notes);
        }
        
        return completedExerciseRepository.save(completedExercise);
    }
    
    /**
     * Get completed exercises for a user on a specific date
     */
    public List<CompletedExercise> getCompletedExercisesByDate(Long userId, LocalDate date) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return completedExerciseRepository.findByUserAndPracticeDateOrderByCompletedAtDesc(userOpt.get(), date);
    }
    
    /**
     * Get all completed exercises for a user
     */
    public List<CompletedExercise> getAllCompletedExercises(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return completedExerciseRepository.findByUserOrderByCompletedAtDesc(userOpt.get());
    }
    
    /**
     * Get completed exercises for a user within a date range
     */
    public List<CompletedExercise> getCompletedExercisesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        return completedExerciseRepository.findByUserAndPracticeDateBetweenOrderByCompletedAtDesc(
            userOpt.get(), startDate, endDate);
    }
    
    /**
     * Get exercise completion statistics for a user
     */
    public Map<String, Object> getExerciseStatistics(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        Map<String, Object> stats = new HashMap<>();
        
        // Get exercise type statistics
        List<Object[]> exerciseTypeStats = completedExerciseRepository.getExerciseTypeStats(userOpt.get());
        Map<String, Long> exerciseTypeCounts = new HashMap<>();
        for (Object[] stat : exerciseTypeStats) {
            exerciseTypeCounts.put((String) stat[0], (Long) stat[1]);
        }
        stats.put("exerciseTypeCounts", exerciseTypeCounts);
        
        // Get difficulty level statistics
        List<Object[]> difficultyStats = completedExerciseRepository.getDifficultyLevelStats(userOpt.get());
        Map<String, Long> difficultyCounts = new HashMap<>();
        for (Object[] stat : difficultyStats) {
            difficultyCounts.put((String) stat[0], (Long) stat[1]);
        }
        stats.put("difficultyCounts", difficultyCounts);
        
        // Get total completed exercises
        long totalCompleted = completedExerciseRepository.countByUser(userOpt.get());
        stats.put("totalCompleted", totalCompleted);
        
        // Get today's completed exercises
        long todayCompleted = completedExerciseRepository.countByUserAndPracticeDate(userOpt.get(), LocalDate.now());
        stats.put("todayCompleted", todayCompleted);
        
        // Get this week's completed exercises
        LocalDate weekStart = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(6);
        List<CompletedExercise> weekExercises = completedExerciseRepository.findByUserAndPracticeDateBetweenOrderByCompletedAtDesc(
            userOpt.get(), weekStart, weekEnd);
        stats.put("weekCompleted", weekExercises.size());
        
        return stats;
    }
    
    /**
     * Get daily progress summary including completed exercises
     */
    public Map<String, Object> getDailyProgressSummary(Long userId, LocalDate date) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        Map<String, Object> summary = new HashMap<>();
        
        // Get completed exercises for the day
        List<CompletedExercise> completedExercises = completedExerciseRepository.findByUserAndPracticeDateOrderByCompletedAtDesc(
            userOpt.get(), date);
        
        summary.put("exercises", completedExercises);
        summary.put("totalExercises", completedExercises.size());
        
        // Calculate total duration
        int totalDuration = completedExercises.stream()
            .mapToInt(ex -> ex.getDurationSeconds() != null ? ex.getDurationSeconds() : 0)
            .sum();
        summary.put("totalDuration", totalDuration);
        
        // Group by exercise type
        Map<String, Long> exerciseTypeCounts = completedExercises.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                CompletedExercise::getExerciseType, 
                java.util.stream.Collectors.counting()
            ));
        summary.put("exerciseTypeCounts", exerciseTypeCounts);
        
        // Group by difficulty level
        Map<String, Long> difficultyCounts = completedExercises.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                CompletedExercise::getDifficultyLevel, 
                java.util.stream.Collectors.counting()
            ));
        summary.put("difficultyCounts", difficultyCounts);
        
        return summary;
    }
}
