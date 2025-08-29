package com.speechtherapy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "body_exercises")
public class DatabaseExercise {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "target_muscles")
    private String targetMuscles;
    
    @Column(name = "duration_seconds")
    private Integer durationSeconds;
    
    @Column(name = "repetitions")
    private Integer repetitions;
    
    @Column(name = "sets")
    private Integer sets;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DatabaseExercise() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
    
    public DatabaseExercise(String description, String targetMuscles) {
        this();
        this.description = description;
        this.targetMuscles = targetMuscles;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getTargetMuscles() { return targetMuscles; }
    public void setTargetMuscles(String targetMuscles) { this.targetMuscles = targetMuscles; }
    
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    
    public Integer getRepetitions() { return repetitions; }
    public void setRepetitions(Integer repetitions) { this.repetitions = repetitions; }
    
    public Integer getSets() { return sets; }
    public void setSets(Integer sets) { this.sets = sets; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods for compatibility
    public String getExerciseName() { 
        return "Exercise " + id; // Generate name from ID since no name field
    }
    
    public String getExerciseType() { 
        return getExerciseTypeFromDescription(); // Derive from description
    }
    
    public String getDifficultyLevel() { 
        return getDifficultyLevelFromDescription(); // Derive from description
    }
    
    public String getCategory() { 
        return getCategoryFromTargetMuscles(); // Derive from target muscles
    }
    
    public String getSpeechBenefits() { 
        return "Improves " + targetMuscles + " coordination and strength"; // Generate from target muscles
    }
    
    public String getInstructions() { 
        return "Follow the exercise description: " + description; // Use description as instructions
    }
    
    public Integer getPointsEarned() { 
        return (durationSeconds != null ? durationSeconds / 10 : 5) + (repetitions != null ? repetitions : 1); // Calculate points
    }
    
    // Private helper methods
    private String getExerciseTypeFromDescription() {
        String desc = description != null ? description.toLowerCase() : "";
        if (desc.contains("breathing")) return "breathing";
        if (desc.contains("facial")) return "facial";
        if (desc.contains("jaw")) return "jaw";
        if (desc.contains("tongue")) return "tongue";
        if (desc.contains("vocal")) return "vocal";
        if (desc.contains("relaxation")) return "relaxation";
        return "general";
    }
    
    private String getDifficultyLevelFromDescription() {
        String desc = description != null ? description.toLowerCase() : "";
        if (desc.contains("advanced") || desc.contains("complex")) return "advanced";
        if (desc.contains("intermediate") || desc.contains("moderate")) return "intermediate";
        return "beginner"; // Default to beginner
    }
    
    private String getCategoryFromTargetMuscles() {
        String muscles = targetMuscles != null ? targetMuscles.toLowerCase() : "";
        if (muscles.contains("diaphragm") || muscles.contains("lungs")) return "Breathing & Voice Control";
        if (muscles.contains("facial") || muscles.contains("lips")) return "Facial Muscle Training";
        if (muscles.contains("jaw")) return "Jaw & Mouth Control";
        if (muscles.contains("tongue")) return "Tongue & Articulation";
        if (muscles.contains("vocal")) return "Vocal & Resonance";
        return "General Speech Training";
    }
    
    @Override
    public String toString() {
        return "DatabaseExercise{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", targetMuscles='" + targetMuscles + '\'' +
                ", durationSeconds=" + durationSeconds +
                ", repetitions=" + repetitions +
                ", sets=" + sets +
                ", isActive=" + isActive +
                '}';
    }
}
