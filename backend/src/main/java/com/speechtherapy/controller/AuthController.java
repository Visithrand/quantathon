package com.speechtherapy.controller;

import com.speechtherapy.model.User;
import com.speechtherapy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            if (email == null || password == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Email and password are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Get user by email
            User user = userService.getUserByEmail(email);
            
            if (user == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(error);
            }
            
            // Check password (in production, use proper password hashing)
            if (password.equals(user.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("token", "user-token-" + System.currentTimeMillis());
                response.put("user", user);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Invalid email or password");
                return ResponseEntity.status(401).body(error);
            }
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> signupRequest) {
        try {
            String name = signupRequest.get("name");
            String email = signupRequest.get("email");
            String password = signupRequest.get("password");
            
            if (name == null || email == null || password == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "Name, email, and password are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if user already exists
            User existingUser = userService.getUserByEmail(email);
            if (existingUser != null) {
                Map<String, Object> error = new HashMap<>();
                error.put("message", "User with this email already exists");
                return ResponseEntity.status(409).body(error);
            }
            
            // Create new user
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword(password); // Set the password field
            newUser.setAge(25); // Default age for demo
            newUser.setDailyGoal(15);
            newUser.setWeeklyGoal(105);
            
            User savedUser = userService.createUser(newUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Signup failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
