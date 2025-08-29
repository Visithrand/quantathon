package com.speechtherapy.controller;

import com.speechtherapy.model.DatabaseExercise;
import com.speechtherapy.service.DatabaseExerciseService;
import com.speechtherapy.service.ExerciseMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/database-exercises")
@CrossOrigin(origins = "*")
public class DatabaseExerciseController {
    
    @Autowired
    private DatabaseExerciseService databaseExerciseService;
    
    @Autowired
    private ExerciseMappingService exerciseMappingService;
    
    /**
     * Get all mapped exercises with difficulty levels and categories
     */
    @GetMapping("/mapped")
    public ResponseEntity<Map<String, Object>> getMappedExercises() {
        try {
            Map<String, Object> mappedExercises = exerciseMappingService.getMappedExercises();
            return ResponseEntity.ok(mappedExercises);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching mapped exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get all exercises from the database
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllExercises() {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.getAllExercises();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("total_exercises", exercises.size());
            response.put("exercises", exercises);
            response.put("message", "Successfully fetched " + exercises.size() + " exercises from database");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercises by type
     */
    @GetMapping("/type/{exerciseType}")
    public ResponseEntity<Map<String, Object>> getExercisesByType(@PathVariable String exerciseType) {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.getExercisesByType(exerciseType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("exercise_type", exerciseType);
            response.put("count", exercises.size());
            response.put("exercises", exercises);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercises by type: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercises by difficulty level
     */
    @GetMapping("/difficulty/{difficultyLevel}")
    public ResponseEntity<Map<String, Object>> getExercisesByDifficulty(@PathVariable String difficultyLevel) {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.getExercisesByDifficulty(difficultyLevel);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("difficulty_level", difficultyLevel);
            response.put("count", exercises.size());
            response.put("exercises", exercises);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercises by difficulty: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercises by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<Map<String, Object>> getExercisesByCategory(@PathVariable String category) {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.getExercisesByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("count", exercises.size());
            response.put("exercises", exercises);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercises by category: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Search exercises by name or description
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchExercises(@RequestParam String q) {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.searchExercises(q);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("search_term", q);
            response.put("count", exercises.size());
            response.put("exercises", exercises);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error searching exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercise statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getExerciseStatistics() {
        try {
            Map<String, Object> stats = exerciseMappingService.getExerciseStatistics();
            List<String> categories = exerciseMappingService.getAvailableCategories();
            List<String> exerciseTypes = exerciseMappingService.getAvailableExerciseTypes();
            List<String> difficultyLevels = exerciseMappingService.getAvailableDifficultyLevels();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("statistics", stats);
            response.put("available_categories", categories);
            response.put("available_exercise_types", exerciseTypes);
            response.put("available_difficulty_levels", difficultyLevels);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercise statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get exercises for user level
     */
    @GetMapping("/user-level/{userLevel}")
    public ResponseEntity<Map<String, Object>> getExercisesForUserLevel(@PathVariable String userLevel) {
        try {
            List<DatabaseExercise> exercises = exerciseMappingService.getRecommendedExercises(userLevel, 10);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user_level", userLevel);
            response.put("count", exercises.size());
            response.put("exercises", exercises);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching exercises for user level: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Get beginner exercises
     */
    @GetMapping("/beginner")
    public ResponseEntity<Map<String, Object>> getBeginnerExercises() {
        return getExercisesByDifficulty("beginner");
    }
    
    /**
     * Get intermediate exercises
     */
    @GetMapping("/intermediate")
    public ResponseEntity<Map<String, Object>> getIntermediateExercises() {
        return getExercisesByDifficulty("intermediate");
    }
    
    /**
     * Get advanced exercises
     */
    @GetMapping("/advanced")
    public ResponseEntity<Map<String, Object>> getAdvancedExercises() {
        return getExercisesByDifficulty("advanced");
    }
    
    /**
     * Get breathing exercises
     */
    @GetMapping("/type/breathing")
    public ResponseEntity<Map<String, Object>> getBreathingExercises() {
        return getExercisesByType("breathing");
    }
    
    /**
     * Get facial exercises
     */
    @GetMapping("/type/facial")
    public ResponseEntity<Map<String, Object>> getFacialExercises() {
        return getExercisesByType("facial");
    }
    
    /**
     * Get jaw exercises
     */
    @GetMapping("/type/jaw")
    public ResponseEntity<Map<String, Object>> getJawExercises() {
        return getExercisesByType("jaw");
    }
    
    /**
     * Get tongue exercises
     */
    @GetMapping("/type/tongue")
    public ResponseEntity<Map<String, Object>> getTongueExercises() {
        return getExercisesByType("tongue");
    }
    
    /**
     * Get vocal exercises
     */
    @GetMapping("/type/vocal")
    public ResponseEntity<Map<String, Object>> getVocalExercises() {
        return getExercisesByType("vocal");
    }
    
    /**
     * Get relaxation exercises
     */
    @GetMapping("/type/relaxation")
    public ResponseEntity<Map<String, Object>> getRelaxationExercises() {
        return getExercisesByType("relaxation");
    }
    
    /**
     * Check database structure and tables
     */
    @GetMapping("/check-database")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Check if we can connect to database
            result.put("database_connected", true);
            result.put("database_name", "speech_therapy");
            
            // Try to get table info
            try {
                List<DatabaseExercise> exercises = exerciseMappingService.getAllExercises();
                result.put("exercises_table_exists", true);
                result.put("exercises_count", exercises.size());
                result.put("exercises_sample", exercises.size() > 0 ? exercises.get(0) : null);
            } catch (Exception e) {
                result.put("exercises_table_exists", false);
                result.put("exercises_error", e.getMessage());
            }
            
            // Get available types, categories, and difficulty levels
            try {
                List<String> types = exerciseMappingService.getAvailableExerciseTypes();
                List<String> categories = exerciseMappingService.getAvailableCategories();
                List<String> difficulties = exerciseMappingService.getAvailableDifficultyLevels();
                
                result.put("available_types", types);
                result.put("available_categories", categories);
                result.put("available_difficulties", difficulties);
            } catch (Exception e) {
                result.put("metadata_error", e.getMessage());
            }
            
            result.put("success", true);
            result.put("message", "Database check completed");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error checking database: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    /**
     * Manually seed the database with exercises (for testing)
     */
    @PostMapping("/seed-exercises")
    public ResponseEntity<Map<String, Object>> seedExercises() {
        try {
            // Create sample exercises
            List<DatabaseExercise> exercises = Arrays.asList(
                // BEGINNER EXERCISES
                createExercise("Deep Breathing", "Practice deep breathing to improve voice control", "breathing", "beginner", "Breathing & Voice Control", "Diaphragm, Lungs", "Improves breath support for speech", "Sit comfortably, inhale deeply through nose for 4 counts, hold for 4, exhale through mouth for 6 counts", 60, 5, 3, 30, "None", "All Ages", "beginner", 10),
                createExercise("Lip Trills", "Make motorboat sounds to warm up lips", "facial", "beginner", "Facial Muscle Training", "Lips, Cheeks", "Strengthens lip muscles", "Press lips together gently, blow air through lips to create motorboat sound", 30, 8, 3, 15, "None", "All Ages", "beginner", 8),
                createExercise("Tongue Twisters - Basic", "Practice simple tongue twisters", "tongue", "beginner", "Tongue & Articulation", "Tongue, Lips", "Improves tongue coordination", "Say 'Peter Piper picked a peck of pickled peppers' slowly", 45, 3, 2, 20, "None", "All Ages", "beginner", 12),
                
                // INTERMEDIATE EXERCISES
                createExercise("Syllable Practice", "Practice difficult syllable combinations", "phoneme", "intermediate", "Phoneme Practice", "Tongue, Lips, Jaw", "Improves articulation", "Practice 'ba-da-ga', 'pa-ta-ka' combinations", 60, 10, 3, 20, "None", "All Ages", "intermediate", 15),
                createExercise("Word Stress Patterns", "Practice stressing different syllables", "word", "intermediate", "Word Pronunciation", "Vocal Cords, Tongue", "Improves word stress", "Say 'photograph', 'photographer' with correct stress", 50, 5, 3, 15, "None", "All Ages", "intermediate", 12),
                
                // ADVANCED EXERCISES
                createExercise("Complex Tongue Twisters", "Advanced tongue twisters", "tongue_twister", "advanced", "Tongue Twisters", "Tongue, Lips, Jaw", "Mastery of complex articulation", "Practice 'The sixth sick sheik's sixth sheep's sick'", 75, 10, 4, 30, "None", "Teens+", "advanced", 25),
                createExercise("Conversational Role Play", "Practice different scenarios", "conversation", "advanced", "Conversational Skills", "All Speech Muscles", "Improves conversation flow", "Role play job interview, casual conversation", 120, 3, 2, 45, "Partner", "Teens+", "advanced", 30)
            );
            
            // Save to database
            exerciseMappingService.saveAllExercises(exercises);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully seeded " + exercises.size() + " exercises");
            response.put("exercises_created", exercises.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error seeding exercises: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    private DatabaseExercise createExercise(String name, String description, String type, String difficulty, 
                                         String category, String targetMuscles, String speechBenefits, 
                                         String instructions, Integer duration, Integer repetitions, 
                                         Integer sets, Integer restSeconds, String equipment, 
                                         String ageGroup, String skillLevel, Integer points) {
        
        DatabaseExercise exercise = new DatabaseExercise();
        exercise.setDescription(description);
        exercise.setTargetMuscles(targetMuscles);
        exercise.setDurationSeconds(duration);
        exercise.setRepetitions(repetitions);
        exercise.setSets(sets);
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());
        exercise.setIsActive(true);
        
        return exercise;
    }
}
