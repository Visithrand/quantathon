package com.speechtherapy.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
public class UserProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "practice_date")
    private LocalDate practiceDate;
    
    @Column(name = "total_practice_time") // in minutes
    private Integer totalPracticeTime = 0;
    
    @Column(name = "exercises_completed")
    private Integer exercisesCompleted = 0;
    
    @Column(name = "average_score")
    private Double averageScore = 0.0;
    
    @Column(name = "phoneme_exercises")
    private Integer phonemeExercises = 0;
    
    @Column(name = "word_exercises")
    private Integer wordExercises = 0;
    
    @Column(name = "sentence_exercises")
    private Integer sentenceExercises = 0;
    
    @Column(name = "conversation_exercises")
    private Integer conversationExercises = 0;
    
    @Column(name = "points_earned")
    private Integer pointsEarned = 0;
    
    @Column(name = "goals_met")
    private Boolean goalsMet = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public UserProgress() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.practiceDate = LocalDate.now();
    }
    
    public UserProgress(User user, LocalDate practiceDate) {
        this();
        this.user = user;
        this.practiceDate = practiceDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDate getPracticeDate() { return practiceDate; }
    public void setPracticeDate(LocalDate practiceDate) { this.practiceDate = practiceDate; }
    
    public Integer getTotalPracticeTime() { return totalPracticeTime; }
    public void setTotalPracticeTime(Integer totalPracticeTime) { this.totalPracticeTime = totalPracticeTime; }
    
    public Integer getExercisesCompleted() { return exercisesCompleted; }
    public void setExercisesCompleted(Integer exercisesCompleted) { this.exercisesCompleted = exercisesCompleted; }
    
    public Double getAverageScore() { return averageScore; }
    public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }
    
    public Integer getPhonemeExercises() { return phonemeExercises; }
    public void setPhonemeExercises(Integer phonemeExercises) { this.phonemeExercises = phonemeExercises; }
    
    public Integer getWordExercises() { return wordExercises; }
    public void setWordExercises(Integer wordExercises) { this.wordExercises = wordExercises; }
    
    public Integer getSentenceExercises() { return sentenceExercises; }
    public void setSentenceExercises(Integer sentenceExercises) { this.sentenceExercises = sentenceExercises; }
    
    public Integer getConversationExercises() { return conversationExercises; }
    public void setConversationExercises(Integer conversationExercises) { this.conversationExercises = conversationExercises; }
    
    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
    
    public Boolean getGoalsMet() { return goalsMet; }
    public void setGoalsMet(Boolean goalsMet) { this.goalsMet = goalsMet; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}