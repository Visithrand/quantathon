# SpeechCoach Authentication System Setup

## Overview
The authentication system has been updated to work with real backend integration instead of the demo password "password123".

## Backend Changes Made

### 1. User Model Updates
- Added `password` field to User entity
- Updated constructors to include password
- Added getter/setter methods for password

### 2. AuthController Updates
- Login now validates actual passwords from database
- Signup saves passwords to database
- Proper error handling for invalid credentials

### 3. UserService Updates
- Updated createDefaultUser method to include password

## Frontend Changes Made

### 1. API Configuration
- Created centralized API configuration (`src/config/api.js`)
- Consistent backend URL management
- Helper functions for authentication

### 2. Login Component
- Removed demo credentials section
- Integrated with real backend API
- Proper error handling for different HTTP status codes
- Stores user data in localStorage

### 3. Signup Component
- Integrated with real backend API
- Password strength validation
- Creates real user accounts

## How to Test

### 1. Start the Backend
```bash
cd SpeechCoach/backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8082`

### 2. Start the Frontend
```bash
cd SpeechCoach/frontend
npm start
```
Frontend will start on `http://localhost:3000`

### 3. Test User Registration
1. Go to `/signup`
2. Fill in the form with:
   - Full Name: Test User
   - Email: test@example.com
   - Phone: (optional)
   - Password: TestPassword123
   - Confirm Password: TestPassword123
3. Check "I agree to terms"
4. Click "Create Account"

### 4. Test User Login
1. Go to `/login`
2. Use the credentials from signup:
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Log In"

### 5. Verify Authentication
- Check browser console for successful login message
- Check localStorage for stored user data
- Should redirect to `/dashboard`

## Database Schema
The system now stores:
- User ID
- User Name
- User Email
- User Password (plain text - for demo purposes)
- Age and other profile data

## Security Notes
⚠️ **Important**: This is a demo implementation. In production:
- Passwords should be hashed using BCrypt or similar
- JWT tokens should be properly implemented
- HTTPS should be used
- Input validation should be enhanced

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend is running on port 8082
   - Check CORS configuration
   - Verify database connection

2. **User Not Found**
   - Check if user exists in database
   - Verify email spelling
   - Check database logs

3. **Password Mismatch**
   - Ensure password was saved during signup
   - Check database for password field
   - Verify password comparison logic

### Debug Steps

1. Check browser console for errors
2. Check backend console for login attempts
3. Verify database records
4. Test API endpoints directly with Postman/curl

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/users` - List users (debug)

## Next Steps

1. Implement password hashing
2. Add JWT token validation
3. Implement password reset functionality
4. Add email verification
5. Enhance security measures
