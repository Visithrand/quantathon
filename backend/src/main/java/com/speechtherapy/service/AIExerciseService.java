package com.speechtherapy.service;

import com.speechtherapy.model.*;
import com.speechtherapy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AIExerciseService {
    
    @Autowired
    private AIExerciseRepository aiExerciseRepository;
    
    @Autowired
    private FluencyScoreRepository fluencyScoreRepository;
    
    @Autowired
    private ExerciseRepository exerciseRepository;
    
    @Autowired
    private BodyExerciseRepository bodyExerciseRepository;
    
    // Story templates for AI-generated content
    private static final List<String> STORY_TEMPLATES = Arrays.asList(
        "Once upon a time, {character} was walking through {location} when they discovered {object}. This discovery would change everything.",
        "In the bustling city of {city}, {profession} {name} faced their biggest challenge yet: {challenge}.",
        "The {season} morning brought with it {weather} and a sense of {emotion} as {character} prepared for {event}.",
        "Deep in the {environment}, {character} learned an important lesson about {lesson} through {experience}.",
        "When {character} received the news about {event}, their world turned upside down, leading to {consequence}."
    );
    
    // Conversation scenarios
    private static final List<String> CONVERSATION_SCENARIOS = Arrays.asList(
        "Ordering food at a {restaurant_type} restaurant",
        "Discussing {topic} with a colleague at work",
        "Planning a {vacation_type} vacation with family",
        "Resolving a {issue_type} issue with customer service",
        "Participating in a {meeting_type} meeting at school"
    );
    
    // Tongue twister patterns
    private static final List<String> TONGUE_TWISTER_PATTERNS = Arrays.asList(
        "The {adjective} {noun} {verb} {adverb} through the {location}.",
        "{number} {adjective} {animals} {verb} {adverb} in the {place}.",
        "How much {substance} could a {profession} {verb} if a {profession} could {verb} {substance}?",
        "She {verb} {adjective} {noun} by the {location}.",
        "The {adjective} {noun} {verb} {adverb} while {verb_ing} the {object}."
    );
    
    // Word fillers for templates
    private static final Map<String, List<String>> WORD_FILLERS = createWordFillers();
    
    private static Map<String, List<String>> createWordFillers() {
        Map<String, List<String>> fillers = new HashMap<>();
        fillers.put("character", Arrays.asList("Sarah", "Michael", "Emma", "David", "Lisa", "James", "Maria", "Robert"));
        fillers.put("location", Arrays.asList("forest", "beach", "mountain", "park", "garden", "library", "museum", "cafe"));
        fillers.put("object", Arrays.asList("mysterious book", "ancient coin", "magical key", "strange device", "beautiful flower"));
        fillers.put("city", Arrays.asList("New York", "London", "Tokyo", "Paris", "Sydney", "Toronto", "Berlin", "Rome"));
        fillers.put("profession", Arrays.asList("teacher", "doctor", "engineer", "artist", "chef", "scientist", "lawyer", "nurse"));
        fillers.put("name", Arrays.asList("Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Quinn", "Avery"));
        fillers.put("challenge", Arrays.asList("solving a complex problem", "helping others", "learning new skills", "overcoming fears"));
        fillers.put("season", Arrays.asList("spring", "summer", "autumn", "winter"));
        fillers.put("weather", Arrays.asList("sunshine", "rain", "snow", "wind", "fog"));
        fillers.put("emotion", Arrays.asList("excitement", "wonder", "curiosity", "determination", "hope"));
        fillers.put("event", Arrays.asList("an important meeting", "a special celebration", "a challenging exam", "an adventure"));
        fillers.put("environment", Arrays.asList("forest", "ocean", "desert", "jungle", "mountain"));
        fillers.put("lesson", Arrays.asList("friendship", "courage", "patience", "kindness", "perseverance"));
        fillers.put("experience", Arrays.asList("helping a stranger", "facing a fear", "learning from mistakes", "discovering new places"));
        fillers.put("consequence", Arrays.asList("unexpected friendships", "new opportunities", "personal growth", "life-changing decisions"));
        fillers.put("restaurant_type", Arrays.asList("Italian", "Chinese", "Mexican", "Indian", "French", "Japanese"));
        fillers.put("topic", Arrays.asList("project planning", "team collaboration", "problem solving", "innovation"));
        fillers.put("vacation_type", Arrays.asList("beach", "mountain", "city", "cultural", "adventure", "relaxing"));
        fillers.put("issue_type", Arrays.asList("delivery", "billing", "technical", "service", "quality"));
        fillers.put("meeting_type", Arrays.asList("class discussion", "team planning", "problem solving", "creative brainstorming"));
        fillers.put("adjective", Arrays.asList("quick", "brown", "lazy", "sleepy", "happy", "clever", "brave", "wise"));
        fillers.put("noun", Arrays.asList("fox", "dog", "cat", "bird", "fish", "rabbit", "squirrel", "deer"));
        fillers.put("verb", Arrays.asList("jumps", "runs", "walks", "flies", "swims", "hops", "climbs", "dances"));
        fillers.put("adverb", Arrays.asList("quickly", "slowly", "happily", "carefully", "bravely", "wisely", "gently"));
        fillers.put("animals", Arrays.asList("cats", "dogs", "birds", "fish", "rabbits", "squirrels", "deer", "foxes"));
        fillers.put("place", Arrays.asList("garden", "forest", "park", "beach", "mountain", "lake", "river", "meadow"));
        fillers.put("profession", Arrays.asList("woodchuck", "woodpecker", "woodworker", "woodcutter"));
        fillers.put("substance", Arrays.asList("wood", "water", "sand", "stone", "metal", "clay"));
        fillers.put("verb_ing", Arrays.asList("reading", "writing", "singing", "dancing", "cooking", "painting", "studying"));
        return fillers;
    }
    
    public AIExercise generatePersonalizedExercise(User user, String exerciseType) {
        // Analyze user's recent performance to identify weaknesses
        List<FluencyScore> recentScores = fluencyScoreRepository.findByUserOrderBySessionDateDesc(user);
        Map<String, Object> weaknesses = analyzeWeaknesses(recentScores);
        
        // Generate exercise content based on type and weaknesses
        String exerciseContent = generateExerciseContent(exerciseType, weaknesses, user.getDifficultyLevel());
        
        // Create AI exercise with reasoning
        AIExercise aiExercise = new AIExercise(user, exerciseContent, exerciseType);
        aiExercise.setDifficultyLevel(user.getDifficultyLevel());
        aiExercise.setTargetPhonemes(extractTargetPhonemes(weaknesses));
        aiExercise.setTargetSkills(extractTargetSkills(weaknesses));
        aiExercise.setContext(determineContext(exerciseType));
        aiExercise.setAiReasoning(generateReasoning(weaknesses, exerciseType));
        
        return aiExerciseRepository.save(aiExercise);
    }
    
    public List<AIExercise> generateWeeklyExercisePlan(User user) {
        List<AIExercise> weeklyPlan = new ArrayList<>();
        
        // Generate one exercise of each type for the week
        String[] exerciseTypes = {"sentence", "story", "conversation", "tongue_twister"};
        for (String type : exerciseTypes) {
            weeklyPlan.add(generatePersonalizedExercise(user, type));
        }
        
        return weeklyPlan;
    }
    
    public List<BodyExercise> suggestBodyExercises(User user, String targetArea) {
        // Get user's recent fluency scores to determine stress level
        List<FluencyScore> recentScores = fluencyScoreRepository.findByUserOrderBySessionDateDesc(user);
        String stressLevel = detectStressLevel(recentScores);
        
        // Suggest appropriate body exercises
        List<BodyExercise> suggestions = new ArrayList<>();
        
        if ("breathing".equals(targetArea) || targetArea == null) {
            suggestions.addAll(bodyExerciseRepository.findByExerciseTypeAndDifficultyLevel("breathing", user.getDifficultyLevel()));
        }
        
        if ("facial".equals(targetArea) || targetArea == null) {
            suggestions.addAll(bodyExerciseRepository.findByExerciseTypeAndDifficultyLevel("facial", user.getDifficultyLevel()));
        }
        
        if ("gesture".equals(targetArea) || targetArea == null) {
            suggestions.addAll(bodyExerciseRepository.findByExerciseTypeAndDifficultyLevel("gesture", user.getDifficultyLevel()));
        }
        
        // Filter by stress level and duration
        return suggestions.stream()
            .filter(ex -> ex.getDurationSeconds() <= 300) // Max 5 minutes
            .limit(3) // Return top 3 suggestions
            .collect(Collectors.toList());
    }
    
    private Map<String, Object> analyzeWeaknesses(List<FluencyScore> recentScores) {
        Map<String, Object> weaknesses = new HashMap<>();
        
        if (recentScores.isEmpty()) {
            // Default weaknesses for new users
            weaknesses.put("pronunciation", "moderate");
            weaknesses.put("rhythm", "moderate");
            weaknesses.put("pace", "moderate");
            weaknesses.put("expression", "moderate");
            return weaknesses;
        }
        
        // Calculate average scores
        double avgPronunciation = recentScores.stream()
            .mapToInt(fs -> fs.getPronunciationScore() != null ? fs.getPronunciationScore() : 0)
            .average().orElse(70.0);
        
        double avgRhythm = recentScores.stream()
            .mapToInt(fs -> fs.getRhythmScore() != null ? fs.getRhythmScore() : 0)
            .average().orElse(70.0);
        
        double avgPace = recentScores.stream()
            .mapToInt(fs -> fs.getPaceScore() != null ? fs.getPaceScore() : 0)
            .average().orElse(70.0);
        
        double avgExpression = recentScores.stream()
            .mapToInt(fs -> fs.getExpressionScore() != null ? fs.getExpressionScore() : 0)
            .average().orElse(70.0);
        
        // Identify areas needing improvement
        weaknesses.put("pronunciation", avgPronunciation < 75 ? "high" : avgPronunciation < 85 ? "moderate" : "low");
        weaknesses.put("rhythm", avgRhythm < 75 ? "high" : avgRhythm < 85 ? "moderate" : "low");
        weaknesses.put("pace", avgPace < 75 ? "high" : avgPace < 85 ? "moderate" : "low");
        weaknesses.put("expression", avgExpression < 75 ? "high" : avgExpression < 85 ? "moderate" : "low");
        
        // Check for specific issues
        long stutterCount = recentScores.stream().filter(fs -> Boolean.TRUE.equals(fs.getStutterDetected())).count();
        if (stutterCount > 0) {
            weaknesses.put("stuttering", "present");
        }
        
        // Check emotional state
        Map<String, Long> emotionCounts = recentScores.stream()
            .filter(fs -> fs.getEmotionDetected() != null)
            .collect(Collectors.groupingBy(FluencyScore::getEmotionDetected, Collectors.counting()));
        
        if (emotionCounts.containsKey("nervous") && emotionCounts.get("nervous") > 2) {
            weaknesses.put("confidence", "low");
        }
        
        return weaknesses;
    }
    
    private String generateExerciseContent(String exerciseType, Map<String, Object> weaknesses, String difficultyLevel) {
        Random random = new Random();
        
        switch (exerciseType.toLowerCase()) {
            case "story":
                return generateStory(weaknesses, difficultyLevel, random);
            case "conversation":
                return generateConversation(weaknesses, difficultyLevel, random);
            case "tongue_twister":
                return generateTongueTwister(weaknesses, difficultyLevel, random);
            case "sentence":
            default:
                return generateSentence(weaknesses, difficultyLevel, random);
        }
    }
    
    private String generateStory(Map<String, Object> weaknesses, String difficultyLevel, Random random) {
        String template = STORY_TEMPLATES.get(random.nextInt(STORY_TEMPLATES.size()));
        return fillTemplate(template, random);
    }
    
    private String generateConversation(Map<String, Object> weaknesses, String difficultyLevel, Random random) {
        String scenario = CONVERSATION_SCENARIOS.get(random.nextInt(CONVERSATION_SCENARIOS.size()));
        return fillTemplate(scenario, random);
    }
    
    private String generateTongueTwister(Map<String, Object> weaknesses, String difficultyLevel, Random random) {
        String pattern = TONGUE_TWISTER_PATTERNS.get(random.nextInt(TONGUE_TWISTER_PATTERNS.size()));
        return fillTemplate(pattern, random);
    }
    
    private String generateSentence(Map<String, Object> weaknesses, String difficultyLevel, Random random) {
        // Generate a sentence based on weaknesses
        if ("high".equals(weaknesses.get("pronunciation"))) {
            return "The " + getRandomWord("adjective", random) + " " + getRandomWord("noun", random) + 
                   " " + getRandomWord("verb", random) + " " + getRandomWord("adverb", random) + ".";
        } else {
            return "She " + getRandomWord("verb", random) + " " + getRandomWord("adjective", random) + 
                   " " + getRandomWord("noun", random) + " in the " + getRandomWord("location", random) + ".";
        }
    }
    
    private String fillTemplate(String template, Random random) {
        String result = template;
        for (Map.Entry<String, List<String>> entry : WORD_FILLERS.entrySet()) {
            String placeholder = "{" + entry.getKey() + "}";
            if (result.contains(placeholder)) {
                String replacement = entry.getValue().get(random.nextInt(entry.getValue().size()));
                result = result.replace(placeholder, replacement);
            }
        }
        return result;
    }
    
    private String getRandomWord(String category, Random random) {
        List<String> words = WORD_FILLERS.get(category);
        if (words != null && !words.isEmpty()) {
            return words.get(random.nextInt(words.size()));
        }
        return "word";
    }
    
    private String extractTargetPhonemes(Map<String, Object> weaknesses) {
        List<String> targetPhonemes = new ArrayList<>();
        
        if ("high".equals(weaknesses.get("pronunciation"))) {
            targetPhonemes.addAll(Arrays.asList("th", "r", "s", "l", "sh"));
        }
        if ("high".equals(weaknesses.get("rhythm"))) {
            targetPhonemes.addAll(Arrays.asList("stress", "intonation", "pitch"));
        }
        
        return String.join(",", targetPhonemes);
    }
    
    private String extractTargetSkills(Map<String, Object> weaknesses) {
        List<String> targetSkills = new ArrayList<>();
        
        for (Map.Entry<String, Object> entry : weaknesses.entrySet()) {
            if ("high".equals(entry.getValue())) {
                targetSkills.add(entry.getKey());
            }
        }
        
        return String.join(",", targetSkills);
    }
    
    private String determineContext(String exerciseType) {
        switch (exerciseType.toLowerCase()) {
            case "story":
                return "narrative";
            case "conversation":
                return "real-life scenario";
            case "tongue_twister":
                return "articulation practice";
            case "sentence":
            default:
                return "general practice";
        }
    }
    
    private String generateReasoning(Map<String, Object> weaknesses, String exerciseType) {
        StringBuilder reasoning = new StringBuilder("This exercise was generated to help you improve ");
        
        List<String> areas = new ArrayList<>();
        for (Map.Entry<String, Object> entry : weaknesses.entrySet()) {
            if ("high".equals(entry.getValue())) {
                areas.add(entry.getKey());
            }
        }
        
        if (areas.isEmpty()) {
            reasoning.append("overall fluency and maintain your current progress.");
        } else {
            reasoning.append(String.join(", ", areas));
            reasoning.append(" based on your recent performance analysis.");
        }
        
        reasoning.append(" The ").append(exerciseType).append(" format will provide targeted practice for these areas.");
        
        return reasoning.toString();
    }
    
    private String detectStressLevel(List<FluencyScore> recentScores) {
        if (recentScores.isEmpty()) return "moderate";
        
        // Check for nervous emotions and low scores
        long nervousCount = recentScores.stream()
            .filter(fs -> "nervous".equals(fs.getEmotionDetected()))
            .count();
        
        double avgScore = recentScores.stream()
            .mapToInt(fs -> fs.getOverallFluencyScore() != null ? fs.getOverallFluencyScore() : 0)
            .average().orElse(70.0);
        
        if (nervousCount > 2 || avgScore < 70) {
            return "high";
        } else if (nervousCount > 0 || avgScore < 80) {
            return "moderate";
        } else {
            return "low";
        }
    }
}
