package com.speechtherapy.repository;

import com.speechtherapy.model.User;
import com.speechtherapy.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    
    Optional<UserProgress> findByUserAndPracticeDate(User user, LocalDate practiceDate);
    
    List<UserProgress> findByUserOrderByPracticeDateDesc(User user);
    
    @Query("SELECT up FROM UserProgress up WHERE up.user = :user AND up.practiceDate >= :startDate AND up.practiceDate <= :endDate ORDER BY up.practiceDate ASC")
    List<UserProgress> findByUserAndDateRange(@Param("user") User user, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(up.totalPracticeTime) FROM UserProgress up WHERE up.user = :user AND up.practiceDate >= :startDate")
    Integer getTotalPracticeTimeFromDate(@Param("user") User user, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user = :user AND up.goalsMet = true AND up.practiceDate >= :startDate")
    Long getGoalsMetCount(@Param("user") User user, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT AVG(up.averageScore) FROM UserProgress up WHERE up.user = :user AND up.practiceDate >= :startDate")
    Double getAverageScoreFromDate(@Param("user") User user, @Param("startDate") LocalDate startDate);
}