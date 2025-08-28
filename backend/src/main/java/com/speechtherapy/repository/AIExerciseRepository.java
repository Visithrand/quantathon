package com.speechtherapy.repository;

import com.speechtherapy.model.AIExercise;
import com.speechtherapy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIExerciseRepository extends JpaRepository<AIExercise, Long> {
    
    List<AIExercise> findByUserOrderByCreatedAtDesc(User user);
    
    List<AIExercise> findByUserAndIsCompletedFalseOrderByCreatedAtDesc(User user);
    
    List<AIExercise> findByUserAndExerciseTypeOrderByCreatedAtDesc(User user, String exerciseType);
    
    List<AIExercise> findByUserAndDifficultyLevelOrderByCreatedAtDesc(User user, String difficultyLevel);
    
    @Query("SELECT a FROM AIExercise a WHERE a.user = :user AND a.expiresAt > :now AND a.isCompleted = false ORDER BY a.createdAt DESC")
    List<AIExercise> findActiveExercisesByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT a FROM AIExercise a WHERE a.user = :user AND a.targetPhonemes LIKE %:phoneme% ORDER BY a.createdAt DESC")
    List<AIExercise> findByUserAndTargetPhoneme(@Param("user") User user, @Param("phoneme") String phoneme);
    
    @Query("SELECT a FROM AIExercise a WHERE a.user = :user AND a.targetSkills LIKE %:skill% ORDER BY a.createdAt DESC")
    List<AIExercise> findByUserAndTargetSkill(@Param("user") User user, @Param("skill") String skill);
    
    @Query("SELECT a FROM AIExercise a WHERE a.user = :user AND a.context = :context ORDER BY a.createdAt DESC")
    List<AIExercise> findByUserAndContext(@Param("user") User user, @Param("context") String context);
    
    @Query("SELECT a FROM AIExercise a WHERE a.user = :user AND a.createdAt >= :since ORDER BY a.createdAt DESC")
    List<AIExercise> findByUserSince(@Param("user") User user, @Param("since") LocalDateTime since);
}
