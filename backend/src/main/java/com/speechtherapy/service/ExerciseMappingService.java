package com.speechtherapy.service;

import com.speechtherapy.model.DatabaseExercise;
import com.speechtherapy.repository.DatabaseExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.HashSet;

@Service
public class ExerciseMappingService {
    
    @Autowired
    private DatabaseExerciseRepository databaseExerciseRepository;
    
    /**
     * Map exercises to proper difficulty levels and categories
     */
    public Map<String, Object> getMappedExercises() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get all exercises from database
            List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
            
            // Map exercises by difficulty level
            Map<String, List<DatabaseExercise>> exercisesByDifficulty = mapExercisesByDifficulty(allExercises);
            
            // Map exercises by type
            Map<String, List<DatabaseExercise>> exercisesByType = mapExercisesByType(allExercises);
            
            // Map exercises by category
            Map<String, List<DatabaseExercise>> exercisesByCategory = mapExercisesByCategory(allExercises);
            
            // Get exercise statistics
            Map<String, Object> statistics = getExerciseStatistics(allExercises);
            
            result.put("success", true);
            result.put("total_exercises", allExercises.size());
            result.put("exercises_by_difficulty", exercisesByDifficulty);
            result.put("exercises_by_type", exercisesByType);
            result.put("exercises_by_category", exercisesByCategory);
            result.put("statistics", statistics);
            result.put("message", "Successfully mapped " + allExercises.size() + " exercises");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Error mapping exercises: " + e.getMessage());
            result.put("error", e.getMessage());
        }
        
        return result;
    }
    
    /**
     * Map exercises by difficulty level
     */
    private Map<String, List<DatabaseExercise>> mapExercisesByDifficulty(List<DatabaseExercise> exercises) {
        Map<String, List<DatabaseExercise>> mapped = new HashMap<>();
        
        // Initialize difficulty levels
        mapped.put("beginner", new ArrayList<>());
        mapped.put("intermediate", new ArrayList<>());
        mapped.put("advanced", new ArrayList<>());
        
        for (DatabaseExercise exercise : exercises) {
            String difficulty = getDifficultyLevel(exercise);
            if (mapped.containsKey(difficulty)) {
                mapped.get(difficulty).add(exercise);
            }
        }
        
        return mapped;
    }
    
    /**
     * Map exercises by type
     */
    private Map<String, List<DatabaseExercise>> mapExercisesByType(List<DatabaseExercise> exercises) {
        Map<String, List<DatabaseExercise>> mapped = new HashMap<>();
        
        for (DatabaseExercise exercise : exercises) {
            String type = getExerciseType(exercise);
            if (!mapped.containsKey(type)) {
                mapped.put(type, new ArrayList<>());
            }
            mapped.get(type).add(exercise);
        }
        
        return mapped;
    }
    
    /**
     * Map exercises by category
     */
    private Map<String, List<DatabaseExercise>> mapExercisesByCategory(List<DatabaseExercise> exercises) {
        Map<String, List<DatabaseExercise>> mapped = new HashMap<>();
        
        for (DatabaseExercise exercise : exercises) {
            String category = getExerciseCategory(exercise);
            if (!mapped.containsKey(category)) {
                mapped.put(category, new ArrayList<>());
            }
            mapped.get(category).add(exercise);
        }
        
        return mapped;
    }
    
    /**
     * Determine difficulty level based on exercise data
     */
    private String getDifficultyLevel(DatabaseExercise exercise) {
        // Determine difficulty based on exercise characteristics
        String description = exercise.getDescription() != null ? 
            exercise.getDescription().toLowerCase() : "";
        
        // Advanced exercises
        if (description.contains("advanced") || description.contains("complex") ||
            description.contains("mastery") || description.contains("professional")) {
            return "advanced";
        }
        
        // Intermediate exercises
        if (description.contains("intermediate") || description.contains("moderate") ||
            description.contains("progressive") || description.contains("enhanced")) {
            return "intermediate";
        }
        
        // Beginner exercises (default)
        return "beginner";
    }
    
    /**
     * Determine exercise type
     */
    private String getExerciseType(DatabaseExercise exercise) {
        // Determine type based on description
        String description = exercise.getDescription() != null ? 
            exercise.getDescription().toLowerCase() : "";
        
        if (description.contains("breathing")) {
            return "breathing";
        } else if (description.contains("facial")) {
            return "facial";
        } else if (description.contains("jaw")) {
            return "jaw";
        } else if (description.contains("tongue")) {
            return "tongue";
        } else if (description.contains("vocal")) {
            return "vocal";
        } else if (description.contains("relaxation")) {
            return "relaxation";
        } else if (description.contains("phoneme")) {
            return "phoneme";
        } else if (description.contains("word")) {
            return "word";
        } else if (description.contains("sentence")) {
            return "sentence";
        } else if (description.contains("conversation")) {
            return "conversation";
        } else if (description.contains("tongue twister")) {
            return "tongue_twister";
        }
        
        return "general";
    }
    
    /**
     * Determine exercise category
     */
    private String getExerciseCategory(DatabaseExercise exercise) {
        // Determine category based on target muscles
        String targetMuscles = exercise.getTargetMuscles() != null ? 
            exercise.getTargetMuscles().toLowerCase() : "";
        
        if (targetMuscles.contains("diaphragm") || targetMuscles.contains("lungs")) {
            return "Breathing & Voice Control";
        } else if (targetMuscles.contains("facial") || targetMuscles.contains("lips")) {
            return "Facial Muscle Training";
        } else if (targetMuscles.contains("jaw")) {
            return "Jaw & Mouth Control";
        } else if (targetMuscles.contains("tongue")) {
            return "Tongue & Articulation";
        } else if (targetMuscles.contains("vocal")) {
            return "Vocal & Resonance";
        } else if (targetMuscles.contains("relaxation")) {
            return "Relaxation & Stress Relief";
        }
        
        // Determine category based on type as fallback
        String type = getExerciseType(exercise);
        
        if (type.equals("breathing")) {
            return "Breathing & Voice Control";
        } else if (type.equals("facial")) {
            return "Facial Muscle Training";
        } else if (type.equals("jaw")) {
            return "Jaw & Mouth Control";
        } else if (type.equals("tongue")) {
            return "Tongue & Articulation";
        } else if (type.equals("vocal")) {
            return "Vocal & Resonance";
        } else if (type.equals("relaxation")) {
            return "Relaxation & Stress Relief";
        } else if (type.equals("phoneme")) {
            return "Phoneme Practice";
        } else if (type.equals("word")) {
            return "Word Pronunciation";
        } else if (type.equals("sentence")) {
            return "Sentence Fluency";
        } else if (type.equals("conversation")) {
            return "Conversational Skills";
        } else if (type.equals("tongue_twister")) {
            return "Tongue Twisters";
        }
        
        return "General Speech Training";
    }
    
    /**
     * Get all exercises
     */
    public List<DatabaseExercise> getAllExercises() {
        return databaseExerciseRepository.findAll();
    }
    
    /**
     * Get exercises for specific difficulty level
     */
    public List<DatabaseExercise> getExercisesByDifficulty(String difficulty) {
        // Since body_exercises might not have difficulty_level, we'll determine it from other fields
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        return allExercises.stream()
            .filter(exercise -> getDifficultyLevel(exercise).equals(difficulty))
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Get exercises for specific type
     */
    public List<DatabaseExercise> getExercisesByType(String type) {
        // Since body_exercises might not have exercise_type, we'll determine it from other fields
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        return allExercises.stream()
            .filter(exercise -> getExerciseType(exercise).equals(type))
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Get exercises for specific category
     */
    public List<DatabaseExercise> getExercisesByCategory(String category) {
        // Since body_exercises might not have category, we'll determine it from other fields
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        return allExercises.stream()
            .filter(exercise -> getExerciseCategory(exercise).equals(category))
            .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Search exercises
     */
    public List<DatabaseExercise> searchExercises(String searchTerm) {
        return databaseExerciseRepository.searchExercises(searchTerm);
    }
    
    /**
     * Get recommended exercises for user level
     */
    public List<DatabaseExercise> getRecommendedExercises(String userLevel, int limit) {
        // Get exercises matching user level
        List<DatabaseExercise> levelExercises = getExercisesByDifficulty(userLevel);
        
        // If not enough exercises, add some from adjacent levels
        if (levelExercises.size() < limit) {
            if (userLevel.equals("beginner")) {
                levelExercises.addAll(getExercisesByDifficulty("intermediate"));
            } else if (userLevel.equals("intermediate")) {
                levelExercises.addAll(getExercisesByDifficulty("beginner"));
                levelExercises.addAll(getExercisesByDifficulty("advanced"));
            } else if (userLevel.equals("advanced")) {
                levelExercises.addAll(getExercisesByDifficulty("intermediate"));
            }
        }
        
        // Shuffle and limit
        Collections.shuffle(levelExercises);
        return levelExercises.subList(0, Math.min(limit, levelExercises.size()));
    }
    
    /**
     * Get exercise statistics
     */
    public Map<String, Object> getExerciseStatistics() {
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        return getExerciseStatistics(allExercises);
    }
    
    /**
     * Get exercise statistics from a list of exercises
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
                String category = getExerciseCategory(exercise);
                map.put(category, map.getOrDefault(category, 0L) + 1);
            }, HashMap::putAll);
        
        stats.put("total_exercises", exercises.size());
        stats.put("difficulty_distribution", difficultyCounts);
        stats.put("type_distribution", typeCounts);
        stats.put("category_distribution", categoryCounts);
        
        return stats;
    }
    
    /**
     * Save all exercises to database
     */
    public void saveAllExercises(List<DatabaseExercise> exercises) {
        databaseExerciseRepository.saveAll(exercises);
    }
    
    /**
     * Get all available exercise types
     */
    public List<String> getAvailableExerciseTypes() {
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        Set<String> types = new HashSet<>();
        
        for (DatabaseExercise exercise : allExercises) {
            String type = getExerciseType(exercise);
            types.add(type);
        }
        
        return new ArrayList<>(types);
    }
    
    /**
     * Get all available categories
     */
    public List<String> getAvailableCategories() {
        List<DatabaseExercise> allExercises = databaseExerciseRepository.findAll();
        Set<String> categories = new HashSet<>();
        
        for (DatabaseExercise exercise : allExercises) {
            String category = getExerciseCategory(exercise);
            categories.add(category);
        }
        
        return new ArrayList<>(categories);
    }
    
    /**
     * Get all available difficulty levels
     */
    public List<String> getAvailableDifficultyLevels() {
        return Arrays.asList("beginner", "intermediate", "advanced");
    }
}
