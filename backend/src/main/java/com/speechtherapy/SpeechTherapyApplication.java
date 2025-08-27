package com.speechtherapy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*") // Allow React frontend access
public class SpeechTherapyApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SpeechTherapyApplication.class, args);
    }
}