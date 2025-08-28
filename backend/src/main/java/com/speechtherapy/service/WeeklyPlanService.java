package com.speechtherapy.service;

import com.speechtherapy.model.*;
import com.speechtherapy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class WeeklyPlanService {
    
    @Autowired
    private WeeklyPlanRepository weeklyPlanRepository;
    
    @Autowired
    private UserProgressRepository userProgressRepository;
    
    @Autowired
    private BodyExerciseRepository bodyExerciseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Generate or get current week's plan for a user
     */
    public WeeklyPlan getOrCreateWeeklyPlan(User user) {
        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate weekEnd = weekStart.plusDays(6);
        
        Optional<WeeklyPlan> existingPlan = weeklyPlanRepository.findByUserAndWeekStart(user, weekStart);
        
        if (existingPlan.isPresent()) {
            return existingPlan.get();
        }
        
        // Create new weekly plan
        WeeklyPlan weeklyPlan = new WeeklyPlan(user, weekStart);
        
        // Set goals based on user's difficulty level
        setGoalsBasedOnDifficulty(weeklyPlan, user.getDifficultyLevel());
        
        return weeklyPlanRepository.save(weeklyPlan);
    }
    
    /**
     * Update weekly plan based on daily progress
     */
    public void updateWeeklyPlanFromDailyProgress(User user, LocalDate date) {
        WeeklyPlan weeklyPlan = getOrCreateWeeklyPlan(user);
        
        // Get daily progress for this date
        Optional<UserProgress> dailyProgress = userProgressRepository.findByUserAndPracticeDate(user, date);
        
        if (dailyProgress.isPresent()) {
            UserProgress progress = dailyProgress.get();
            
            // Update weekly totals
            weeklyPlan.setTotalMinutesCompleted(weeklyPlan.getTotalMinutesCompleted() + progress.getTotalPracticeTime());
            weeklyPlan.setSpeechExercisesCompleted(weeklyPlan.getSpeechExercisesCompleted() + progress.getExercisesCompleted());
            
            // Check if body exercises were done (assuming 1 body exercise = 5 minutes)
            if (progress.getTotalPracticeTime() >= 5) {
                weeklyPlan.setBodyExercisesCompleted(weeklyPlan.getBodyExercisesCompleted() + 1);
            }
            
            // Check if week is completed
            if (weeklyPlan.getTotalMinutesCompleted() >= weeklyPlan.getTotalMinutesGoal()) {
                weeklyPlan.setIsCompleted(true);
            }
            
            weeklyPlanRepository.save(weeklyPlan);
        }
    }
    
    /**
     * Get personalized body exercise recommendations for the week
     */
    public List<BodyExercise> getPersonalizedBodyExercises(User user, int count) {
        String difficultyLevel = user.getDifficultyLevel();
        List<BodyExercise> recommendations = new ArrayList<>();
        
        // Get exercises based on difficulty level
        List<BodyExercise> difficultyExercises = bodyExerciseRepository.findByDifficultyLevel(difficultyLevel);
        
        if (difficultyExercises.isEmpty()) {
            // Fallback to beginner if no exercises found for user's level
            difficultyExercises = bodyExerciseRepository.findByDifficultyLevel("beginner");
        }
        
        // Get current weekly plan to see what types of exercises have been done
        WeeklyPlan weeklyPlan = getOrCreateWeeklyPlan(user);
        
        // Prioritize exercise types that haven't been done much
        Map<String, Long> exerciseTypeCounts = difficultyExercises.stream()
            .collect(Collectors.groupingBy(BodyExercise::getExerciseType, Collectors.counting()));
        
        // Sort exercise types by frequency (least done first)
        List<String> prioritizedTypes = exerciseTypeCounts.entrySet().stream()
            .sorted(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        
        // Add exercises from each type, prioritizing less done types
        for (String exerciseType : prioritizedTypes) {
            List<BodyExercise> typeExercises = difficultyExercises.stream()
                .filter(ex -> ex.getExerciseType().equals(exerciseType))
                .collect(Collectors.toList());
            
            // Add 1-2 exercises from each type
            int exercisesToAdd = Math.min(2, typeExercises.size());
            for (int i = 0; i < exercisesToAdd && recommendations.size() < count; i++) {
                recommendations.add(typeExercises.get(i));
            }
        }
        
        // If we still need more exercises, add random ones
        if (recommendations.size() < count) {
            List<BodyExercise> remainingExercises = difficultyExercises.stream()
                .filter(ex -> !recommendations.contains(ex))
                .collect(Collectors.toList());
            
            Collections.shuffle(remainingExercises);
            int additionalNeeded = count - recommendations.size();
            for (int i = 0; i < Math.min(additionalNeeded, remainingExercises.size()); i++) {
                recommendations.add(remainingExercises.get(i));
            }
        }
        
        return recommendations.stream().limit(count).collect(Collectors.toList());
    }
    
    /**
     * Generate weekly exercise schedule
     */
    public Map<String, Object> generateWeeklySchedule(User user) {
        WeeklyPlan weeklyPlan = getOrCreateWeeklyPlan(user);
        List<BodyExercise> bodyExercises = getPersonalizedBodyExercises(user, 7); // 1 per day
        
        Map<String, Object> schedule = new HashMap<>();
        schedule.put("weeklyPlan", weeklyPlan);
        schedule.put("bodyExercises", bodyExercises);
        schedule.put("dailyGoals", generateDailyGoals(user));
        schedule.put("progressSummary", generateProgressSummary(weeklyPlan));
        
        return schedule;
    }
    
    /**
     * Generate daily goals for the week
     */
    private List<Map<String, Object>> generateDailyGoals(User user) {
        List<Map<String, Object>> dailyGoals = new ArrayList<>();
        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        
        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            Map<String, Object> dayGoal = new HashMap<>();
            
            dayGoal.put("date", date);
            dayGoal.put("dayName", date.getDayOfWeek().toString());
            dayGoal.put("minutesGoal", 15); // 15 minutes per day
            dayGoal.put("bodyExerciseGoal", 1); // 1 body exercise per day
            dayGoal.put("speechExerciseGoal", 2); // 2 speech exercises per day
            
            // Check if this day has progress
            Optional<UserProgress> progress = userProgressRepository.findByUserAndPracticeDate(user, date);
            if (progress.isPresent()) {
                UserProgress p = progress.get();
                dayGoal.put("minutesCompleted", p.getTotalPracticeTime());
                dayGoal.put("bodyExercisesCompleted", p.getTotalPracticeTime() >= 5 ? 1 : 0);
                dayGoal.put("speechExercisesCompleted", p.getExercisesCompleted());
                dayGoal.put("isCompleted", p.getGoalsMet());
            } else {
                dayGoal.put("minutesCompleted", 0);
                dayGoal.put("bodyExercisesCompleted", 0);
                dayGoal.put("speechExercisesCompleted", 0);
                dayGoal.put("isCompleted", false);
            }
            
            dailyGoals.add(dayGoal);
        }
        
        return dailyGoals;
    }
    
    /**
     * Generate progress summary for the week
     */
    private Map<String, Object> generateProgressSummary(WeeklyPlan weeklyPlan) {
        Map<String, Object> summary = new HashMap<>();
        
        summary.put("totalProgress", weeklyPlan.getProgressPercentage());
        summary.put("bodyExercisesProgress", weeklyPlan.getBodyExercisesProgress());
        summary.put("speechExercisesProgress", weeklyPlan.getSpeechExercisesProgress());
        summary.put("isOnTrack", weeklyPlan.isOnTrack());
        summary.put("daysRemaining", calculateDaysRemaining());
        summary.put("estimatedCompletion", estimateCompletionDate(weeklyPlan));
        
        return summary;
    }
    
    /**
     * Calculate days remaining in the week
     */
    private int calculateDaysRemaining() {
        LocalDate today = LocalDate.now();
        LocalDate weekEnd = today.with(DayOfWeek.MONDAY).plusDays(6);
        return Math.max(0, (int) (weekEnd.toEpochDay() - today.toEpochDay()));
    }
    
    /**
     * Estimate when the user will complete their weekly goals
     */
    private String estimateCompletionDate(WeeklyPlan weeklyPlan) {
        if (weeklyPlan.getIsCompleted()) {
            return "Completed this week!";
        }
        
        double currentProgress = weeklyPlan.getProgressPercentage();
        if (currentProgress == 0) {
            return "Not started yet";
        }
        
        int daysRemaining = calculateDaysRemaining();
        double progressPerDay = currentProgress / (7 - daysRemaining);
        double daysToComplete = (100 - currentProgress) / progressPerDay;
        
        if (daysToComplete <= daysRemaining) {
            return "On track to complete this week";
        } else {
            return "May need additional time to complete goals";
        }
    }
    
    /**
     * Set goals based on user's difficulty level
     */
    private void setGoalsBasedOnDifficulty(WeeklyPlan weeklyPlan, String difficultyLevel) {
        switch (difficultyLevel.toLowerCase()) {
            case "beginner":
                weeklyPlan.setTotalMinutesGoal(70); // 10 minutes per day
                weeklyPlan.setBodyExercisesGoal(5); // 5 body exercises per week
                weeklyPlan.setSpeechExercisesGoal(10); // 10 speech exercises per week
                break;
            case "intermediate":
                weeklyPlan.setTotalMinutesGoal(105); // 15 minutes per day
                weeklyPlan.setBodyExercisesGoal(7); // 7 body exercises per week
                weeklyPlan.setSpeechExercisesGoal(14); // 14 speech exercises per week
                break;
            case "advanced":
                weeklyPlan.setTotalMinutesGoal(140); // 20 minutes per day
                weeklyPlan.setBodyExercisesGoal(10); // 10 body exercises per week
                weeklyPlan.setSpeechExercisesGoal(21); // 21 speech exercises per week
                break;
            default:
                // Default to intermediate
                weeklyPlan.setTotalMinutesGoal(105);
                weeklyPlan.setBodyExercisesGoal(7);
                weeklyPlan.setSpeechExercisesGoal(14);
        }
    }
    
    /**
     * Reset weekly progress (called on Monday)
     */
    public void resetWeeklyProgress() {
        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        List<WeeklyPlan> weeklyPlans = weeklyPlanRepository.findByWeekStart(weekStart);
        
        for (WeeklyPlan plan : weeklyPlans) {
            plan.setTotalMinutesCompleted(0);
            plan.setBodyExercisesCompleted(0);
            plan.setSpeechExercisesCompleted(0);
            plan.setIsCompleted(false);
            weeklyPlanRepository.save(plan);
        }
    }
    
    /**
     * Get weekly statistics for all users
     */
    public Map<String, Object> getWeeklyStatistics() {
        LocalDate weekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        List<WeeklyPlan> weeklyPlans = weeklyPlanRepository.findByWeekStart(weekStart);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", weeklyPlans.size());
        stats.put("usersOnTrack", weeklyPlans.stream().filter(WeeklyPlan::isOnTrack).count());
        stats.put("averageProgress", weeklyPlans.stream().mapToDouble(WeeklyPlan::getProgressPercentage).average().orElse(0.0));
        stats.put("totalMinutesCompleted", weeklyPlans.stream().mapToInt(WeeklyPlan::getTotalMinutesCompleted).sum());
        stats.put("totalBodyExercisesCompleted", weeklyPlans.stream().mapToInt(WeeklyPlan::getBodyExercisesCompleted).sum());
        stats.put("totalSpeechExercisesCompleted", weeklyPlans.stream().mapToInt(WeeklyPlan::getSpeechExercisesCompleted).sum());
        
        return stats;
    }
}
