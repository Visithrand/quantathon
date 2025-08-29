package com.speechtherapy.repository;

import com.speechtherapy.model.DatabaseExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DatabaseExerciseRepository extends JpaRepository<DatabaseExercise, Long> {
    
    /**
     * Search exercises by description or target muscles
     */
    @Query(value = "SELECT * FROM body_exercises WHERE " +
           "LOWER(description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(target_muscles) LIKE LOWER(CONCAT('%', :searchTerm, '%'))", 
           nativeQuery = true)
    List<DatabaseExercise> searchExercises(@Param("searchTerm") String searchTerm);
    
        // These methods will be handled in the service layer to avoid HQL compatibility issues
}
