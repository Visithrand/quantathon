package com.speechtherapy.service;

import com.speechtherapy.model.User;
import com.speechtherapy.model.UserProgress;
import com.speechtherapy.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ProgressService {
    
    @Autowired
    private UserProgressRepository userProgressRepository;
    
    public Map<String, Object> getUserProgressSummary(User user) {
        Map<String, Object> summary = new HashMap<>();
        
        // Today's progress
        LocalDate today = LocalDate.now();
        Optional<UserProgress> todayProgress = userProgressRepository.findByUserAndPracticeDate(user, today);
        
        if (todayProgress.isPresent()) {
            UserProgress tp = todayProgress.get();
            summary.put("todayPracticeTime", tp.getTotalPracticeTime());
            summary.put("todayExercises", tp.getExercisesCompleted());
            summary.put("todayAvgScore", tp.getAverageScore());
            summary.put("todayGoalsMet", tp.getGoalsMet());
            summary.put("todayPoints", tp.getPointsEarned());
        } else {
            summary.put("todayPracticeTime", 0);
            summary.put("todayExercises", 0);
            summary.put("todayAvgScore", 0.0);
            summary.put("todayGoalsMet", false);
            summary.put("todayPoints", 0);
        }
        
        // Weekly progress
        LocalDate weekStart = today.minusDays(6); // Last 7 days
        List<UserProgress> weeklyProgress = userProgressRepository.findByUserAndDateRange(user, weekStart, today);
        
        int weeklyPracticeTime = weeklyProgress.stream().mapToInt(UserProgress::getTotalPracticeTime).sum();
        int weeklyExercises = weeklyProgress.stream().mapToInt(UserProgress::getExercisesCompleted).sum();
        double weeklyAvgScore = weeklyProgress.stream().mapToDouble(UserProgress::getAverageScore).average().orElse(0.0);
        long weeklyGoalsMet = weeklyProgress.stream().mapToLong(p -> p.getGoalsMet() ? 1 : 0).sum();
        
        summary.put("weeklyPracticeTime", weeklyPracticeTime);
        summary.put("weeklyExercises", weeklyExercises);
        summary.put("weeklyAvgScore", weeklyAvgScore);
        summary.put("weeklyGoalsMet", weeklyGoalsMet);
        summary.put("weeklyProgressPercentage", Math.min(100, (weeklyPracticeTime * 100.0) / user.getWeeklyGoal()));
        
        // Daily goal progress
        int dailyProgress = todayProgress.map(UserProgress::getTotalPracticeTime).orElse(0);
        summary.put("dailyProgressPercentage", Math.min(100, (dailyProgress * 100.0) / user.getDailyGoal()));
        
        // Exercise breakdown
        if (todayProgress.isPresent()) {
            UserProgress tp = todayProgress.get();
            Map<String, Integer> exerciseBreakdown = new HashMap<>();
            exerciseBreakdown.put("phoneme", tp.getPhonemeExercises());
            exerciseBreakdown.put("word", tp.getWordExercises());
            exerciseBreakdown.put("sentence", tp.getSentenceExercises());
            exerciseBreakdown.put("conversation", tp.getConversationExercises());
            summary.put("exerciseBreakdown", exerciseBreakdown);
        }
        
        return summary;
    }
    
    public List<UserProgress> getWeeklyProgress(User user) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        return userProgressRepository.findByUserAndDateRange(user, weekStart, today);
    }
    
    public List<UserProgress> getMonthlyProgress(User user) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.minusDays(29);
        return userProgressRepository.findByUserAndDateRange(user, monthStart, today);
    }
    
    public UserProgress updateDailyProgress(User user, Map<String, Object> progressUpdate) {
        LocalDate today = LocalDate.now();
        Optional<UserProgress> existingProgress = userProgressRepository.findByUserAndPracticeDate(user, today);
        
        UserProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
        } else {
            progress = new UserProgress(user, today);
        }
        
        // Update fields if provided
        if (progressUpdate.containsKey("practiceTime")) {
            Integer practiceTime = (Integer) progressUpdate.get("practiceTime");
            progress.setTotalPracticeTime(practiceTime);
        }
        
        if (progressUpdate.containsKey("exercisesCompleted")) {
            Integer exercises = (Integer) progressUpdate.get("exercisesCompleted");
            progress.setExercisesCompleted(exercises);
        }
        
        if (progressUpdate.containsKey("averageScore")) {
            Double avgScore = (Double) progressUpdate.get("averageScore");
            progress.setAverageScore(avgScore);
        }
        
        if (progressUpdate.containsKey("pointsEarned")) {
            Integer points = (Integer) progressUpdate.get("pointsEarned");
            progress.setPointsEarned(points);
        }
        
        // Check if daily goal is met
        progress.setGoalsMet(progress.getTotalPracticeTime() >= user.getDailyGoal());
        
        return userProgressRepository.save(progress);
    }
    
    public Map<String, Object> getProgressAnalytics(User user) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Last 30 days progress
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.minusDays(29);
        List<UserProgress> monthlyData = userProgressRepository.findByUserAndDateRange(user, monthStart, today);
        
        // Calculate trends
        if (monthlyData.size() >= 14) {
            List<UserProgress> firstHalf = monthlyData.subList(0, monthlyData.size() / 2);
            List<UserProgress> secondHalf = monthlyData.subList(monthlyData.size() / 2, monthlyData.size());
            
            double firstHalfAvg = firstHalf.stream().mapToDouble(UserProgress::getAverageScore).average().orElse(0.0);
            double secondHalfAvg = secondHalf.stream().mapToDouble(UserProgress::getAverageScore).average().orElse(0.0);
            
            analytics.put("scoreTrend", secondHalfAvg - firstHalfAvg);
            analytics.put("improvementPercentage", ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100);
        }
        
        // Consistency metrics
        long activeDays = monthlyData.stream().filter(p -> p.getExercisesCompleted() > 0).count();
        analytics.put("activeDaysInMonth", activeDays);
        analytics.put("consistencyPercentage", (activeDays / 30.0) * 100);
        
        // Goal achievement rate
        long goalsMetCount = monthlyData.stream().filter(UserProgress::getGoalsMet).count();
        analytics.put("goalAchievementRate", activeDays > 0 ? (goalsMetCount / (double) activeDays) * 100 : 0);
        
        // Best and worst days
        Optional<UserProgress> bestDay = monthlyData.stream()
            .filter(p -> p.getAverageScore() > 0)
            .max((p1, p2) -> Double.compare(p1.getAverageScore(), p2.getAverageScore()));
        
        Optional<UserProgress> worstDay = monthlyData.stream()
            .filter(p -> p.getAverageScore() > 0)
            .min((p1, p2) -> Double.compare(p1.getAverageScore(), p2.getAverageScore()));
        
        if (bestDay.isPresent()) {
            analytics.put("bestDayScore", bestDay.get().getAverageScore());
            analytics.put("bestDayDate", bestDay.get().getPracticeDate());
        }
        
        if (worstDay.isPresent()) {
            analytics.put("worstDayScore", worstDay.get().getAverageScore());
            analytics.put("worstDayDate", worstDay.get().getPracticeDate());
        }
        
        return analytics;
    }
    
    public UserProgress getTodayProgress(User user) {
        LocalDate today = LocalDate.now();
        return userProgressRepository.findByUserAndPracticeDate(user, today)
            .orElse(new UserProgress(user, today));
    }
}