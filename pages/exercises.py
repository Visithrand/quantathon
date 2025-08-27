import streamlit as st
import json
import random
from audio_recorder_streamlit import audio_recorder
import time
import io
from utils.scoring_engine import ScoringEngine
from utils.audio_processor import AudioProcessor

def main():
    st.title("🎯 Speech Exercises")
    
    # Initialize components
    if 'scoring_engine' not in st.session_state:
        st.session_state.scoring_engine = ScoringEngine()
    
    if 'audio_processor' not in st.session_state:
        st.session_state.audio_processor = AudioProcessor()
    
    # Exercise categories
    exercise_type = st.selectbox(
        "Choose Exercise Type:",
        ["Phoneme Practice", "Word Exercises", "Sentence Repetition", "Conversation Practice", "Tongue Twisters"]
    )
    
    if exercise_type == "Phoneme Practice":
        phoneme_exercises()
    elif exercise_type == "Word Exercises":
        word_exercises()
    elif exercise_type == "Sentence Repetition":
        sentence_exercises()
    elif exercise_type == "Conversation Practice":
        conversation_exercises()
    elif exercise_type == "Tongue Twisters":
        tongue_twister_exercises()

def phoneme_exercises():
    st.markdown("### 🔤 Phoneme Practice")
    st.markdown("Practice individual sounds to improve pronunciation accuracy.")
    
    # Load phoneme data
    try:
        with open('data/phonemes.json', 'r') as f:
            phonemes = json.load(f)
    except FileNotFoundError:
        st.error("Phoneme data not found. Please check the data files.")
        return
    
    # Select difficulty level
    difficulty = st.radio("Select Difficulty:", ["Beginner", "Intermediate", "Advanced"])
    
    # Filter phonemes by difficulty
    available_phonemes = [p for p in phonemes if p['difficulty'] == difficulty.lower()]
    
    if not available_phonemes:
        st.warning("No phonemes available for selected difficulty.")
        return
    
    # Select or random phoneme
    col1, col2 = st.columns([2, 1])
    
    with col1:
        selected_phoneme = st.selectbox(
            "Choose a phoneme:",
            [p['symbol'] for p in available_phonemes],
            format_func=lambda x: f"{x} - {next(p['description'] for p in available_phonemes if p['symbol'] == x)}"
        )
    
    with col2:
        if st.button("🎲 Random Phoneme"):
            selected_phoneme = random.choice(available_phonemes)['symbol']
            st.rerun()
    
    # Get selected phoneme data
    phoneme_data = next(p for p in available_phonemes if p['symbol'] == selected_phoneme)
    
    # Display phoneme information
    st.markdown(f"#### Practicing: **{phoneme_data['symbol']}** - {phoneme_data['description']}")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Example Words:**")
        for word in phoneme_data['example_words']:
            st.markdown(f"• {word}")
    
    with col2:
        st.markdown("**Pronunciation Tips:**")
        for tip in phoneme_data['tips']:
            st.markdown(f"• {tip}")
    
    # Text-to-speech demonstration
    st.markdown("---")
    st.markdown("#### 🔊 Listen and Practice")
    
    if st.button("🎵 Play Demonstration"):
        st.info(f"🔊 Now playing: {phoneme_data['symbol']} sound")
        st.audio(data=generate_demo_audio(phoneme_data['symbol']), format="audio/wav")
    
    # Recording section
    st.markdown("#### 🎤 Record Your Practice")
    
    audio_bytes = audio_recorder(
        text="Click to record your pronunciation",
        recording_color="#FF6B6B",
        neutral_color="#E6E6FA",
        icon_name="microphone",
        icon_size="2x"
    )
    
    if audio_bytes:
        st.audio(audio_bytes, format="audio/wav")
        
        # Analyze recording
        if st.button("📊 Analyze My Pronunciation"):
            with st.spinner("Analyzing your pronunciation..."):
                time.sleep(2)  # Simulate processing time
                
                # Mock scoring (replace with actual AI analysis)
                score = st.session_state.scoring_engine.analyze_phoneme(
                    audio_bytes, phoneme_data['symbol']
                )
                
                display_pronunciation_feedback(score, phoneme_data)
                
                # Update user progress
                update_exercise_progress("phoneme", score['overall_score'])

def word_exercises():
    st.markdown("### 📝 Word Exercises")
    st.markdown("Practice pronunciation of complete words.")
    
    # Load exercise data
    try:
        with open('data/exercises.json', 'r') as f:
            exercises = json.load(f)
        word_exercises_data = exercises['word_exercises']
    except FileNotFoundError:
        st.error("Exercise data not found.")
        return
    
    # Category selection
    category = st.selectbox(
        "Choose Category:",
        list(word_exercises_data.keys())
    )
    
    words = word_exercises_data[category]
    
    # Word selection
    col1, col2 = st.columns([3, 1])
    
    with col1:
        if 'current_word_index' not in st.session_state:
            st.session_state.current_word_index = 0
        
        current_word = words[st.session_state.current_word_index % len(words)]
        st.markdown(f"### Practice Word: **{current_word['word']}**")
        st.markdown(f"**Meaning:** {current_word['meaning']}")
        st.markdown(f"**Phonetic:** /{current_word['phonetic']}/")
    
    with col2:
        if st.button("⏭️ Next Word"):
            st.session_state.current_word_index += 1
            st.rerun()
    
    # Demonstration
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🔊 Listen to Correct Pronunciation"):
            st.info(f"🔊 Playing: {current_word['word']}")
            st.audio(data=generate_demo_audio(current_word['word']), format="audio/wav")
    
    with col2:
        if st.button("📚 Show Usage Example"):
            st.success(f"**Example:** {current_word['example_sentence']}")
    
    # Recording and analysis
    st.markdown("---")
    st.markdown("#### 🎤 Record Your Pronunciation")
    
    audio_bytes = audio_recorder(
        text=f"Say: {current_word['word']}",
        recording_color="#FF6B6B",
        neutral_color="#E6E6FA"
    )
    
    if audio_bytes:
        st.audio(audio_bytes, format="audio/wav")
        
        if st.button("🎯 Check My Pronunciation"):
            with st.spinner("Analyzing..."):
                time.sleep(2)
                
                score = st.session_state.scoring_engine.analyze_word(
                    audio_bytes, current_word['word']
                )
                
                display_word_feedback(score, current_word)
                update_exercise_progress("word", score['overall_score'])

def sentence_exercises():
    st.markdown("### 📖 Sentence Repetition")
    st.markdown("Practice fluency with complete sentences.")
    
    # Sample sentences by difficulty
    sentences = {
        "Easy": [
            {"text": "The cat sat on the mat.", "focus": "Simple consonants and vowels"},
            {"text": "I like to eat apples.", "focus": "Clear articulation"},
            {"text": "The sun is bright today.", "focus": "Rhythm and flow"}
        ],
        "Medium": [
            {"text": "She sells seashells by the seashore.", "focus": "S and SH sounds"},
            {"text": "Peter Piper picked a peck of pickled peppers.", "focus": "P sound repetition"},
            {"text": "How much wood would a woodchuck chuck?", "focus": "W and CH sounds"}
        ],
        "Hard": [
            {"text": "The sixth sick sheik's sixth sheep's sick.", "focus": "Complex consonant clusters"},
            {"text": "Red leather, yellow leather, red leather, yellow leather.", "focus": "L and R distinction"},
            {"text": "Unique New York, unique New York, you know you need unique New York.", "focus": "Multiple challenging sounds"}
        ]
    }
    
    difficulty = st.selectbox("Choose Difficulty:", list(sentences.keys()))
    sentence_list = sentences[difficulty]
    
    # Sentence selection
    if 'sentence_index' not in st.session_state:
        st.session_state.sentence_index = 0
    
    current_sentence = sentence_list[st.session_state.sentence_index % len(sentence_list)]
    
    col1, col2 = st.columns([4, 1])
    
    with col1:
        st.markdown(f"### Practice Sentence:")
        st.markdown(f"**{current_sentence['text']}**")
        st.info(f"**Focus:** {current_sentence['focus']}")
    
    with col2:
        if st.button("🔄 New Sentence"):
            st.session_state.sentence_index += 1
            st.rerun()
    
    # Practice section
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("🎵 Listen to Example"):
            st.info("🔊 Playing sentence...")
            st.audio(data=generate_demo_audio(current_sentence['text']), format="audio/wav")
    
    with col2:
        if st.button("💡 Show Tips"):
            tips = [
                "Speak slowly and clearly",
                "Pay attention to word boundaries",
                "Focus on the highlighted sounds",
                "Take breaks between words if needed"
            ]
            for tip in tips:
                st.markdown(f"• {tip}")
    
    # Recording
    st.markdown("---")
    audio_bytes = audio_recorder(
        text="Record the sentence above",
        recording_color="#FF6B6B",
        neutral_color="#E6E6FA"
    )
    
    if audio_bytes:
        st.audio(audio_bytes, format="audio/wav")
        
        if st.button("📈 Analyze Fluency"):
            with st.spinner("Analyzing fluency and clarity..."):
                time.sleep(3)
                
                score = st.session_state.scoring_engine.analyze_sentence(
                    audio_bytes, current_sentence['text']
                )
                
                display_sentence_feedback(score, current_sentence)
                update_exercise_progress("sentence", score['overall_score'])

def conversation_exercises():
    st.markdown("### 💬 Conversation Practice")
    st.markdown("Practice real-world conversational scenarios.")
    
    scenarios = [
        {
            "name": "Ordering at a Restaurant",
            "role": "Customer",
            "prompts": [
                "Good evening! What would you like to order?",
                "Would you like anything to drink?",
                "How would you like your steak cooked?"
            ],
            "responses": [
                "I'd like the grilled salmon, please.",
                "Could I have a glass of water?",
                "Medium rare, please."
            ]
        },
        {
            "name": "Job Interview",
            "role": "Candidate",
            "prompts": [
                "Tell me about yourself.",
                "What are your strengths?",
                "Why do you want this job?"
            ],
            "responses": [
                "I'm a dedicated professional with 5 years of experience...",
                "I'm detail-oriented and work well in teams...",
                "I'm excited about this opportunity because..."
            ]
        }
    ]
    
    scenario = st.selectbox("Choose Scenario:", [s['name'] for s in scenarios])
    selected_scenario = next(s for s in scenarios if s['name'] == scenario)
    
    st.markdown(f"### Scenario: {scenario}")
    st.markdown(f"**Your Role:** {selected_scenario['role']}")
    
    # Conversation practice
    if 'conversation_step' not in st.session_state:
        st.session_state.conversation_step = 0
    
    step = st.session_state.conversation_step % len(selected_scenario['prompts'])
    
    # Display current prompt
    st.markdown("#### 🤖 AI Assistant says:")
    st.info(selected_scenario['prompts'][step])
    
    # Show suggested response
    with st.expander("💡 Suggested Response"):
        st.markdown(selected_scenario['responses'][step])
    
    # Recording
    audio_bytes = audio_recorder(
        text="Record your response",
        recording_color="#FF6B6B",
        neutral_color="#E6E6FA"
    )
    
    if audio_bytes:
        st.audio(audio_bytes, format="audio/wav")
        
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button("📊 Analyze Response"):
                with st.spinner("Analyzing conversational skills..."):
                    time.sleep(2)
                    
                    score = st.session_state.scoring_engine.analyze_conversation(
                        audio_bytes, selected_scenario['responses'][step]
                    )
                    
                    display_conversation_feedback(score)
                    update_exercise_progress("conversation", score['overall_score'])
        
        with col2:
            if st.button("⏭️ Next Question"):
                st.session_state.conversation_step += 1
                st.rerun()

def tongue_twister_exercises():
    st.markdown("### 🌪️ Tongue Twisters")
    st.markdown("Challenge yourself with fun tongue twisters!")
    
    twisters = [
        {
            "text": "She sells seashells by the seashore",
            "difficulty": "Easy",
            "focus": "S and SH sounds",
            "tip": "Start slowly, focus on the 'S' and 'SH' distinction"
        },
        {
            "text": "Red leather, yellow leather",
            "difficulty": "Medium",
            "focus": "L and R sounds",
            "tip": "Pay attention to tongue position for L and R"
        },
        {
            "text": "The sixth sick sheik's sixth sheep's sick",
            "difficulty": "Hard",
            "focus": "Complex consonants",
            "tip": "Break it down word by word first"
        }
    ]
    
    difficulty_filter = st.selectbox("Filter by Difficulty:", ["All", "Easy", "Medium", "Hard"])
    
    if difficulty_filter != "All":
        filtered_twisters = [t for t in twisters if t['difficulty'] == difficulty_filter]
    else:
        filtered_twisters = twisters
    
    for i, twister in enumerate(filtered_twisters):
        with st.expander(f"{twister['difficulty']}: {twister['text'][:30]}..."):
            st.markdown(f"**Tongue Twister:** {twister['text']}")
            st.markdown(f"**Focus:** {twister['focus']}")
            st.markdown(f"**Tip:** {twister['tip']}")
            
            col1, col2 = st.columns(2)
            
            with col1:
                if st.button(f"🔊 Listen", key=f"listen_{i}"):
                    st.info("🔊 Playing...")
                    st.audio(data=generate_demo_audio(twister['text']), format="audio/wav")
            
            with col2:
                audio_bytes = audio_recorder(
                    text="Try it!",
                    key=f"record_{i}",
                    recording_color="#FF6B6B",
                    neutral_color="#E6E6FA"
                )
                
                if audio_bytes:
                    if st.button(f"🎯 Check", key=f"check_{i}"):
                        with st.spinner("Analyzing..."):
                            time.sleep(2)
                            
                            score = st.session_state.scoring_engine.analyze_tongue_twister(
                                audio_bytes, twister['text']
                            )
                            
                            st.markdown(f"**Score:** {score['overall_score']}/100")
                            st.markdown(f"**Speed:** {score['speed_score']}/100")
                            st.markdown(f"**Clarity:** {score['clarity_score']}/100")
                            
                            if score['overall_score'] >= 80:
                                st.success("🎉 Excellent! You nailed it!")
                            elif score['overall_score'] >= 60:
                                st.info("👍 Good job! Keep practicing for perfection.")
                            else:
                                st.warning("💪 Keep practicing! Try speaking more slowly.")

def display_pronunciation_feedback(score, phoneme_data):
    """Display detailed feedback for phoneme pronunciation"""
    st.markdown("### 📊 Pronunciation Analysis")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Overall Score", f"{score['overall_score']}/100", 
                 delta=f"+{score['improvement']}" if score['improvement'] > 0 else str(score['improvement']))
    
    with col2:
        st.metric("Accuracy", f"{score['accuracy_score']}/100")
    
    with col3:
        st.metric("Clarity", f"{score['clarity_score']}/100")
    
    # Detailed feedback
    if score['overall_score'] >= 85:
        st.success("🎉 Excellent pronunciation! You've mastered this phoneme!")
        st.balloons()
    elif score['overall_score'] >= 70:
        st.info("👍 Good job! Here are some tips to improve further:")
        for tip in score['improvement_tips']:
            st.markdown(f"• {tip}")
    else:
        st.warning("💪 Keep practicing! Here's how to improve:")
        for tip in score['improvement_tips']:
            st.markdown(f"• {tip}")
        
        # Show tongue position help
        st.markdown("**Tongue Position Guide:**")
        for tip in phoneme_data['tips']:
            st.markdown(f"• {tip}")

def display_word_feedback(score, word_data):
    """Display feedback for word pronunciation"""
    st.markdown("### 📊 Word Analysis")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Overall", f"{score['overall_score']}/100")
    
    with col2:
        st.metric("Accuracy", f"{score['accuracy_score']}/100")
    
    with col3:
        st.metric("Stress Pattern", f"{score['stress_score']}/100")
    
    with col4:
        st.metric("Vowel Clarity", f"{score['vowel_score']}/100")
    
    # Feedback based on score
    if score['overall_score'] >= 85:
        st.success("🌟 Perfect! Your pronunciation is excellent!")
        st.session_state.user_data['total_points'] += 15
    elif score['overall_score'] >= 70:
        st.info("✨ Good pronunciation! Small improvements noted:")
        for tip in score['improvement_tips']:
            st.markdown(f"• {tip}")
        st.session_state.user_data['total_points'] += 10
    else:
        st.warning("🎯 Areas for improvement:")
        for tip in score['improvement_tips']:
            st.markdown(f"• {tip}")
        st.session_state.user_data['total_points'] += 5

def display_sentence_feedback(score, sentence_data):
    """Display feedback for sentence fluency"""
    st.markdown("### 📊 Fluency Analysis")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Overall Fluency", f"{score['overall_score']}/100")
    
    with col2:
        st.metric("Rhythm", f"{score['rhythm_score']}/100")
    
    with col3:
        st.metric("Pace", f"{score['pace_score']}/100")
    
    with col4:
        st.metric("Expression", f"{score['expression_score']}/100")
    
    # Detailed feedback
    st.markdown("#### Feedback:")
    for feedback in score['detailed_feedback']:
        st.markdown(f"• {feedback}")

def display_conversation_feedback(score):
    """Display feedback for conversation practice"""
    st.markdown("### 📊 Conversation Analysis")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Overall", f"{score['overall_score']}/100")
    
    with col2:
        st.metric("Confidence", f"{score['confidence_score']}/100")
    
    with col3:
        st.metric("Clarity", f"{score['clarity_score']}/100")
    
    with col4:
        st.metric("Naturalness", f"{score['naturalness_score']}/100")
    
    # Conversation-specific feedback
    st.markdown("#### Communication Assessment:")
    for aspect, rating in score['communication_aspects'].items():
        emoji = "🟢" if rating >= 80 else "🟡" if rating >= 60 else "🔴"
        st.markdown(f"{emoji} **{aspect}:** {rating}/100")

def update_exercise_progress(exercise_type, score):
    """Update user progress after completing an exercise"""
    st.session_state.user_data['exercises_completed'] += 1
    
    # Add points based on score
    points_earned = max(5, int(score / 10))
    st.session_state.user_data['total_points'] += points_earned
    
    # Update session history
    session_data = {
        'date': str(datetime.now().date()),
        'exercise_type': exercise_type,
        'score': score,
        'points_earned': points_earned
    }
    
    st.session_state.user_data['session_history'].append(session_data)
    
    # Show earned points
    st.success(f"🎉 You earned {points_earned} points! Total: {st.session_state.user_data['total_points']}")

def generate_demo_audio(text):
    """Generate placeholder audio data (in real implementation, use TTS)"""
    # This is a placeholder - in real implementation, use text-to-speech
    # For now, return empty audio data
    import numpy as np
    
    # Generate a simple sine wave as placeholder
    sample_rate = 44100
    duration = len(text) * 0.1  # Approximate duration based on text length
    t = np.linspace(0, duration, int(sample_rate * duration))
    frequency = 440  # A4 note
    audio_data = np.sin(2 * np.pi * frequency * t)
    
    # Convert to bytes (this is still a placeholder)
    return audio_data.tobytes()

if __name__ == "__main__":
    main()
