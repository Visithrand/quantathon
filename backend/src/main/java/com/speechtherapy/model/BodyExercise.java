package com.speechtherapy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Entity
@Table(name = "body_exercises")
public class BodyExercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Exercise name is required")
    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;
    
    @NotBlank(message = "Exercise type is required")
    @Column(name = "exercise_type", nullable = false)
    private String exerciseType; // breathing, facial, jaw, tongue, vocal, relaxation
    
    @NotBlank(message = "Difficulty level is required")
    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel; // beginner, intermediate, advanced
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "instructions", length = 1000)
    private String instructions;
    
    @Min(value = 10, message = "Duration must be at least 10 seconds")
    @Max(value = 600, message = "Duration cannot exceed 10 minutes")
    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;
    
    @Column(name = "repetitions")
    private Integer repetitions;
    
    @Column(name = "target_muscles", length = 200)
    private String targetMuscles;
    
    @Column(name = "speech_benefits", length = 500)
    private String speechBenefits;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;
    
    // Constructors
    public BodyExercise() {
        this.createdAt = java.time.LocalDateTime.now();
    }
    
    public BodyExercise(String exerciseName, String exerciseType, String difficultyLevel, 
                       String description, String instructions, Integer durationSeconds, 
                       Integer repetitions, String targetMuscles, String speechBenefits) {
        this();
        this.exerciseName = exerciseName;
        this.exerciseType = exerciseType;
        this.difficultyLevel = difficultyLevel;
        this.description = description;
        this.instructions = instructions;
        this.durationSeconds = durationSeconds;
        this.repetitions = repetitions;
        this.targetMuscles = targetMuscles;
        this.speechBenefits = speechBenefits;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getExerciseName() { return exerciseName; }
    public void setExerciseName(String exerciseName) { this.exerciseName = exerciseName; }
    
    public String getExerciseType() { return exerciseType; }
    public void setExerciseType(String exerciseType) { this.exerciseType = exerciseType; }
    
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    
    public Integer getRepetitions() { return repetitions; }
    public void setRepetitions(Integer repetitions) { this.repetitions = repetitions; }
    
    public String getTargetMuscles() { return targetMuscles; }
    public void setTargetMuscles(String targetMuscles) { this.targetMuscles = targetMuscles; }
    
    public String getSpeechBenefits() { return speechBenefits; }
    public void setSpeechBenefits(String speechBenefits) { this.speechBenefits = speechBenefits; }
    
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}
