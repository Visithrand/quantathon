package com.speechtherapy.repository;

import com.speechtherapy.model.BodyExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BodyExerciseRepository extends JpaRepository<BodyExercise, Long> {
    
    List<BodyExercise> findByExerciseType(String exerciseType);
    
    List<BodyExercise> findByDifficultyLevel(String difficultyLevel);
    
    List<BodyExercise> findByExerciseTypeAndDifficultyLevel(String exerciseType, String difficultyLevel);
    
    @Query("SELECT b FROM BodyExercise b WHERE b.targetMuscles LIKE %:muscle%")
    List<BodyExercise> findByTargetMuscle(@Param("muscle") String muscle);
    
    @Query("SELECT b FROM BodyExercise b WHERE b.durationSeconds <= :maxDuration")
    List<BodyExercise> findByMaxDuration(@Param("maxDuration") Integer maxDuration);
    
    @Query("SELECT DISTINCT b.exerciseType FROM BodyExercise b")
    List<String> findAllExerciseTypes();
    
    @Query("SELECT DISTINCT b.difficultyLevel FROM BodyExercise b")
    List<String> findAllDifficultyLevels();
}
