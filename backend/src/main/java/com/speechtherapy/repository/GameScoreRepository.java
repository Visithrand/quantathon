package com.speechtherapy.repository;

import com.speechtherapy.model.GameScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameScoreRepository extends JpaRepository<GameScore, Long> {
    
    // Find all scores for a specific user
    List<GameScore> findByUserIdOrderByTimestampDesc(Long userId);
    
    // Find all scores for a specific game
    List<GameScore> findByGameIdOrderByPointsDesc(String gameId);
    
    // Find scores for a user in a specific game
    List<GameScore> findByUserIdAndGameIdOrderByTimestampDesc(Long userId, String gameId);
    
    // Find the best score for a user in a specific game
    Optional<GameScore> findTopByUserIdAndGameIdOrderByPointsDesc(Long userId, String gameId);
    
    // Find all scores for a user within a date range
    List<GameScore> findByUserIdAndTimestampBetweenOrderByTimestampDesc(
        Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find scores by difficulty level
    List<GameScore> findByDifficultyOrderByPointsDesc(String difficulty);
    
    // Find scores for a user by difficulty level
    List<GameScore> findByUserIdAndDifficultyOrderByTimestampDesc(Long userId, String difficulty);
    
    // Count total games played by a user
    long countByUserId(Long userId);
    
    // Count games played by a user in a specific game
    long countByUserIdAndGameId(Long userId, String gameId);
    
    // Find recent scores (last 30 days)
    @Query("SELECT gs FROM GameScore gs WHERE gs.user.id = :userId AND gs.timestamp >= :thirtyDaysAgo ORDER BY gs.timestamp DESC")
    List<GameScore> findRecentScoresByUserId(@Param("userId") Long userId, @Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Calculate total points for a user
    @Query("SELECT COALESCE(SUM(gs.points), 0) FROM GameScore gs WHERE gs.user.id = :userId")
    Integer getTotalPointsByUserId(@Param("userId") Long userId);
    
    // Calculate average accuracy for a user
    @Query("SELECT COALESCE(AVG(gs.accuracy), 0) FROM GameScore gs WHERE gs.user.id = :userId AND gs.accuracy IS NOT NULL")
    Double getAverageAccuracyByUserId(@Param("userId") Long userId);
    
    // Find top scores across all users
    @Query("SELECT gs FROM GameScore gs ORDER BY gs.points DESC")
    List<GameScore> findTopScores();
    
    // Find top scores for a specific game
    @Query("SELECT gs FROM GameScore gs WHERE gs.gameId = :gameId ORDER BY gs.points DESC")
    List<GameScore> findTopScoresByGame(@Param("gameId") String gameId);
    
    // Find top scores for a user
    @Query("SELECT gs FROM GameScore gs WHERE gs.user.id = :userId ORDER BY gs.points DESC")
    List<GameScore> findTopScoresByUserId(@Param("userId") Long userId);
    
    // Find scores with high accuracy (above threshold)
    @Query("SELECT gs FROM GameScore gs WHERE gs.accuracy >= :threshold ORDER BY gs.accuracy DESC")
    List<GameScore> findHighAccuracyScores(@Param("threshold") Integer threshold);
    
    // Find scores for a user with high accuracy
    @Query("SELECT gs FROM GameScore gs WHERE gs.user.id = :userId AND gs.accuracy >= :threshold ORDER BY gs.accuracy DESC")
    List<GameScore> findHighAccuracyScoresByUserId(@Param("userId") Long userId, @Param("threshold") Integer threshold);
    
    // Get game statistics for a user
    @Query("SELECT gs.gameId, COUNT(gs), AVG(gs.points), AVG(gs.accuracy) " +
           "FROM GameScore gs WHERE gs.user.id = :userId GROUP BY gs.gameId")
    List<Object[]> getGameStatisticsByUserId(@Param("userId") Long userId);
    
    // Get difficulty statistics for a user
    @Query("SELECT gs.difficulty, COUNT(gs), AVG(gs.points), AVG(gs.accuracy) " +
           "FROM GameScore gs WHERE gs.user.id = :userId GROUP BY gs.difficulty")
    List<Object[]> getDifficultyStatisticsByUserId(@Param("userId") Long userId);
    
    // Find scores by date range
    @Query("SELECT gs FROM GameScore gs WHERE gs.timestamp BETWEEN :startDate AND :endDate ORDER BY gs.timestamp DESC")
    List<GameScore> findScoresByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find scores for a user by date range
    @Query("SELECT gs FROM GameScore gs WHERE gs.user.id = :userId AND gs.timestamp BETWEEN :startDate AND :endDate ORDER BY gs.timestamp DESC")
    List<GameScore> findScoresByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Delete old scores (cleanup)
    @Query("DELETE FROM GameScore gs WHERE gs.timestamp < :cutoffDate")
    void deleteOldScores(@Param("cutoffDate") LocalDateTime cutoffDate);
}
