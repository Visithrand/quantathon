package com.speechtherapy.service;

import com.speechtherapy.model.BodyExercise;
import com.speechtherapy.repository.BodyExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DatabaseExerciseService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private BodyExerciseRepository bodyExerciseRepository;
    
    /**
     * Fetch all exercises from the speech_therapy database
     */
    public List<Map<String, Object>> fetchAllExercisesFromDatabase() {
        String sql = "SELECT * FROM exercises";
        return jdbcTemplate.queryForList(sql);
    }
    
    /**
     * Fetch exercises by type from the speech_therapy database
     */
    public List<Map<String, Object>> fetchExercisesByType(String exerciseType) {
        String sql = "SELECT * FROM exercises WHERE exercise_type = ?";
        return jdbcTemplate.queryForList(sql, exerciseType);
    }
    
    /**
     * Fetch exercises by difficulty level from the speech_therapy database
     */
    public List<Map<String, Object>> fetchExercisesByDifficulty(String difficultyLevel) {
        String sql = "SELECT * FROM exercises WHERE difficulty_level = ?";
        return jdbcTemplate.queryForList(sql, difficultyLevel);
    }
    
    /**
     * Fetch exercises by category from the speech_therapy database
     */
    public List<Map<String, Object>> fetchExercisesByCategory(String category) {
        String sql = "SELECT * FROM exercises WHERE category = ?";
        return jdbcTemplate.queryForList(sql, category);
    }
    
    /**
     * Get total count of exercises in the database
     */
    public int getTotalExerciseCount() {
        String sql = "SELECT COUNT(*) FROM exercises";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }
    
    /**
     * Fetch exercises with pagination from the speech_therapy database
     */
    public List<Map<String, Object>> fetchExercisesWithPagination(int page, int size) {
        int offset = page * size;
        String sql = "SELECT * FROM exercises LIMIT ? OFFSET ?";
        return jdbcTemplate.queryForList(sql, size, offset);
    }
    
    /**
     * Search exercises by name or description from the speech_therapy database
     */
    public List<Map<String, Object>> searchExercises(String searchTerm) {
        String sql = "SELECT * FROM exercises WHERE exercise_name LIKE ? OR description LIKE ?";
        String likePattern = "%" + searchTerm + "%";
        return jdbcTemplate.queryForList(sql, likePattern, likePattern);
    }
    
    /**
     * Get exercise statistics from the database
     */
    public Map<String, Object> getExerciseStatistics() {
        String sql = "SELECT " +
                    "COUNT(*) as total_exercises, " +
                    "COUNT(DISTINCT exercise_type) as exercise_types, " +
                    "COUNT(DISTINCT difficulty_level) as difficulty_levels, " +
                    "COUNT(DISTINCT category) as categories " +
                    "FROM exercises";
        return jdbcTemplate.queryForMap(sql);
    }
    
    /**
     * Fetch exercises for a specific user's level
     */
    public List<Map<String, Object>> fetchExercisesForUserLevel(String userLevel) {
        String sql = "SELECT * FROM exercises WHERE difficulty_level = ? ORDER BY RAND() LIMIT 10";
        return jdbcTemplate.queryForList(sql, userLevel);
    }
    
    /**
     * Get exercise categories available in the database
     */
    public List<String> getAvailableCategories() {
        String sql = "SELECT DISTINCT category FROM exercises WHERE category IS NOT NULL";
        return jdbcTemplate.queryForList(sql, String.class);
    }
    
    /**
     * Get exercise types available in the database
     */
    public List<String> getAvailableExerciseTypes() {
        String sql = "SELECT DISTINCT exercise_type FROM exercises WHERE exercise_type IS NOT NULL";
        return jdbcTemplate.queryForList(sql, String.class);
    }
    
    /**
     * Get difficulty levels available in the database
     */
    public List<String> getAvailableDifficultyLevels() {
        String sql = "SELECT DISTINCT difficulty_level FROM exercises WHERE difficulty_level IS NOT NULL";
        return jdbcTemplate.queryForList(sql, String.class);
    }
}
