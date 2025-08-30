package com.speechtherapy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Locale;

@Entity
@Table(name = "game_scores")
public class GameScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "game_id", nullable = false)
    private String gameId;
    
    @Column(name = "points", nullable = false)
    private Integer points;
    
    @Column(name = "accuracy")
    private Integer accuracy;
    
    @Column(name = "attempts")
    private Integer attempts;
    
    @Column(name = "hints_used")
    private Integer hintsUsed;
    
    @Column(name = "total_time")
    private Long totalTime; // in milliseconds
    
    @Column(name = "average_speed")
    private Double averageSpeed; // in seconds
    
    @Column(name = "difficulty")
    private String difficulty;
    
    @Column(name = "rounds_completed")
    private Integer roundsCompleted;
    
    @Column(name = "words_completed")
    private Integer wordsCompleted;
    
    @Column(name = "sentences_completed")
    private Integer sentencesCompleted;
    
    @Column(name = "questions_completed")
    private Integer questionsCompleted;
    
    @Column(name = "twisters_completed")
    private Integer twistersCompleted;
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public GameScore() {
        this.timestamp = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public GameScore(User user, String gameId, Integer points) {
        this();
        this.user = user;
        this.gameId = gameId;
        this.points = points;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getGameId() {
        return gameId;
    }
    
    public void setGameId(String gameId) {
        this.gameId = gameId;
    }
    
    public Integer getPoints() {
        return points;
    }
    
    public void setPoints(Integer points) {
        this.points = points;
    }
    
    public Integer getAccuracy() {
        return accuracy;
    }
    
    public void setAccuracy(Integer accuracy) {
        this.accuracy = accuracy;
    }
    
    public Integer getAttempts() {
        return attempts;
    }
    
    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }
    
    public Integer getHintsUsed() {
        return hintsUsed;
    }
    
    public void setHintsUsed(Integer hintsUsed) {
        this.hintsUsed = hintsUsed;
    }
    
    public Long getTotalTime() {
        return totalTime;
    }
    
    public void setTotalTime(Long totalTime) {
        this.totalTime = totalTime;
    }
    
    public Double getAverageSpeed() {
        return averageSpeed;
    }
    
    public void setAverageSpeed(Double averageSpeed) {
        this.averageSpeed = averageSpeed;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public Integer getRoundsCompleted() {
        return roundsCompleted;
    }
    
    public void setRoundsCompleted(Integer roundsCompleted) {
        this.roundsCompleted = roundsCompleted;
    }
    
    public Integer getWordsCompleted() {
        return wordsCompleted;
    }
    
    public void setWordsCompleted(Integer wordsCompleted) {
        this.wordsCompleted = wordsCompleted;
    }
    
    public Integer getSentencesCompleted() {
        return sentencesCompleted;
    }
    
    public void setSentencesCompleted(Integer sentencesCompleted) {
        this.sentencesCompleted = sentencesCompleted;
    }
    
    public Integer getQuestionsCompleted() {
        return questionsCompleted;
    }
    
    public void setQuestionsCompleted(Integer questionsCompleted) {
        this.questionsCompleted = questionsCompleted;
    }
    
    public Integer getTwistersCompleted() {
        return twistersCompleted;
    }
    
    public void setTwistersCompleted(Integer twistersCompleted) {
        this.twistersCompleted = twistersCompleted;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public String getGameDisplayName() {
        switch (gameId) {
            case "word-repetition":
                return "Word Repetition Challenge";
            case "tongue-twister":
                return "Tongue Twister Challenge";
            case "fill-in-blank":
                return "Fill-in-the-Blank";
            case "sound-matching":
                return "Sound Matching";
            case "audio-quiz":
                return "Audio Quiz";
            case "timed-pronunciation":
                return "Timed Challenge";
            case "phoneme-blending":
                return "Phoneme Blending";
            default:
                // Fix: replaceAll expects a functional interface, not a method reference
                // We'll manually capitalize the first letter of each word
                String[] words = gameId.replace("-", " ").split(" ");
                StringBuilder capitalized = new StringBuilder();
                for (String word : words) {
                    if (!word.isEmpty()) {
                        capitalized.append(Character.toUpperCase(word.charAt(0)))
                                   .append(word.substring(1).toLowerCase(Locale.ROOT))
                                   .append(" ");
                    }
                }
                return capitalized.toString().trim();
        }
    }
    
    public String getDifficultyColor() {
        if (difficulty == null) return "gray";
        switch (difficulty.toLowerCase(Locale.ROOT)) {
            case "beginner":
                return "green";
            case "intermediate":
                return "yellow";
            case "advanced":
            case "expert":
                return "red";
            default:
                return "blue";
        }
    }
}
