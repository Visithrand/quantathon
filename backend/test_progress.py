#!/usr/bin/env python3
"""
Test script for SpeechCoach Progress API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5001"

def test_progress_endpoints():
    """Test all progress-related endpoints"""
    
    print("🧪 Testing SpeechCoach Progress API...")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: Update progress
    print("\n2. Testing Progress Update...")
    test_user_id = "test_user_123"
    test_data = {
        "userId": test_user_id,
        "exerciseData": {
            "type": "storytelling",
            "score": 85,
            "duration": 5,
            "points": 8,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/progress/update",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Progress update successful")
            result = response.json()
            print(f"   Message: {result.get('message')}")
            print(f"   Total Points: {result['progress']['totalPoints']}")
            print(f"   Exercises Completed: {result['progress']['exercisesCompleted']}")
        else:
            print(f"❌ Progress update failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Progress update error: {e}")
    
    # Test 3: Get user progress
    print("\n3. Testing Get User Progress...")
    try:
        response = requests.get(f"{BASE_URL}/api/progress/{test_user_id}")
        
        if response.status_code == 200:
            print("✅ Get progress successful")
            result = response.json()
            progress = result['progress']
            print(f"   Total Points: {progress['totalPoints']}")
            print(f"   Exercises Completed: {progress['exercisesCompleted']}")
            print(f"   Streak Days: {progress['streakDays']}")
            print(f"   Average Score: {progress['averageScore']}%")
            print(f"   Achievements: {progress['achievements']}")
            
            if 'weeklyProgress' in progress:
                print(f"   Weekly Progress: {len(progress['weeklyProgress'])} days tracked")
        else:
            print(f"❌ Get progress failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Get progress error: {e}")
    
    # Test 4: Update progress again to test streak
    print("\n4. Testing Second Progress Update (Streak)...")
    test_data2 = {
        "userId": test_user_id,
        "exerciseData": {
            "type": "pronunciation",
            "score": 92,
            "duration": 3,
            "points": 9,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/progress/update",
            json=test_data2,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Second progress update successful")
            result = response.json()
            print(f"   Total Points: {result['progress']['totalPoints']}")
            print(f"   Exercises Completed: {result['progress']['exercisesCompleted']}")
            print(f"   Streak Days: {result['progress']['streakDays']}")
        else:
            print(f"❌ Second progress update failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Second progress update error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Progress API Testing Complete!")

if __name__ == "__main__":
    test_progress_endpoints()
