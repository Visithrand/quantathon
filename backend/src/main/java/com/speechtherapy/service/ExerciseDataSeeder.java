package com.speechtherapy.service;

import com.speechtherapy.model.DatabaseExercise;
import com.speechtherapy.repository.DatabaseExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ExerciseDataSeeder implements CommandLineRunner {
    
    @Autowired
    private DatabaseExerciseRepository exerciseRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Only seed if no exercises exist
        if (exerciseRepository.count() == 0) {
            seedExercises();
        }
    }
    
    private void seedExercises() {
        List<DatabaseExercise> exercises = Arrays.asList(
            // BEGINNER EXERCISES
            createExercise("Deep Breathing", "Practice deep breathing to improve voice control and reduce tension", "breathing", "beginner", "Breathing & Voice Control", "Diaphragm, Lungs", "Improves breath support for speech", "Sit comfortably, place hands on stomach, inhale deeply through nose for 4 counts, hold for 4, exhale through mouth for 6 counts", 60, 5, 3, 30, "None", "All Ages", "beginner", 10),
            
            createExercise("Lip Trills", "Make motorboat sounds to warm up lips and facial muscles", "facial", "beginner", "Facial Muscle Training", "Lips, Cheeks", "Strengthens lip muscles for better articulation", "Press lips together gently, blow air through lips to create motorboat sound, maintain for 10-15 seconds", 30, 8, 3, 15, "None", "All Ages", "beginner", 8),
            
            createExercise("Tongue Twisters - Basic", "Practice simple tongue twisters to improve articulation", "tongue", "beginner", "Tongue & Articulation", "Tongue, Lips", "Improves tongue coordination and speech clarity", "Say 'Peter Piper picked a peck of pickled peppers' slowly and clearly, repeat 3 times", 45, 3, 2, 20, "None", "All Ages", "beginner", 12),
            
            createExercise("Humming", "Hum different pitches to warm up vocal cords", "vocal", "beginner", "Vocal & Resonance", "Vocal Cords, Throat", "Warms up voice and improves resonance", "Hum 'mmmm' sound at different pitches, start low and go high, hold each pitch for 5 seconds", 40, 6, 2, 20, "None", "All Ages", "beginner", 10),
            
            createExercise("Jaw Stretches", "Gentle jaw movements to improve mouth opening", "jaw", "beginner", "Jaw & Mouth Control", "Jaw Muscles", "Increases jaw mobility for better speech", "Open mouth wide, hold for 5 seconds, close slowly, repeat 5 times", 30, 5, 2, 15, "None", "All Ages", "beginner", 8),
            
            // INTERMEDIATE EXERCISES
            createExercise("Syllable Practice", "Practice difficult syllable combinations", "phoneme", "intermediate", "Phoneme Practice", "Tongue, Lips, Jaw", "Improves articulation of complex sounds", "Practice 'ba-da-ga', 'pa-ta-ka', 'ma-na-la' combinations, repeat each 10 times", 60, 10, 3, 20, "None", "All Ages", "intermediate", 15),
            
            createExercise("Word Stress Patterns", "Practice stressing different syllables in words", "word", "intermediate", "Word Pronunciation", "Vocal Cords, Tongue", "Improves word stress and intonation", "Say 'photograph', 'photographer', 'photographic' with correct stress, repeat each 5 times", 50, 5, 3, 15, "None", "All Ages", "intermediate", 12),
            
            createExercise("Sentence Intonation", "Practice rising and falling intonation patterns", "sentence", "intermediate", "Sentence Fluency", "Vocal Cords, Diaphragm", "Improves natural speech rhythm and intonation", "Practice 'Is this your book?' (rising) and 'This is my book.' (falling), repeat 5 times each", 45, 5, 3, 20, "None", "All Ages", "intermediate", 14),
            
            createExercise("Breathing with Movement", "Coordinate breathing with arm movements", "breathing", "intermediate", "Breathing & Voice Control", "Diaphragm, Arms", "Improves breath control during speech", "Raise arms while inhaling, lower while exhaling, coordinate with counting aloud", 90, 8, 3, 25, "None", "All Ages", "intermediate", 16),
            
            createExercise("Facial Expression Practice", "Practice different facial expressions for speech", "facial", "intermediate", "Facial Muscle Training", "Face Muscles", "Improves expressive speech and facial control", "Practice happy, sad, surprised, angry expressions while speaking, hold each for 3 seconds", 60, 6, 2, 20, "Mirror", "All Ages", "intermediate", 13),
            
            // ADVANCED EXERCISES
            createExercise("Complex Tongue Twisters", "Advanced tongue twisters for expert articulation", "tongue_twister", "advanced", "Tongue Twisters", "Tongue, Lips, Jaw", "Mastery of complex articulation patterns", "Practice 'The sixth sick sheik's sixth sheep's sick' rapidly and clearly, repeat 10 times", 75, 10, 4, 30, "None", "Teens+", "advanced", 25),
            
            createExercise("Conversational Role Play", "Practice different conversation scenarios", "conversation", "advanced", "Conversational Skills", "All Speech Muscles", "Improves natural conversation flow and expression", "Role play job interview, casual conversation, formal presentation, switch roles after each scenario", 120, 3, 2, 45, "Partner", "Teens+", "advanced", 30),
            
            createExercise("Emotional Speech Practice", "Express different emotions through speech", "vocal", "advanced", "Vocal & Resonance", "Vocal Cords, Face", "Improves emotional expression in speech", "Read the same passage with different emotions: happy, sad, angry, excited, calm", 90, 5, 2, 30, "Text", "Teens+", "advanced", 22),
            
            createExercise("Speed Speaking with Clarity", "Speak rapidly while maintaining clarity", "sentence", "advanced", "Sentence Fluency", "Tongue, Lips, Jaw", "Improves speech rate without losing articulation", "Read passages at increasing speeds, start slow and gradually increase while maintaining clarity", 100, 5, 3, 35, "Text", "Teens+", "advanced", 28),
            
            createExercise("Professional Presentation", "Practice formal presentation skills", "conversation", "advanced", "Conversational Skills", "All Speech Muscles", "Improves professional speaking abilities", "Prepare and deliver a 2-minute presentation on any topic, focus on clarity, pace, and engagement", 150, 2, 2, 60, "Notes", "Teens+", "advanced", 35)
        );
        
        exerciseRepository.saveAll(exercises);
        System.out.println("✅ Seeded " + exercises.size() + " exercises into database");
    }
    
    private DatabaseExercise createExercise(String name, String description, String type, String difficulty, 
                                         String category, String targetMuscles, String speechBenefits, 
                                         String instructions, Integer duration, Integer repetitions, 
                                         Integer sets, Integer restSeconds, String equipment, 
                                         String ageGroup, String skillLevel, Integer points) {
        
        DatabaseExercise exercise = new DatabaseExercise();
        exercise.setDescription(description);
        exercise.setTargetMuscles(targetMuscles);
        exercise.setDurationSeconds(duration);
        exercise.setRepetitions(repetitions);
        exercise.setSets(sets);
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());
        exercise.setIsActive(true);
        
        return exercise;
    }
}
