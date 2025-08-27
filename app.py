import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import os
from utils.data_manager import DataManager
from utils.scoring_engine import ScoringEngine

# Initialize session state
if 'user_data' not in st.session_state:
    st.session_state.user_data = {
        'total_points': 0,
        'streak_days': 0,
        'exercises_completed': 0,
        'last_session': None,
        'daily_goal': 15,  # minutes
        'weekly_goal': 105,  # minutes
        'session_history': [],
        'achievements': []
    }

if 'data_manager' not in st.session_state:
    st.session_state.data_manager = DataManager()

if 'scoring_engine' not in st.session_state:
    st.session_state.scoring_engine = ScoringEngine()

def main():
    st.set_page_config(
        page_title="AI Speech Therapy Assistant",
        page_icon="🗣️",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Custom CSS for better styling
    st.markdown("""
    <style>
    .main-header {
        text-align: center;
        color: #FF6B6B;
        margin-bottom: 2rem;
    }
    .metric-container {
        background-color: #F0F8FF;
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem;
    }
    .achievement-badge {
        display: inline-block;
        background-color: #FFD700;
        color: #333;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        margin: 0.25rem;
        font-size: 0.8rem;
    }
    .exercise-card {
        border: 2px solid #E6E6FA;
        border-radius: 10px;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #FAFAFA;
    }
    </style>
    """, unsafe_allow_html=True)
    
    # Sidebar navigation
    with st.sidebar:
        st.title("🗣️ Speech Therapy")
        
        # User stats sidebar
        st.markdown("### Your Progress")
        st.metric("Total Points", st.session_state.user_data['total_points'])
        st.metric("Current Streak", f"{st.session_state.user_data['streak_days']} days")
        st.metric("Exercises Completed", st.session_state.user_data['exercises_completed'])
        
        # Navigation
        st.markdown("---")
        page = st.selectbox(
            "Navigate to:",
            ["Dashboard", "Speech Exercises", "Progress Tracking", "Settings"]
        )
    
    # Main content based on navigation
    if page == "Dashboard":
        show_dashboard()
    elif page == "Speech Exercises":
        show_exercises()
    elif page == "Progress Tracking":
        show_progress()
    elif page == "Settings":
        show_settings()

def show_dashboard():
    st.markdown("<h1 class='main-header'>Welcome to Your Speech Therapy Journey! 🎯</h1>", unsafe_allow_html=True)
    
    # Daily progress section
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class='metric-container'>
        <h3>Today's Goal</h3>
        <p>15 minutes practice</p>
        <div style='background-color: #FF6B6B; height: 10px; border-radius: 5px; width: 60%;'></div>
        <small>9 minutes completed</small>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class='metric-container'>
        <h3>Weekly Progress</h3>
        <p>105 minutes goal</p>
        <div style='background-color: #4CAF50; height: 10px; border-radius: 5px; width: 45%;'></div>
        <small>47 minutes this week</small>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class='metric-container'>
        <h3>Accuracy Score</h3>
        <p style='font-size: 2rem; color: #FF6B6B; margin: 0;'>85%</p>
        <small>↑ 5% from last week</small>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
        <div class='metric-container'>
        <h3>Confidence Level</h3>
        <p style='font-size: 2rem; color: #4CAF50; margin: 0;'>Good</p>
        <small>Keep practicing!</small>
        </div>
        """, unsafe_allow_html=True)
    
    # Quick actions
    st.markdown("### Quick Start 🚀")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🔤 Phoneme Practice", use_container_width=True):
            st.session_state.selected_exercise = "phoneme"
            st.switch_page("pages/exercises.py")
    
    with col2:
        if st.button("📝 Word Exercises", use_container_width=True):
            st.session_state.selected_exercise = "word"
            st.switch_page("pages/exercises.py")
    
    with col3:
        if st.button("💬 Conversation Practice", use_container_width=True):
            st.session_state.selected_exercise = "conversation"
            st.switch_page("pages/exercises.py")
    
    # Recent achievements
    st.markdown("### Recent Achievements 🏆")
    achievements = [
        "🎯 Completed 5 exercises in a row",
        "🔥 Maintained 7-day streak",
        "📈 Improved pronunciation score by 10%",
        "🎪 Mastered 'TH' sound"
    ]
    
    for achievement in achievements:
        st.markdown(f"<span class='achievement-badge'>{achievement}</span>", unsafe_allow_html=True)
    
    # Progress visualization
    st.markdown("### Weekly Progress Chart 📊")
    
    # Mock data for demonstration
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    practice_time = [12, 18, 15, 20, 16, 0, 8]
    accuracy_scores = [82, 85, 83, 88, 87, 0, 84]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=days, y=practice_time, mode='lines+markers', name='Practice Time (min)', line=dict(color='#FF6B6B')))
    fig.add_trace(go.Scatter(x=days, y=accuracy_scores, mode='lines+markers', name='Accuracy Score (%)', yaxis='y2', line=dict(color='#4CAF50')))
    
    fig.update_layout(
        title='Weekly Practice Overview',
        xaxis_title='Day',
        yaxis_title='Practice Time (minutes)',
        yaxis2=dict(title='Accuracy Score (%)', overlaying='y', side='right'),
        height=400
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Motivational section
    st.markdown("### Today's Motivation 💪")
    motivational_quotes = [
        "Great speech comes from great practice! Keep going! 🌟",
        "Every word you practice makes you stronger! 💪",
        "Your voice matters - practice makes it perfect! 🎤",
        "Small steps lead to big improvements! 🚀"
    ]
    
    import random
    daily_quote = random.choice(motivational_quotes)
    st.info(daily_quote)

def show_exercises():
    """Import and display exercises page"""
    exec(open('pages/exercises.py').read())

def show_progress():
    """Import and display progress page"""
    exec(open('pages/progress.py').read())

def show_settings():
    """Import and display settings page"""
    exec(open('pages/settings.py').read())

if __name__ == "__main__":
    main()
