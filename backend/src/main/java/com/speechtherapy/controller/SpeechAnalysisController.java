package com.speechtherapy.controller;

import com.speechtherapy.service.SpeechAnalysisService;
import com.speechtherapy.service.UserService;
import com.speechtherapy.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin(origins = "*")
public class SpeechAnalysisController {
    
    @Autowired
    private SpeechAnalysisService speechAnalysisService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeAudio(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam("exerciseType") String exerciseType,
            @RequestParam("targetText") String targetText,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {
        
        try {
            // Get or create default user
            User user = userService.getUserById(userId);
            if (user == null) {
                user = userService.createDefaultUser();
            }
            
            // Analyze the audio file
            Map<String, Object> analysisResult = speechAnalysisService.analyzeAudio(
                audioFile, exerciseType, targetText, user
            );
            
            return ResponseEntity.ok(analysisResult);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Analysis failed: " + e.getMessage());
            errorResponse.put("overallScore", 0);
            errorResponse.put("accuracyScore", 0);
            errorResponse.put("clarityScore", 0);
            errorResponse.put("feedback", new String[]{"Please try again with a clearer recording"});
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/quick-analyze")
    public ResponseEntity<Map<String, Object>> quickAnalyze(
            @RequestParam("exerciseType") String exerciseType,
            @RequestParam("targetText") String targetText) {
        
        try {
            // Generate mock analysis for demo purposes
            Map<String, Object> mockResult = speechAnalysisService.generateMockAnalysis(exerciseType, targetText);
            return ResponseEntity.ok(mockResult);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Mock analysis failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/exercises/{type}")
    public ResponseEntity<Map<String, Object>> getExercisesByType(@PathVariable String type) {
        try {
            Map<String, Object> exercises = speechAnalysisService.getExerciseContentByType(type);
            return ResponseEntity.ok(exercises);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load exercises: " + e.getMessage()));
        }
    }
    
    @GetMapping("/phonemes")
    public ResponseEntity<Map<String, Object>> getPhonemes() {
        try {
            Map<String, Object> phonemes = speechAnalysisService.getPhonemeData();
            return ResponseEntity.ok(phonemes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to load phonemes: " + e.getMessage()));
        }
    }
}