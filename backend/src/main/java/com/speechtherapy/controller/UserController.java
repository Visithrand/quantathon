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
            return ResponseEntity.ok(Map.of("progress", updatedProgress, "message", "Progress updated successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update progress: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/weekly-progress")
    public ResponseEntity<List<UserProgress>> getWeeklyProgress(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            List<UserProgress> weeklyProgress = progressService.getWeeklyProgress(user);
            return ResponseEntity.ok(weeklyProgress);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
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