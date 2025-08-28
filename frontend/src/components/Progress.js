import React from 'react';

function Progress({ userProgress }) {
  const weeklyProgress = (userProgress.exercisesCompleted * 3 / userProgress.weeklyGoal) * 100;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Progress 📈</h2>
        <p className="text-gray-600">Track your speech therapy journey</p>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-blue-600">{userProgress.totalPoints}</div>
          <div className="text-sm text-gray-600 mt-1">Total Points</div>
          <div className="text-xs text-gray-500 mt-2">+15 this week</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-green-600">{userProgress.exercisesCompleted}</div>
          <div className="text-sm text-gray-600 mt-1">Exercises Completed</div>
          <div className="text-xs text-gray-500 mt-2">+3 today</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-purple-600">{userProgress.streakDays}</div>
          <div className="text-sm text-gray-600 mt-1">Day Streak</div>
          <div className="text-xs text-gray-500 mt-2">Keep it up! 🔥</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <div className="text-3xl font-bold text-orange-600">84%</div>
          <div className="text-sm text-gray-600 mt-1">Average Score</div>
          <div className="text-xs text-gray-500 mt-2">+5% improvement</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Weekly Goal: {userProgress.weeklyGoal} minutes</span>
            <span>{Math.floor(weeklyProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{width: `${Math.min(100, weeklyProgress)}%`}}
            ></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
            const progress = Math.max(0, 100 - (index * 15) + Math.random() * 30);
            return (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">{day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{width: `${Math.min(100, progress)}%`}}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-600">{Math.floor(progress)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements 🏆</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="font-semibold text-yellow-800">First Steps</div>
                <div className="text-sm text-yellow-600">Completed first exercise</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-semibold text-green-800">Week Champion</div>
                <div className="text-sm text-green-600">7-day practice streak</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-semibold text-blue-800">Dedicated Learner</div>
                <div className="text-sm text-blue-600">50 exercises completed</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎪</span>
              <div>
                <div className="font-semibold text-purple-800">Sound Master</div>
                <div className="text-sm text-purple-600">Mastered 'TH' phoneme</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Type Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Type Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-blue-800">Word Exercises</div>
            <div className="text-xs text-blue-600 mt-1">Most practiced</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-green-800">Sentence Practice</div>
            <div className="text-xs text-green-600 mt-1">Good progress</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-yellow-800">Conversations</div>
            <div className="text-xs text-yellow-600 mt-1">Keep practicing</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-800">Tongue Twisters</div>
            <div className="text-xs text-purple-600 mt-1">Challenge yourself</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
