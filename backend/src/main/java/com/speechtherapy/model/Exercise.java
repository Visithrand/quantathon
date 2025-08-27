package com.speechtherapy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercises")
public class Exercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank(message = "Exercise type is required")
    @Column(name = "exercise_type", nullable = false)
    private String exerciseType; // phoneme, word, sentence, conversation, tongue_twister
    
    @Column(name = "target_text")
    private String targetText; // The text/phoneme being practiced
    
    @Column(name = "difficulty_level")
    private String difficultyLevel;
    
    @Min(0) @Max(100)
    @Column(name = "overall_score")
    private Integer overallScore;
    
    @Min(0) @Max(100)
    @Column(name = "accuracy_score")
    private Integer accuracyScore;
    
    @Min(0) @Max(100)
    @Column(name = "clarity_score")
    private Integer clarityScore;
    
    @Min(0) @Max(100)
    @Column(name = "fluency_score")
    private Integer fluencyScore;
    
    @Column(name = "feedback", length = 1000)
    private String feedback;
    
    @Column(name = "audio_file_path")
    private String audioFilePath;
    
    @Column(name = "session_duration") // in seconds
    private Integer sessionDuration;
    
    @Column(name = "points_earned")
    private Integer pointsEarned;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Exercise() {
        this.createdAt = LocalDateTime.now();
        this.completedAt = LocalDateTime.now();
    }
    
    public Exercise(User user, String exerciseType, String targetText) {
        this();
        this.user = user;
        this.exerciseType = exerciseType;
        this.targetText = targetText;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    
    public String getTargetText() { return targetText; }
    public void setTargetText(String targetText) { this.targetText = targetText; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }
    
    public Integer getAccuracyScore() { return accuracyScore; }
    public void setAccuracyScore(Integer accuracyScore) { this.accuracyScore = accuracyScore; }
    
    public Integer getClarityScore() { return clarityScore; }
    public void setClarityScore(Integer clarityScore) { this.clarityScore = clarityScore; }
    
    public Integer getFluencyScore() { return fluencyScore; }
    public void setFluencyScore(Integer fluencyScore) { this.fluencyScore = fluencyScore; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public String getAudioFilePath() { return audioFilePath; }
    public void setAudioFilePath(String audioFilePath) { this.audioFilePath = audioFilePath; }
    
    public Integer getSessionDuration() { return sessionDuration; }
    public void setSessionDuration(Integer sessionDuration) { this.sessionDuration = sessionDuration; }
    
    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}