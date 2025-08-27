import streamlit as st
import json

def main():
    st.title("⚙️ Settings")
    st.markdown("Customize your speech therapy experience")
    
    # Settings tabs
    tab1, tab2, tab3, tab4 = st.tabs(["👤 Profile", "🎯 Goals", "🔔 Notifications", "🎨 Preferences"])
    
    with tab1:
        show_profile_settings()
    
    with tab2:
        show_goal_settings()
    
    with tab3:
        show_notification_settings()
    
    with tab4:
        show_preference_settings()

def show_profile_settings():
    """Display and manage user profile settings"""
    st.markdown("### 👤 User Profile")
    
    # Initialize profile data if not exists
    if 'profile' not in st.session_state:
        st.session_state.profile = {
            'name': 'Speech Learner',
            'age': 25,
            'native_language': 'English',
            'target_language': 'English',
            'speech_goals': ['Pronunciation', 'Fluency'],
            'difficulty_level': 'Intermediate',
            'medical_conditions': 'None'
        }
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Basic Information")
        
        name = st.text_input(
            "Name:",
            value=st.session_state.profile['name']
        )
        
        age = st.number_input(
            "Age:",
            min_value=3,
            max_value=100,
            value=st.session_state.profile['age']
        )
        
        native_language = st.selectbox(
            "Native Language:",
            ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Other"],
            index=0 if st.session_state.profile['native_language'] == 'English' else 0
        )
        
        target_language = st.selectbox(
            "Target Language:",
            ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese"],
            index=0 if st.session_state.profile['target_language'] == 'English' else 0
        )
    
    with col2:
        st.markdown("#### Speech Therapy Goals")
        
        available_goals = [
            'Pronunciation Improvement',
            'Fluency Enhancement',
            'Accent Reduction',
            'Confidence Building',
            'Articulation',
            'Voice Projection',
            'Speech Clarity',
            'Conversational Skills'
        ]
        
        speech_goals = st.multiselect(
            "Primary Goals:",
            available_goals,
            default=['Pronunciation Improvement', 'Fluency Enhancement']
        )
        
        difficulty_level = st.selectbox(
            "Current Level:",
            ["Beginner", "Intermediate", "Advanced"],
            index=1
        )
        
        medical_conditions = st.text_area(
            "Medical Conditions or Speech Disorders (optional):",
            value=st.session_state.profile.get('medical_conditions', ''),
            placeholder="e.g., Stuttering, Apraxia, etc.",
            help="This information helps us customize exercises for your needs"
        )
    
    # Speech assessment
    st.markdown("---")
    st.markdown("#### 🎤 Quick Speech Assessment")
    st.info("Complete a quick assessment to personalize your experience")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        pronunciation_self_rating = st.slider(
            "Pronunciation (Self-Rating):",
            1, 10, 7,
            help="How would you rate your current pronunciation?"
        )
    
    with col2:
        fluency_self_rating = st.slider(
            "Fluency (Self-Rating):",
            1, 10, 6,
            help="How would you rate your current fluency?"
        )
    
    with col3:
        confidence_self_rating = st.slider(
            "Confidence (Self-Rating):",
            1, 10, 5,
            help="How confident are you when speaking?"
        )
    
    # Save profile button
    if st.button("💾 Save Profile", type="primary"):
        st.session_state.profile.update({
            'name': name,
            'age': age,
            'native_language': native_language,
            'target_language': target_language,
            'speech_goals': speech_goals,
            'difficulty_level': difficulty_level,
            'medical_conditions': medical_conditions,
            'self_assessment': {
                'pronunciation': pronunciation_self_rating,
                'fluency': fluency_self_rating,
                'confidence': confidence_self_rating
            }
        })
        st.success("✅ Profile saved successfully!")
        st.rerun()

def show_goal_settings():
    """Display and manage goal settings"""
    st.markdown("### 🎯 Goal Settings")
    
    # Initialize goal settings if not exists
    if 'goal_settings' not in st.session_state:
        st.session_state.goal_settings = {
            'daily_minutes': 15,
            'weekly_minutes': 105,
            'weekly_exercises': 20,
            'target_accuracy': 85,
            'practice_reminder': True,
            'auto_adjust_difficulty': True
        }
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Practice Goals")
        
        daily_minutes = st.slider(
            "Daily Practice Goal (minutes):",
            5, 60,
            st.session_state.goal_settings['daily_minutes'],
            step=5
        )
        
        weekly_minutes = st.slider(
            "Weekly Practice Goal (minutes):",
            30, 420,
            st.session_state.goal_settings['weekly_minutes'],
            step=15
        )
        
        weekly_exercises = st.slider(
            "Weekly Exercise Goal:",
            5, 50,
            st.session_state.goal_settings['weekly_exercises'],
            step=5
        )
    
    with col2:
        st.markdown("#### Performance Goals")
        
        target_accuracy = st.slider(
            "Target Accuracy (%):",
            60, 100,
            st.session_state.goal_settings['target_accuracy'],
            step=5
        )
        
        st.markdown("#### Smart Features")
        
        auto_adjust = st.checkbox(
            "Auto-adjust difficulty based on performance",
            value=st.session_state.goal_settings['auto_adjust_difficulty']
        )
        
        practice_reminder = st.checkbox(
            "Daily practice reminders",
            value=st.session_state.goal_settings['practice_reminder']
        )
    
    # Goal preview
    st.markdown("---")
    st.markdown("#### 📊 Goal Preview")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Daily Goal", f"{daily_minutes} min")
        st.info(f"≈ {daily_minutes // 3} exercises per day")
    
    with col2:
        st.metric("Weekly Goal", f"{weekly_minutes} min")
        st.info(f"≈ {weekly_exercises} exercises per week")
    
    with col3:
        st.metric("Target Accuracy", f"{target_accuracy}%")
        st.info("Your pronunciation goal")
    
    # Save goals
    if st.button("💾 Save Goals", type="primary"):
        st.session_state.goal_settings.update({
            'daily_minutes': daily_minutes,
            'weekly_minutes': weekly_minutes,
            'weekly_exercises': weekly_exercises,
            'target_accuracy': target_accuracy,
            'practice_reminder': practice_reminder,
            'auto_adjust_difficulty': auto_adjust
        })
        
        # Update main user data
        st.session_state.user_data['daily_goal'] = daily_minutes
        st.session_state.user_data['weekly_goal'] = weekly_minutes
        
        st.success("✅ Goals updated successfully!")
        st.rerun()

def show_notification_settings():
    """Display and manage notification settings"""
    st.markdown("### 🔔 Notification Settings")
    
    # Initialize notification settings
    if 'notifications' not in st.session_state:
        st.session_state.notifications = {
            'daily_reminder': True,
            'reminder_time': '18:00',
            'streak_celebrations': True,
            'achievement_alerts': True,
            'weekly_summary': True,
            'motivational_quotes': True,
            'exercise_suggestions': True
        }
    
    st.markdown("#### Reminder Settings")
    
    col1, col2 = st.columns(2)
    
    with col1:
        daily_reminder = st.checkbox(
            "📅 Daily Practice Reminder",
            value=st.session_state.notifications['daily_reminder'],
            help="Get reminded to practice every day"
        )
        
        if daily_reminder:
            reminder_time = st.time_input(
                "Reminder Time:",
                value=pd.to_datetime(st.session_state.notifications['reminder_time']).time()
            )
    
    with col2:
        streak_celebrations = st.checkbox(
            "🔥 Streak Celebrations",
            value=st.session_state.notifications['streak_celebrations'],
            help="Celebrate when you reach streak milestones"
        )
        
        achievement_alerts = st.checkbox(
            "🏆 Achievement Alerts",
            value=st.session_state.notifications['achievement_alerts'],
            help="Get notified when you unlock new achievements"
        )
    
    st.markdown("---")
    st.markdown("#### Content Notifications")
    
    col1, col2 = st.columns(2)
    
    with col1:
        weekly_summary = st.checkbox(
            "📊 Weekly Progress Summary",
            value=st.session_state.notifications['weekly_summary'],
            help="Receive weekly progress reports"
        )
        
        motivational_quotes = st.checkbox(
            "💪 Daily Motivational Quotes",
            value=st.session_state.notifications['motivational_quotes'],
            help="Get daily motivation to keep practicing"
        )
    
    with col2:
        exercise_suggestions = st.checkbox(
            "💡 Personalized Exercise Suggestions",
            value=st.session_state.notifications['exercise_suggestions'],
            help="Receive AI-powered exercise recommendations"
        )
    
    # Notification preview
    st.markdown("---")
    st.markdown("#### 📱 Notification Preview")
    
    if daily_reminder:
        st.info(f"🔔 Daily reminder at {reminder_time}")
    
    if streak_celebrations:
        st.success("🎉 'Amazing! You've reached a 7-day streak!'")
    
    if achievement_alerts:
        st.success("🏆 'Congratulations! You've unlocked the Phoneme Pro badge!'")
    
    # Save notifications
    if st.button("💾 Save Notification Settings", type="primary"):
        st.session_state.notifications.update({
            'daily_reminder': daily_reminder,
            'reminder_time': str(reminder_time) if daily_reminder else st.session_state.notifications['reminder_time'],
            'streak_celebrations': streak_celebrations,
            'achievement_alerts': achievement_alerts,
            'weekly_summary': weekly_summary,
            'motivational_quotes': motivational_quotes,
            'exercise_suggestions': exercise_suggestions
        })
        st.success("✅ Notification settings saved!")
        st.rerun()

def show_preference_settings():
    """Display and manage user preferences"""
    st.markdown("### 🎨 Preferences")
    
    # Initialize preferences
    if 'preferences' not in st.session_state:
        st.session_state.preferences = {
            'theme': 'Default',
            'voice_speed': 'Normal',
            'audio_quality': 'High',
            'feedback_detail': 'Detailed',
            'gamification': True,
            'ai_coach_personality': 'Encouraging',
            'exercise_order': 'Adaptive',
            'show_phonetic_symbols': True,
            'auto_play_examples': True
        }
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Audio & Voice Settings")
        
        voice_speed = st.selectbox(
            "Voice Demonstration Speed:",
            ["Slow", "Normal", "Fast"],
            index=1
        )
        
        audio_quality = st.selectbox(
            "Audio Quality:",
            ["Standard", "High", "Ultra"],
            index=1
        )
        
        auto_play_examples = st.checkbox(
            "Auto-play pronunciation examples",
            value=st.session_state.preferences['auto_play_examples']
        )
        
        st.markdown("#### Display Settings")
        
        show_phonetic = st.checkbox(
            "Show phonetic symbols",
            value=st.session_state.preferences['show_phonetic_symbols'],
            help="Display IPA phonetic transcriptions"
        )
    
    with col2:
        st.markdown("#### Learning Preferences")
        
        feedback_detail = st.selectbox(
            "Feedback Detail Level:",
            ["Simple", "Detailed", "Expert"],
            index=1
        )
        
        exercise_order = st.selectbox(
            "Exercise Order:",
            ["Sequential", "Random", "Adaptive", "Custom"],
            index=2,
            help="How exercises are presented to you"
        )
        
        ai_coach_personality = st.selectbox(
            "AI Coach Personality:",
            ["Encouraging", "Professional", "Friendly", "Challenging"],
            index=0
        )
        
        gamification = st.checkbox(
            "Enable gamification features",
            value=st.session_state.preferences['gamification'],
            help="Points, badges, and achievements"
        )
    
    st.markdown("---")
    st.markdown("#### 🧠 AI Assistant Settings")
    
    col1, col2 = st.columns(2)
    
    with col1:
        difficulty_adaptation = st.selectbox(
            "Difficulty Adaptation:",
            ["Manual", "Conservative", "Balanced", "Aggressive"],
            index=2,
            help="How quickly the AI adjusts exercise difficulty"
        )
        
        error_focus = st.selectbox(
            "Error Focus Strategy:",
            ["Most Common Errors", "Recent Errors", "Balanced", "User Choice"],
            index=2
        )
    
    with col2:
        practice_variety = st.slider(
            "Practice Variety:",
            1, 10, 7,
            help="1 = Focus on problem areas, 10 = Maximum variety"
        )
        
        challenge_level = st.slider(
            "Challenge Level:",
            1, 10, 5,
            help="1 = Conservative, 10 = Highly challenging"
        )
    
    # Advanced settings
    with st.expander("🔧 Advanced Settings"):
        st.markdown("#### Data & Privacy")
        
        col1, col2 = st.columns(2)
        
        with col1:
            save_recordings = st.checkbox(
                "Save practice recordings for analysis",
                value=True,
                help="Allows for better AI feedback but uses more storage"
            )
            
            anonymous_data = st.checkbox(
                "Share anonymous usage data to improve the app",
                value=True
            )
        
        with col2:
            export_data = st.button("📤 Export My Data")
            if export_data:
                st.info("Data export functionality would be implemented here")
            
            delete_data = st.button("🗑️ Delete All Data", type="secondary")
            if delete_data:
                st.warning("This would permanently delete all your progress data")
    
    # Preview settings
    st.markdown("---")
    st.markdown("#### 👀 Settings Preview")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.info(f"🔊 Voice: {voice_speed} speed, {audio_quality} quality")
    
    with col2:
        st.info(f"🎯 Feedback: {feedback_detail}, {exercise_order} order")
    
    with col3:
        st.info(f"🤖 AI Coach: {ai_coach_personality}")
    
    # Save preferences
    if st.button("💾 Save Preferences", type="primary"):
        st.session_state.preferences.update({
            'voice_speed': voice_speed,
            'audio_quality': audio_quality,
            'feedback_detail': feedback_detail,
            'gamification': gamification,
            'ai_coach_personality': ai_coach_personality,
            'exercise_order': exercise_order,
            'show_phonetic_symbols': show_phonetic,
            'auto_play_examples': auto_play_examples,
            'difficulty_adaptation': difficulty_adaptation,
            'error_focus': error_focus,
            'practice_variety': practice_variety,
            'challenge_level': challenge_level
        })
        st.success("✅ Preferences saved successfully!")
        st.rerun()
    
    # Reset to defaults
    if st.button("🔄 Reset to Defaults"):
        if st.checkbox("I understand this will reset all my preferences"):
            st.session_state.preferences = {
                'theme': 'Default',
                'voice_speed': 'Normal',
                'audio_quality': 'High',
                'feedback_detail': 'Detailed',
                'gamification': True,
                'ai_coach_personality': 'Encouraging',
                'exercise_order': 'Adaptive',
                'show_phonetic_symbols': True,
                'auto_play_examples': True
            }
            st.success("✅ Preferences reset to defaults!")
            st.rerun()

# Import pandas for time input
import pandas as pd

if __name__ == "__main__":
    main()
