# AI Speech Therapy Assistant

## Overview

This is an AI-powered Speech Therapy Assistant built with Streamlit that helps users improve their speech clarity, pronunciation, fluency, and expressive communication. The application provides interactive speech exercises, real-time feedback, progress tracking, and gamification elements to make speech therapy engaging and effective for users of all ages.

The system features multiple exercise types including phoneme practice, word exercises, sentence repetition, conversation practice, and tongue twisters. It incorporates AI-powered scoring to evaluate speech quality and provides personalized feedback to help users improve their speech patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Streamlit web application with multi-page navigation
- **UI Components**: Custom CSS styling with metric containers, progress visualizations using Plotly charts
- **Page Structure**: Modular page system with separate files for exercises, progress tracking, and settings
- **Session Management**: Streamlit session state for maintaining user data and application state across page navigation

### Core Application Structure
- **Main Application**: `app.py` serves as the entry point with dashboard and navigation
- **Exercise System**: Modular exercise pages supporting different speech therapy activities
- **Data Layer**: JSON-based data storage for exercises, phonemes, user profiles, and progress tracking
- **Utilities Layer**: Separate modules for audio processing, data management, and AI scoring

### Speech Analysis Engine
- **Scoring System**: Mock AI engine simulating speech recognition and analysis with weighted scoring algorithms
- **Audio Processing**: Audio recording capabilities with validation and feature extraction
- **Feedback Generation**: Contextual tips and suggestions based on exercise performance
- **Progress Tracking**: Session history, streak tracking, and achievement system

### Data Management
- **User Data**: Profile information, progress metrics, session history, and achievements
- **Exercise Content**: Structured JSON data for phonemes, words, sentences, and practice materials
- **Persistence**: File-based storage system with automatic data directory creation
- **State Management**: Centralized session state handling for user preferences and application data

### Gamification System
- **Points System**: Exercise completion tracking with total points and streaks
- **Achievement Tracking**: Progress milestones and accomplishment recording
- **Goal Setting**: Daily and weekly practice targets with progress monitoring
- **Visualization**: Charts and metrics for user engagement and motivation

## External Dependencies

### Core Libraries
- **Streamlit**: Web application framework for the user interface
- **Pandas**: Data manipulation and analysis for progress tracking
- **Plotly**: Interactive charting and visualization for progress dashboards
- **NumPy**: Numerical computing for audio processing and analysis

### Audio Processing
- **audio-recorder-streamlit**: Audio recording component for speech input
- Future integration planned for advanced speech recognition APIs

### Data Storage
- **JSON**: File-based storage for user data, exercises, and configuration
- Local file system for data persistence without external database dependencies

### Potential Future Integrations
- Speech recognition APIs (Google Speech-to-Text, Azure Speech Services)
- Text-to-speech services for pronunciation examples
- Machine learning libraries for advanced speech analysis
- Cloud storage solutions for user data synchronization
- Authentication services for multi-user support