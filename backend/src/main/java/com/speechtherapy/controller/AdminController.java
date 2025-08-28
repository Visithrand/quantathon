package com.speechtherapy.controller;

import com.speechtherapy.model.User;
import com.speechtherapy.model.UserProgress;
import com.speechtherapy.repository.UserProgressRepository;
import com.speechtherapy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProgressRepository userProgressRepository;



    // Manually reset today's progress (sets today's totals to 0 for all users)
    @PostMapping("/reset/daily")
    public ResponseEntity<Map<String, Object>> resetDaily() {
        LocalDate today = LocalDate.now();
        List<User> users = userRepository.findAll();
        int affected = 0;
        for (User user : users) {
            userProgressRepository.findByUserAndPracticeDate(user, today).ifPresent(progress -> {
                progress.setTotalPracticeTime(0);
                progress.setExercisesCompleted(0);
                progress.setAverageScore(0.0);
                progress.setPointsEarned(0);
                progress.setGoalsMet(false);
                userProgressRepository.save(progress);
            });
            affected++;
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "ok");
        resp.put("usersProcessed", affected);
        return ResponseEntity.ok(resp);
    }

    // Manually reset current week's minutes to 0
    @PostMapping("/reset/weekly")
    public ResponseEntity<Map<String, Object>> resetWeekly() {
        // Weekly progress reset is now handled by WeeklyPlanService
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "ok");
        resp.put("message", "Weekly progress reset is now handled by WeeklyPlanService");
        return ResponseEntity.ok(resp);
    }

    // Recompute weekly streak based on last week's completion
    @PostMapping("/recompute/weekly-streak")
    public ResponseEntity<Map<String, Object>> recomputeWeeklyStreak() {
        // Weekly streak computation is now handled by WeeklyPlanService
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "ok");
        resp.put("message", "Weekly streak computation is now handled by WeeklyPlanService");
        return ResponseEntity.ok(resp);
    }
}


