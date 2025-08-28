package com.speechtherapy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

@Entity
@Table(name = "fluency_scores")
public class FluencyScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;
    
    @Column(name = "session_date")
    private LocalDateTime sessionDate;
    
    @Min(0) @Max(100)
    @Column(name = "pronunciation_score")
    private Integer pronunciationScore;
    
    @Min(0) @Max(100)
    @Column(name = "rhythm_score")
    private Integer rhythmScore;
    
    @Min(0) @Max(100)
    @Column(name = "pace_score")
    private Integer paceScore;
    
    @Min(0) @Max(100)
    @Column(name = "expression_score")
    private Integer expressionScore;
    
    @Min(0) @Max(100)
    @Column(name = "overall_fluency_score")
    private Integer overallFluencyScore;
    
    @Column(name = "speaking_rate_wpm")
    private Integer speakingRateWpm; // Words per minute
    
    @Column(name = "pause_count")
    private Integer pauseCount;
    
    @Column(name = "stutter_detected")
    private Boolean stutterDetected = false;
    
    @Column(name = "emotion_detected")
    private String emotionDetected; // nervous, confident, excited, calm
    
    @Column(name = "feedback_notes", length = 1000)
    private String feedbackNotes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public FluencyScore() {
        this.createdAt = LocalDateTime.now();
        this.sessionDate = LocalDateTime.now();
    }
    
    public FluencyScore(User user, Exercise exercise) {
        this();
        this.user = user;
        this.exercise = exercise;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    
    public LocalDateTime getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDateTime sessionDate) { this.sessionDate = sessionDate; }
    
    public Integer getPronunciationScore() { return pronunciationScore; }
    public void setPronunciationScore(Integer pronunciationScore) { this.pronunciationScore = pronunciationScore; }
    
    public Integer getRhythmScore() { return rhythmScore; }
    public void setRhythmScore(Integer rhythmScore) { this.rhythmScore = rhythmScore; }
    
    public Integer getPaceScore() { return paceScore; }
    public void setPaceScore(Integer paceScore) { this.paceScore = paceScore; }
    
    public Integer getExpressionScore() { return expressionScore; }
    public void setExpressionScore(Integer expressionScore) { this.expressionScore = expressionScore; }
    
    public Integer getOverallFluencyScore() { return overallFluencyScore; }
    public void setOverallFluencyScore(Integer overallFluencyScore) { this.overallFluencyScore = overallFluencyScore; }
    
    public Integer getSpeakingRateWpm() { return speakingRateWpm; }
    public void setSpeakingRateWpm(Integer speakingRateWpm) { this.speakingRateWpm = speakingRateWpm; }
    
    public Integer getPauseCount() { return pauseCount; }
    public void setPauseCount(Integer pauseCount) { this.pauseCount = pauseCount; }
    
    public Boolean getStutterDetected() { return stutterDetected; }
    public void setStutterDetected(Boolean stutterDetected) { this.stutterDetected = stutterDetected; }
    
    public String getEmotionDetected() { return emotionDetected; }
    public void setEmotionDetected(String emotionDetected) { this.emotionDetected = emotionDetected; }
    
    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
