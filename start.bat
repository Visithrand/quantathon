@echo off
echo 🎯 Starting SpeechCoach Application...
echo.

echo 📁 Starting Backend (Speech Analysis API)...
start "SpeechCoach Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🌐 Starting Frontend (React App)...
start "SpeechCoach Frontend" cmd /k "cd frontend && npm start"

echo.
echo 🎉 SpeechCoach is starting up!
echo.
echo 📍 Backend: http://localhost:5001
echo 📱 Frontend: http://localhost:3000
echo.
echo ⚠️  Keep both terminal windows open while using the app
echo 🚪 Close the terminals to stop the services
echo.
pause
