# Speech Therapy Assistant - Frontend

A modern, modular React application for AI-powered speech therapy exercises.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation component
│   ├── Dashboard.js     # Main dashboard view
│   ├── Exercises.js     # Exercise selection and practice
│   ├── AudioRecorder.js # Audio recording interface
│   ├── AnalysisResults.js # Speech analysis feedback
│   ├── Progress.js      # Progress tracking
│   └── Settings.js      # User preferences
├── data/                # Exercise data and content
│   └── exercises.js     # 40 exercises (10 per category)
├── App.js               # Main application component
├── index.js             # Application entry point
└── index.css            # Global styles with Tailwind CSS
```

## 🎯 Exercise Categories

### 1. Word Exercises (10 exercises)
- **Beginner**: Basic consonants, vowel sounds
- **Intermediate**: TH, R, S/Z, L sounds
- **Advanced**: Complex consonants, silent letters, stress patterns, minimal pairs

### 2. Sentence Repetition (10 exercises)
- **Beginner**: Simple statements, question forms
- **Intermediate**: Past tense, future plans, conditionals
- **Advanced**: Complex sentences, passive voice, reported speech, emphatic structures, academic language

### 3. Conversation Practice (10 exercises)
- **Beginner**: Restaurant, doctor's office
- **Intermediate**: Job interview, travel planning, problem solving, cultural exchange
- **Advanced**: Academic discussion, business negotiation, environmental discussion, technology debate

### 4. Tongue Twisters (10 exercises)
- **Beginner**: Peter Piper, She Sells Seashells
- **Intermediate**: How Much Wood, Betty Botter, Fuzzy Wuzzy, Six Slick Snakes
- **Advanced**: Sixth Sick Sheik, Irish Wristwatch, Unique New York, Red Leather Yellow Leather

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with reusable components
- **Real Exercise Content**: 40 carefully crafted exercises instead of mock data
- **Progress Tracking**: Exercise completion tracking with visual indicators
- **Audio Recording**: Built-in microphone recording for speech practice
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Difficulty Levels**: Beginner, intermediate, and advanced exercises
- **Visual Feedback**: Color-coded difficulty indicators and completion status

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **Web Audio API** - Browser-based audio recording
- **Responsive Design** - Mobile and desktop optimized

## 📱 Component Details

### Navbar.js
- Navigation between different app sections
- User progress display (points, streak)
- Responsive navigation menu

### Dashboard.js
- Welcome message and quick actions
- Progress overview cards
- Recent achievements
- Motivational content

### Exercises.js
- Exercise type selection (words, sentences, conversations, tongue twisters)
- Exercise list with difficulty indicators
- Exercise content display
- Integration with audio recorder

### AudioRecorder.js
- Start/stop recording controls
- Audio playback
- Recording status indicators
- User guidance and tips

### AnalysisResults.js
- Score display (overall, accuracy, clarity)
- Progress visualization
- Feedback and tips
- Achievement badges
- Next steps guidance

### Progress.js
- Progress overview statistics
- Weekly progress charts
- Achievement badges
- Exercise type breakdown

### Settings.js
- Audio preferences
- Feedback detail levels
- Practice goals
- Notification settings
- Privacy options

## 🎨 Styling

- **Tailwind CSS** for consistent, responsive design
- **Color-coded difficulty levels**: Green (beginner), Yellow (intermediate), Red (advanced)
- **Completion indicators**: Green checkmarks for completed exercises
- **Progress bars**: Visual representation of goals and achievements
- **Responsive grid layouts**: Adapts to different screen sizes

## 🔧 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📊 Data Structure

Each exercise follows this structure:
```javascript
{
  id: 1,
  title: "Exercise Title",
  difficulty: "beginner|intermediate|advanced",
  description: "Exercise description",
  // Category-specific content:
  words: ["word1", "word2"],           // For word exercises
  sentences: ["sentence1", "sentence2"], // For sentence exercises
  dialogue: ["line1", "line2"],        // For conversation exercises
  text: "tongue twister text",         // For tongue twisters
  targetSounds: ["sound1", "sound2"]   // For word exercises
}
```

## 🎯 Exercise Flow

1. **Select Exercise Type**: Choose from 4 categories
2. **Browse Exercises**: View 10 exercises per category with difficulty levels
3. **Select Exercise**: Click on specific exercise to practice
4. **Record Speech**: Use microphone to record pronunciation
5. **Analyze**: Submit audio for analysis (connects to backend)
6. **Review Results**: Get detailed feedback and scores
7. **Track Progress**: Mark exercises as completed

## 🔮 Future Enhancements

- **Backend Integration**: Connect to Spring Boot API for real speech analysis
- **User Authentication**: User accounts and progress persistence
- **Advanced Analytics**: Detailed progress reports and insights
- **Social Features**: Share achievements and compete with friends
- **Offline Support**: PWA capabilities for offline practice
- **Voice Recognition**: Real-time pronunciation feedback

## 📝 Development Notes

- **Component Reusability**: All components are designed to be reusable
- **State Management**: Uses React hooks for local state management
- **Props Interface**: Clear prop interfaces for component communication
- **Error Handling**: Graceful fallbacks for audio recording issues
- **Accessibility**: Semantic HTML and ARIA labels for screen readers

## 🤝 Contributing

1. Follow the existing component structure
2. Maintain consistent styling with Tailwind CSS
3. Add new exercises to the `exercises.js` data file
4. Test on both desktop and mobile devices
5. Ensure accessibility standards are met

## 📄 License

This project is part of the Speech Therapy Assistant application.
