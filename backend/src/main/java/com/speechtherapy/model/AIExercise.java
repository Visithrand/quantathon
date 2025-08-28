package com.speechtherapy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_exercises")
public class AIExercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank(message = "Exercise content is required")
    @Column(name = "exercise_content", nullable = false, length = 2000)
    private String exerciseContent;
    
    @Column(name = "exercise_type")
    private String exerciseType; // sentence, story, conversation, tongue_twister
    
    @Column(name = "difficulty_level")
    private String difficultyLevel;
    
    @Column(name = "target_phonemes")
    private String targetPhonemes; // Comma-separated phonemes to practice
    
    @Column(name = "target_skills")
    private String targetSkills; // Comma-separated skills to improve
    
    @Column(name = "context")
    private String context; // real-life scenario, academic, professional, etc.
    
    @Column(name = "ai_reasoning", length = 1000)
    private String aiReasoning; // Why this exercise was suggested
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "performance_score")
    private Integer performanceScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt; // When the exercise becomes stale
    
    // Constructors
    public AIExercise() {
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusDays(7); // Expires in 7 days
    }
    
    public AIExercise(User user, String exerciseContent, String exerciseType) {
        this();
        this.user = user;
        this.exerciseContent = exerciseContent;
        this.exerciseType = exerciseType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getExerciseContent() { return exerciseContent; }
    public void setExerciseContent(String exerciseContent) { this.exerciseContent = exerciseContent; }
    
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public String getTargetPhonemes() { return targetPhonemes; }
    public void setTargetPhonemes(String targetPhonemes) { this.targetPhonemes = targetPhonemes; }
    
    public String getTargetSkills() { return targetSkills; }
    public void setTargetSkills(String targetSkills) { this.targetSkills = targetSkills; }
    
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    
    public String getAiReasoning() { return aiReasoning; }
    public void setAiReasoning(String aiReasoning) { this.aiReasoning = aiReasoning; }
    
    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public Integer getPerformanceScore() { return performanceScore; }
    public void setPerformanceScore(Integer performanceScore) { this.performanceScore = performanceScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
