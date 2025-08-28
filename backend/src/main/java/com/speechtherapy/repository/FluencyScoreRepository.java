package com.speechtherapy.repository;

import com.speechtherapy.model.FluencyScore;
import com.speechtherapy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FluencyScoreRepository extends JpaRepository<FluencyScore, Long> {
    
    List<FluencyScore> findByUserOrderBySessionDateDesc(User user);
    
    List<FluencyScore> findByUserAndSessionDateBetweenOrderBySessionDateDesc(
        User user, LocalDateTime startDate, LocalDateTime endDate);
    
    Optional<FluencyScore> findTopByUserOrderBySessionDateDesc(User user);
    
    @Query("SELECT AVG(f.overallFluencyScore) FROM FluencyScore f WHERE f.user = :user AND f.sessionDate >= :startDate")
    Double getAverageFluencyScoreSince(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT f FROM FluencyScore f WHERE f.user = :user AND f.stutterDetected = true ORDER BY f.sessionDate DESC")
    List<FluencyScore> findStutterSessionsByUser(@Param("user") User user);
    
    @Query("SELECT f FROM FluencyScore f WHERE f.user = :user AND f.emotionDetected = :emotion ORDER BY f.sessionDate DESC")
    List<FluencyScore> findByUserAndEmotion(@Param("user") User user, @Param("emotion") String emotion);
    
    @Query("SELECT f FROM FluencyScore f WHERE f.user = :user AND f.overallFluencyScore < :threshold ORDER BY f.sessionDate DESC")
    List<FluencyScore> findLowScoresByUser(@Param("user") User user, @Param("threshold") Integer threshold);
}
