package com.speechtherapy.repository;

import com.speechtherapy.model.WeeklyPlan;
import com.speechtherapy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, Long> {
    
    /**
     * Find weekly plan by user and week start date
     */
    Optional<WeeklyPlan> findByUserAndWeekStart(User user, LocalDate weekStart);
    
    /**
     * Find all weekly plans for a specific week
     */
    List<WeeklyPlan> findByWeekStart(LocalDate weekStart);
    
    /**
     * Find weekly plans by user
     */
    List<WeeklyPlan> findByUserOrderByWeekStartDesc(User user);
    
    /**
     * Find completed weekly plans by user
     */
    List<WeeklyPlan> findByUserAndIsCompletedTrueOrderByWeekStartDesc(User user);
    
    /**
     * Find weekly plans by user and date range
     */
    @Query("SELECT wp FROM WeeklyPlan wp WHERE wp.user = :user AND wp.weekStart >= :startDate AND wp.weekEnd <= :endDate ORDER BY wp.weekStart DESC")
    List<WeeklyPlan> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Find weekly plans that are on track (80% or more progress)
     */
    @Query("SELECT wp FROM WeeklyPlan wp WHERE wp.totalMinutesCompleted >= (wp.totalMinutesGoal * 0.8)")
    List<WeeklyPlan> findOnTrackPlans();
    
    /**
     * Count weekly plans by completion status
     */
    long countByIsCompleted(Boolean isCompleted);
    
    /**
     * Find weekly plans by difficulty level (through user)
     */
    @Query("SELECT wp FROM WeeklyPlan wp WHERE wp.user.difficultyLevel = :difficultyLevel")
    List<WeeklyPlan> findByUserDifficultyLevel(@Param("difficultyLevel") String difficultyLevel);
}
