package com.speechtherapy.controller;

import com.speechtherapy.model.*;
import com.speechtherapy.service.WeeklyPlanService;
import com.speechtherapy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/weekly-plan")
@CrossOrigin(origins = "*")
public class WeeklyPlanController {
    
    @Autowired
    private WeeklyPlanService weeklyPlanService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BodyExerciseRepository bodyExerciseRepository;
    
    @Autowired
    private WeeklyPlanRepository weeklyPlanRepository;
    
    /**
     * Get or create weekly plan for a user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getWeeklyPlan(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            Map<String, Object> weeklySchedule = weeklyPlanService.generateWeeklySchedule(userOpt.get());
            return ResponseEntity.ok(weeklySchedule);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to generate weekly plan: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get body exercises by difficulty level
     */
    @GetMapping("/body-exercises/difficulty/{difficultyLevel}")
    public ResponseEntity<Map<String, Object>> getBodyExercisesByDifficulty(@PathVariable String difficultyLevel) {
        try {
            List<BodyExercise> exercises = bodyExerciseRepository.findByDifficultyLevel(difficultyLevel);
            Map<String, Object> response = new HashMap<>();
            response.put("exercises", exercises);
            response.put("count", exercises.size());
            response.put("difficultyLevel", difficultyLevel);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch body exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get body exercises by type
     */
    @GetMapping("/body-exercises/type/{exerciseType}")
    public ResponseEntity<Map<String, Object>> getBodyExercisesByType(@PathVariable String exerciseType) {
        try {
            List<BodyExercise> exercises = bodyExerciseRepository.findByExerciseType(exerciseType);
            Map<String, Object> response = new HashMap<>();
            response.put("exercises", exercises);
            response.put("count", exercises.size());
            response.put("exerciseType", exerciseType);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch body exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get personalized body exercise recommendations for a user
     */
    @GetMapping("/{userId}/body-exercises/recommended")
    public ResponseEntity<Map<String, Object>> getRecommendedBodyExercises(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int count) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            List<BodyExercise> recommendedExercises = weeklyPlanService.getPersonalizedBodyExercises(userOpt.get(), count);
            Map<String, Object> response = new HashMap<>();
            response.put("recommendedExercises", recommendedExercises);
            response.put("count", recommendedExercises.size());
            response.put("userDifficultyLevel", userOpt.get().getDifficultyLevel());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get recommended exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get all body exercises
     */
    @GetMapping("/body-exercises/all")
    public ResponseEntity<Map<String, Object>> getAllBodyExercises() {
        try {
            List<BodyExercise> allExercises = bodyExerciseRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("exercises", allExercises);
            response.put("count", allExercises.size());
            
            // Group by difficulty level
            Map<String, Long> difficultyCounts = allExercises.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    BodyExercise::getDifficultyLevel, 
                    java.util.stream.Collectors.counting()
                ));
            response.put("difficultyCounts", difficultyCounts);
            
            // Group by exercise type
            Map<String, Long> typeCounts = allExercises.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                    BodyExercise::getExerciseType, 
                    java.util.stream.Collectors.counting()
                ));
            response.put("typeCounts", typeCounts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch all body exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get weekly statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getWeeklyStatistics() {
        try {
            Map<String, Object> stats = weeklyPlanService.getWeeklyStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get weekly statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Update weekly progress from daily progress
     */
    @PostMapping("/{userId}/update-progress")
    public ResponseEntity<Map<String, Object>> updateWeeklyProgress(
            @PathVariable Long userId,
            @RequestParam LocalDate date) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            weeklyPlanService.updateWeeklyPlanFromDailyProgress(userOpt.get(), date);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Weekly progress updated successfully");
            response.put("date", date);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to update weekly progress: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Reset weekly progress (admin function)
     */
    @PostMapping("/admin/reset-weekly")
    public ResponseEntity<Map<String, Object>> resetWeeklyProgress() {
        try {
            weeklyPlanService.resetWeeklyProgress();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Weekly progress reset successfully");
            response.put("timestamp", LocalDate.now());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to reset weekly progress: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get user's weekly plan history
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<Map<String, Object>> getWeeklyPlanHistory(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            List<WeeklyPlan> history = weeklyPlanRepository.findByUserOrderByWeekStartDesc(userOpt.get());
            Map<String, Object> response = new HashMap<>();
            response.put("weeklyPlans", history);
            response.put("count", history.size());
            
            // Calculate overall statistics
            long completedWeeks = history.stream().filter(WeeklyPlan::getIsCompleted).count();
            double averageProgress = history.stream().mapToDouble(WeeklyPlan::getProgressPercentage).average().orElse(0.0);
            
            response.put("completedWeeks", completedWeeks);
            response.put("averageProgress", averageProgress);
            response.put("totalWeeks", history.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get weekly plan history: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
