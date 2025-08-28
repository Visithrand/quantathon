package com.speechtherapy.controller;

import com.speechtherapy.model.User;
import com.speechtherapy.model.UserProgress;
import com.speechtherapy.service.UserService;
import com.speechtherapy.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProgressService progressService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/progress")
    public ResponseEntity<Map<String, Object>> getUserProgress(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> progressData = progressService.getUserProgressSummary(user);
            // Weekly progress is now handled by WeeklyPlanService
            progressData.put("weeklyPracticeTime", 0); // Placeholder
            progressData.put("weeklyProgressPercentage", 0); // Placeholder
            progressData.put("weeklyStreak", user.getWeeklyStreak());
            return ResponseEntity.ok(progressData);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load progress: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
    
    @GetMapping("/{id}/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            Map<String, Object> statistics = userService.getUserStatistics(user);
            return ResponseEntity.ok(statistics);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load statistics: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/redeem-codes")
    public ResponseEntity<?> listUserCodes(@PathVariable Long id, @Autowired com.speechtherapy.repository.RedeemCodeRepository redeemCodeRepository) {
        User user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(redeemCodeRepository.findAll().stream().filter(c -> c.getUser().getId().equals(id)).toList());
    }
    
    @PostMapping("/{id}/update-progress")
    public ResponseEntity<Map<String, Object>> updateUserProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Object> progressUpdate) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            UserProgress updatedProgress = progressService.updateDailyProgress(user, progressUpdate);
            Map<String, Object> summary = progressService.getUserProgressSummary(user);
            summary.put("message", "Progress updated successfully");
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update progress: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/weekly-progress")
    public ResponseEntity<Map<String, Object>> getWeeklyProgress(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Weekly progress is now handled by WeeklyPlanService
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Weekly progress is now handled by WeeklyPlanService");
            response.put("endpoint", "/api/weekly-plan/" + id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get weekly progress"));
        }
    }
    
    @GetMapping("/default")
    public ResponseEntity<User> getOrCreateDefaultUser() {
        try {
            User defaultUser = userService.getOrCreateDefaultUser();
            return ResponseEntity.ok(defaultUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}