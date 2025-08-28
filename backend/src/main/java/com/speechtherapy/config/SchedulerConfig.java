package com.speechtherapy.config;

import com.speechtherapy.model.User;
import com.speechtherapy.model.UserProgress;
import com.speechtherapy.repository.UserProgressRepository;
import com.speechtherapy.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Configuration
@EnableScheduling
public class SchedulerConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;



    // Reset daily progress at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailyProgress() {
        LocalDate today = LocalDate.now();
        List<User> users = userRepository.findAll();
        for (User user : users) {
            userProgressRepository.findByUserAndPracticeDate(user, today)
                .ifPresent(progress -> {
                    // no-op: progress records are per-day, so new day has no record
                });
        }
    }

    // Weekly progress reset is now handled by WeeklyPlanService
    @Scheduled(cron = "0 5 0 * * MON")
    public void weeklyResetMarker() {
        // Weekly progress reset is now handled by WeeklyPlanService
        // This method focuses on daily progress tracking
    }
}


