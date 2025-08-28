package com.speechtherapy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "completed_exercises")
public class CompletedExercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;
    
    @Column(name = "exercise_type", nullable = false)
    private String exerciseType;
    
    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel;
    
    @Column(name = "duration_seconds")
    private Integer durationSeconds;
    
    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;
    
    @Column(name = "practice_date", nullable = false)
    private java.time.LocalDate practiceDate;
    
    @Column(name = "notes")
    private String notes;
    
    // Constructors
    public CompletedExercise() {
        this.completedAt = LocalDateTime.now();
    }
    
    public CompletedExercise(User user, String exerciseName, String exerciseType, 
                           String difficultyLevel, Integer durationSeconds) {
        this();
        this.user = user;
        this.exerciseName = exerciseName;
        this.exerciseType = exerciseType;
        this.difficultyLevel = difficultyLevel;
        this.durationSeconds = durationSeconds;
        this.practiceDate = java.time.LocalDate.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public java.time.LocalDate getPracticeDate() { return practiceDate; }
    public void setPracticeDate(java.time.LocalDate practiceDate) { this.practiceDate = practiceDate; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
