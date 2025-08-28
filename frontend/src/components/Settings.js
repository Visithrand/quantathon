import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    voiceSpeed: 'normal',
    audioQuality: 'high',
    feedbackDetail: 'detailed',
    notifications: true,
    autoPlay: true,
    dailyReminder: '09:00',
    weeklyGoal: 105,
    dailyGoal: 15
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Here you would typically save to backend/localStorage
    console.log('Saving settings:', settings);
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings ⚙️</h2>
        <p className="text-gray-600">Customize your speech therapy experience</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        {/* Audio Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Speed</label>
              <select
                value={settings.voiceSpeed}
                onChange={(e) => handleSettingChange('voiceSpeed', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="slow">Slow (0.8x)</option>
                <option value="normal">Normal (1.0x)</option>
                <option value="fast">Fast (1.2x)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
              <select
                value={settings.audioQuality}
                onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="standard">Standard (16kHz)</option>
                <option value="high">High (44.1kHz)</option>
                <option value="ultra">Ultra (48kHz)</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPlay"
                checked={settings.autoPlay}
                onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoPlay" className="ml-2 block text-sm text-gray-700">
                Auto-play pronunciation examples
              </label>
            </div>
          </div>
        </div>

        {/* Feedback Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Detail Level</label>
            <select
              value={settings.feedbackDetail}
              onChange={(e) => handleSettingChange('feedbackDetail', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="simple">Simple - Basic tips only</option>
              <option value="detailed">Detailed - Comprehensive feedback</option>
              <option value="expert">Expert - Advanced techniques</option>
            </select>
          </div>
        </div>

        {/* Goal Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Goals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Goal (minutes)</label>
              <input
                type="number"
                value={settings.dailyGoal}
                onChange={(e) => handleSettingChange('dailyGoal', parseInt(e.target.value))}
                min="5"
                max="60"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Goal (minutes)</label>
              <input
                type="number"
                value={settings.weeklyGoal}
                onChange={(e) => handleSettingChange('weeklyGoal', parseInt(e.target.value))}
                min="30"
                max="300"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Enable daily practice reminders
              </label>
            </div>
            
            {settings.notifications && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reminder Time</label>
                <input
                  type="time"
                  value={settings.dailyReminder}
                  onChange={(e) => handleSettingChange('dailyReminder', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dataSharing"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="dataSharing" className="ml-2 block text-sm text-gray-700">
                Allow anonymous data sharing for research
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="progressSharing"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="progressSharing" className="ml-2 block text-sm text-gray-700">
                Share progress with speech therapist
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button 
            onClick={saveSettings}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Reset Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset & Export</h3>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Export Progress Data
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Reset to Defaults
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Clear All Data
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            ⚠️ Warning: Clearing data will permanently remove your progress and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
