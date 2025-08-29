package com.speechtherapy.service;

import com.speechtherapy.model.DatabaseExercise;
import com.speechtherapy.repository.DatabaseExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ComprehensiveExerciseService {
    
    @Autowired
    private DatabaseExerciseRepository bodyExerciseRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Get all exercises from all tables
     */
    public Map<String, Object> getAllExercisesFromAllTables() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get exercises from body_exercises table
            List<DatabaseExercise> bodyExercises = bodyExerciseRepository.findAll();
            
            // Get exercises from exercises table (if exists)
            List<Map<String, Object>> generalExercises = getExercisesFromTable("exercises");
            
            // Get exercises from ai_exercises table (if exists)
            List<Map<String, Object>> aiExercises = getExercisesFromTable("ai_exercises");
            
            // Combine all exercises
            Map<String, Object> combinedExercises = new HashMap<>();
            combinedExercises.put("body_exercises", bodyExercises);
            combinedExercises.put("general_exercises", generalExercises);
            combinedExercises.put("ai_exercises", aiExercises);
            
            // Calculate totals
            int totalBodyExercises = bodyExercises.size();
            int totalGeneralExercises = generalExercises.size();
            int totalAiExercises = aiExercises.size();
            int totalExercises = totalBodyExercises + totalGeneralExercises + totalAiExercises;
            
            result.put("success", true);
            result.put("total_exercises", totalExercises);
            result.put("exercises_by_table", combinedExercises);
            result.put("counts", Map.of(
                "body_exercises", totalBodyExercises,
                "general_exercises", totalGeneralExercises,
                "ai_exercises", totalAiExercises
            ));
            result.put("message", "Successfully fetched exercises from all tables");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error fetching exercises: " + e.getMessage());
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Get exercises from a specific table
     */
    private List<Map<String, Object>> getExercisesFromTable(String tableName) {
        try {
            String sql = "SELECT * FROM " + tableName;
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            // Table might not exist or be empty
            return new ArrayList<>();
        }
    }
    
    /**
     * Get exercises mapped by difficulty level
     */
    public Map<String, Object> getExercisesMappedByDifficulty() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get body exercises and map them
            List<DatabaseExercise> bodyExercises = bodyExerciseRepository.findAll();
            
            // Map exercises by difficulty
            Map<String, List<DatabaseExercise>> exercisesByDifficulty = new HashMap<>();
            exercisesByDifficulty.put("beginner", new ArrayList<>());
            exercisesByDifficulty.put("intermediate", new ArrayList<>());
            exercisesByDifficulty.put("advanced", new ArrayList<>());
            
            for (DatabaseExercise exercise : bodyExercises) {
                String difficulty = getDifficultyLevel(exercise);
                if (exercisesByDifficulty.containsKey(difficulty)) {
                    exercisesByDifficulty.get(difficulty).add(exercise);
                }
            }
            
            // Get statistics
            Map<String, Object> statistics = getExerciseStatistics(bodyExercises);
            
            result.put("success", true);
            result.put("total_exercises", bodyExercises.size());
            result.put("exercises_by_difficulty", exercisesByDifficulty);
            result.put("statistics", statistics);
            result.put("message", "Successfully mapped " + bodyExercises.size() + " exercises by difficulty");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error mapping exercises: " + e.getMessage());
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Get exercises by type
     */
    public Map<String, Object> getExercisesByType(String type) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<DatabaseExercise> allExercises = bodyExerciseRepository.findAll();
            List<DatabaseExercise> filteredExercises = allExercises.stream()
                .filter(exercise -> getExerciseType(exercise).equals(type))
                .collect(java.util.stream.Collectors.toList());
            
            result.put("success", true);
            result.put("exercise_type", type);
            result.put("count", filteredExercises.size());
            result.put("exercises", filteredExercises);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error fetching exercises by type: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Get exercises by difficulty
     */
    public Map<String, Object> getExercisesByDifficulty(String difficulty) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<DatabaseExercise> allExercises = bodyExerciseRepository.findAll();
            List<DatabaseExercise> filteredExercises = allExercises.stream()
                .filter(exercise -> getDifficultyLevel(exercise).equals(difficulty))
                .collect(java.util.stream.Collectors.toList());
            
            result.put("success", true);
            result.put("difficulty_level", difficulty);
            result.put("count", filteredExercises.size());
            result.put("exercises", filteredExercises);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error fetching exercises by difficulty: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Search exercises across all fields
     */
    public Map<String, Object> searchExercises(String searchTerm) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<DatabaseExercise> allExercises = bodyExerciseRepository.findAll();
            List<DatabaseExercise> filteredExercises = allExercises.stream()
                .filter(exercise -> 
                    (exercise.getDescription() != null && exercise.getDescription().toLowerCase().contains(searchTerm.toLowerCase())) ||
                    (exercise.getTargetMuscles() != null && exercise.getTargetMuscles().toLowerCase().contains(searchTerm.toLowerCase()))
                )
                .collect(java.util.stream.Collectors.toList());
            
            result.put("success", true);
            result.put("search_term", searchTerm);
            result.put("count", filteredExercises.size());
            result.put("exercises", filteredExercises);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error searching exercises: " + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Get exercise statistics
     */
    private Map<String, Object> getExerciseStatistics(List<DatabaseExercise> exercises) {
        Map<String, Object> stats = new HashMap<>();
        
        // Count by difficulty
        Map<String, Long> difficultyCounts = exercises.stream()
            .collect(HashMap::new, (map, exercise) -> {
                String difficulty = getDifficultyLevel(exercise);
                map.put(difficulty, map.getOrDefault(difficulty, 0L) + 1);
            }, HashMap::putAll);
        
        // Count by type
        Map<String, Long> typeCounts = exercises.stream()
            .collect(HashMap::new, (map, exercise) -> {
                String type = getExerciseType(exercise);
                map.put(type, map.getOrDefault(type, 0L) + 1);
            }, HashMap::putAll);
        
        // Count by category
        Map<String, Long> categoryCounts = exercises.stream()
            .collect(HashMap::new, (map, exercise) -> {
                String category = getCategoryFromTargetMuscles(exercise.getTargetMuscles());
                map.put(category, map.getOrDefault(category, 0L) + 1);
            }, HashMap::putAll);
        
        stats.put("total_exercises", exercises.size());
        stats.put("difficulty_distribution", difficultyCounts);
        stats.put("type_distribution", typeCounts);
        stats.put("category_distribution", categoryCounts);
        
        return stats;
    }
    
    /**
     * Helper methods for determining exercise properties
     */
    private String getDifficultyLevel(DatabaseExercise exercise) {
        String desc = exercise.getDescription() != null ? exercise.getDescription().toLowerCase() : "";
        if (desc.contains("advanced") || desc.contains("complex")) return "advanced";
        if (desc.contains("intermediate") || desc.contains("moderate")) return "intermediate";
        return "beginner";
    }
    
    private String getExerciseType(DatabaseExercise exercise) {
        String desc = exercise.getDescription() != null ? exercise.getDescription().toLowerCase() : "";
        if (desc.contains("breathing")) return "breathing";
        if (desc.contains("facial")) return "facial";
        if (desc.contains("jaw")) return "jaw";
        if (desc.contains("tongue")) return "tongue";
        if (desc.contains("vocal")) return "vocal";
        if (desc.contains("relaxation")) return "relaxation";
        return "general";
    }
    
    private String getCategoryFromTargetMuscles(String targetMuscles) {
        if (targetMuscles == null) return "General Speech Training";
        
        String muscles = targetMuscles.toLowerCase();
        if (muscles.contains("diaphragm") || muscles.contains("lungs")) return "Breathing & Voice Control";
        if (muscles.contains("facial") || muscles.contains("lips")) return "Facial Muscle Training";
        if (muscles.contains("jaw")) return "Jaw & Mouth Control";
        if (muscles.contains("tongue")) return "Tongue & Articulation";
        if (muscles.contains("vocal")) return "Vocal & Resonance";
        return "General Speech Training";
    }
}
