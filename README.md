# 🎯 Speech Therapy Assistant

A comprehensive, AI-powered Speech Therapy application built with Spring Boot (Backend) and React.js (Frontend).

## ✨ Features

### 🔐 Authentication System
- **Modern Login & Signup Pages** with glassmorphism design
- **Beautiful UI/UX** with animated backgrounds and smooth transitions
- **Password Strength Indicator** for secure account creation
- **JWT Token-based Authentication** (demo tokens for now)
- **Responsive Design** for all devices

### 🧘 Speech Therapy Exercises
- **Body Exercises** for speech improvement (15 modules)
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Exercise Types**: Breathing, Facial, Jaw, Tongue, Vocal, Relaxation
- **Interactive Timers** with countdown and completion tracking
- **Real-time Progress Tracking** with daily and weekly goals

### 📊 Progress Tracking
- **Daily & Weekly Progress** with visual indicators
- **Exercise Completion History** with timestamps
- **Streak Tracking** for consistency motivation
- **Points System** for gamification
- **AI-Powered Exercise Suggestions** based on performance

### 🎨 Modern UI/UX
- **Glassmorphism Design** with backdrop blur effects
- **Animated Background** with floating gradient orbs
- **Smooth Animations** and hover effects
- **Mobile-First Responsive Design**
- **Accessibility Features** with reduced motion support

## 🚀 Quick Start

### Prerequisites
- Java 17+ (for Spring Boot backend)
- Node.js 16+ (for React frontend)
- MySQL 8.0+ (for database)
- Maven (for backend build)

### 1. Database Setup
```sql
-- Create database
CREATE DATABASE speech_therapy;
USE speech_therapy;

-- The application will automatically create all tables on startup
```

### 2. Backend Setup
```bash
cd SpeechCoach/backend

# Update application.yml with your MySQL credentials
# Default: username: root, password: Visithran@mysql#123

# Build and run
mvn clean compile
mvn spring-boot:run
```

**Backend will start on:** `http://localhost:8082`

### 3. Frontend Setup
```bash
cd SpeechCoach/frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend will start on:** `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/speech_therapy
    username: root
    password: Visithran@mysql#123
  jpa:
    hibernate:
      ddl-auto: create-drop  # Creates tables on startup
```

### Frontend Configuration
- API Base URL: `http://localhost:8082/api`
- Authentication endpoints: `/api/auth/login`, `/api/auth/signup`

## 📱 Demo Credentials

### Login
- **Email**: Any email (demo mode)
- **Password**: `password123`

### Signup
- Create a new account with your details
- Password must be at least 8 characters with mixed case, numbers, and symbols

## 🏗️ Architecture

### Backend (Spring Boot)
```
com.speechtherapy/
├── config/          # Configuration classes
├── controller/      # REST API endpoints
├── model/          # JPA entities
├── repository/     # Data access layer
├── service/        # Business logic
└── SpeechTherapyApplication.java
```

### Frontend (React)
```
src/
├── components/     # React components
│   ├── Login.js   # Authentication pages
│   ├── Signup.js
│   ├── SpeechTherapy.js  # Main app
│   └── Navbar.js
├── App.js         # Main app component
└── index.js       # Entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Speech Therapy
- `GET /api/weekly-plan/{userId}` - Get weekly plan
- `POST /api/completed-exercises/complete` - Mark exercise complete
- `GET /api/completed-exercises/daily/{userId}` - Get daily exercises

### User Management
- `GET /api/users/{id}` - Get user details
- `GET /api/users/{id}/progress` - Get user progress

## 🎨 UI Components

### Login Page
- Email and password fields with validation
- Beautiful glassmorphism card design
- Animated background with floating orbs
- Responsive design for all screen sizes

### Signup Page
- Full name, email, password, and confirm password
- Password strength indicator
- Real-time validation
- Smooth form transitions

### Main Dashboard
- Weekly progress overview
- Daily goals tracking
- Exercise completion history
- Interactive exercise cards with timers

## 🔒 Security Features

- **Input Validation** on both frontend and backend
- **Password Strength Requirements** with visual indicators
- **JWT Token Authentication** (demo implementation)
- **CORS Configuration** for cross-origin requests
- **SQL Injection Prevention** with JPA

## 📱 Responsive Design

- **Mobile-First Approach** with progressive enhancement
- **Breakpoints**: 480px, 768px, 1200px
- **Touch-Friendly Interface** with appropriate button sizes
- **Optimized Typography** for all screen sizes

## 🚀 Performance Features

- **Lazy Loading** of components
- **Optimized Animations** with CSS transforms
- **Reduced Motion Support** for accessibility
- **Efficient State Management** with React hooks

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Build & Deploy

### Backend Build
```bash
cd backend
mvn clean package
java -jar target/speech-therapy-backend-1.0.0.jar
```

### Frontend Build
```bash
cd frontend
npm run build
# Serve the build folder with any static server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include system information and error logs

## 🔮 Future Enhancements

- [ ] Real JWT implementation with proper security
- [ ] Password hashing with BCrypt
- [ ] Email verification system
- [ ] Social media authentication
- [ ] Advanced speech analysis with AI
- [ ] Voice recognition and feedback
- [ ] Progress analytics and charts
- [ ] Multi-language support
- [ ] Mobile app versions

---

**Built with ❤️ for Speech Therapy Professionals and Patients**
