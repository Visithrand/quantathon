package com.speechtherapy.controller;

import com.speechtherapy.model.CompletedExercise;
import com.speechtherapy.service.CompletedExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/completed-exercises")
@CrossOrigin(origins = "*")
public class CompletedExerciseController {
    
    @Autowired
    private CompletedExerciseService completedExerciseService;
    
    /**
     * Mark an exercise as completed
     */
    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> markExerciseCompleted(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            String exerciseName = (String) request.get("exerciseName");
            String exerciseType = (String) request.get("exerciseType");
            String difficultyLevel = (String) request.get("difficultyLevel");
            Integer durationSeconds = Integer.parseInt(request.get("durationSeconds").toString());
            String notes = (String) request.get("notes");
            
            CompletedExercise completedExercise = completedExerciseService.markExerciseCompleted(
                userId, exerciseName, exerciseType, difficultyLevel, durationSeconds, notes
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Exercise marked as completed successfully");
            response.put("completedExercise", completedExercise);
            response.put("timestamp", completedExercise.getCompletedAt());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to mark exercise as completed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get completed exercises for a user on a specific date
     */
    @GetMapping("/daily/{userId}")
    public ResponseEntity<Map<String, Object>> getDailyCompletedExercises(
            @PathVariable Long userId,
            @RequestParam LocalDate date) {
        try {
            Map<String, Object> dailySummary = completedExerciseService.getDailyProgressSummary(userId, date);
            return ResponseEntity.ok(dailySummary);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get daily completed exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get all completed exercises for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getAllCompletedExercises(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = completedExerciseService.getExerciseStatistics(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get completed exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get completed exercises for a user within a date range
     */
    @GetMapping("/range/{userId}")
    public ResponseEntity<Map<String, Object>> getCompletedExercisesByDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        try {
            var completedExercises = completedExerciseService.getCompletedExercisesByDateRange(userId, startDate, endDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("completedExercises", completedExercises);
            response.put("count", completedExercises.size());
            response.put("startDate", startDate);
            response.put("endDate", endDate);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get completed exercises by date range: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercise statistics for a user
     */
    @GetMapping("/statistics/{userId}")
    public ResponseEntity<Map<String, Object>> getExerciseStatistics(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = completedExerciseService.getExerciseStatistics(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get exercise statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
