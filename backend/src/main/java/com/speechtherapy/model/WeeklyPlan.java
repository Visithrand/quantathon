package com.speechtherapy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "weekly_plans")
public class WeeklyPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;
    
    @Column(name = "week_end", nullable = false)
    private LocalDate weekEnd;
    
    @Column(name = "total_minutes_goal")
    private Integer totalMinutesGoal = 105; // 15 minutes per day * 7 days
    
    @Column(name = "total_minutes_completed")
    private Integer totalMinutesCompleted = 0;
    
    @Column(name = "body_exercises_goal")
    private Integer bodyExercisesGoal = 7; // 1 body exercise per day
    
    @Column(name = "body_exercises_completed")
    private Integer bodyExercisesCompleted = 0;
    
    @Column(name = "speech_exercises_goal")
    private Integer speechExercisesGoal = 14; // 2 speech exercises per day
    
    @Column(name = "speech_exercises_completed")
    private Integer speechExercisesCompleted = 0;
    
    @Column(name = "weekly_streak")
    private Integer weeklyStreak = 0;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;
    
    // Constructors
    public WeeklyPlan() {
        this.createdAt = java.time.LocalDateTime.now();
        this.updatedAt = java.time.LocalDateTime.now();
    }
    
    public WeeklyPlan(User user, LocalDate weekStart) {
        this();
        this.user = user;
        this.weekStart = weekStart;
        this.weekEnd = weekStart.plusDays(6);
    }
    
    // Helper methods
    public double getProgressPercentage() {
        if (totalMinutesGoal == 0) return 0.0;
        return Math.min(100.0, (double) totalMinutesCompleted / totalMinutesGoal * 100);
    }
    
    public double getBodyExercisesProgress() {
        if (bodyExercisesGoal == 0) return 0.0;
        return Math.min(100.0, (double) bodyExercisesCompleted / bodyExercisesGoal * 100);
    }
    
    public double getSpeechExercisesProgress() {
        if (speechExercisesGoal == 0) return 0.0;
        return Math.min(100.0, (double) speechExercisesCompleted / speechExercisesGoal * 100);
    }
    
    public boolean isOnTrack() {
        return getProgressPercentage() >= 80.0; // 80% or more is considered on track
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDate getWeekStart() { return weekStart; }
    public void setWeekStart(LocalDate weekStart) { this.weekStart = weekStart; }
    
    public LocalDate getWeekEnd() { return weekEnd; }
    public void setWeekEnd(LocalDate weekEnd) { this.weekEnd = weekEnd; }
    
    public Integer getTotalMinutesGoal() { return totalMinutesGoal; }
    public void setTotalMinutesGoal(Integer totalMinutesGoal) { this.totalMinutesGoal = totalMinutesGoal; }
    
    public Integer getTotalMinutesCompleted() { return totalMinutesCompleted; }
    public void setTotalMinutesCompleted(Integer totalMinutesCompleted) { this.totalMinutesCompleted = totalMinutesCompleted; }
    
    public Integer getBodyExercisesGoal() { return bodyExercisesGoal; }
    public void setBodyExercisesGoal(Integer bodyExercisesGoal) { this.bodyExercisesGoal = bodyExercisesGoal; }
    
    public Integer getBodyExercisesCompleted() { return bodyExercisesCompleted; }
    public void setBodyExercisesCompleted(Integer bodyExercisesCompleted) { this.bodyExercisesCompleted = bodyExercisesCompleted; }
    
    public Integer getSpeechExercisesGoal() { return speechExercisesGoal; }
    public void setSpeechExercisesGoal(Integer speechExercisesGoal) { this.speechExercisesGoal = speechExercisesGoal; }
    
    public Integer getSpeechExercisesCompleted() { return speechExercisesCompleted; }
    public void setSpeechExercisesCompleted(Integer speechExercisesCompleted) { this.speechExercisesCompleted = speechExercisesCompleted; }
    
    public Integer getWeeklyStreak() { return weeklyStreak; }
    public void setWeeklyStreak(Integer weeklyStreak) { this.weeklyStreak = weeklyStreak; }
    
    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = java.time.LocalDateTime.now();
    }
}
