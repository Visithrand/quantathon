import React from 'react';
import BackButton from './BackButton';

function AnalysisResults({ result }) {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton to="/home" variant="outline">
          Back to Home
        </BackButton>
      </div>
      
      <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Analysis Results</h4>
      
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${getScoreBg(result.overallScore)}`}>
          <div className="text-sm font-medium text-gray-600">Overall Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
            {result.overallScore}/100
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getScoreLabel(result.overallScore)}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBg(result.accuracyScore)}`}>
          <div className="text-sm font-medium text-gray-600">Accuracy</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.accuracyScore)}`}>
            {result.accuracyScore}/100
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getScoreLabel(result.accuracyScore)}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${getScoreBg(result.clarityScore)}`}>
          <div className="text-sm font-medium text-gray-600">Clarity</div>
          <div className={`text-2xl font-bold ${getScoreColor(result.clarityScore)}`}>
            {result.clarityScore}/100
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getScoreLabel(result.clarityScore)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Your Performance</span>
          <span>{result.overallScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              result.overallScore >= 85 ? 'bg-green-500' :
              result.overallScore >= 70 ? 'bg-yellow-500' :
              result.overallScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{width: `${result.overallScore}%`}}
          ></div>
        </div>
      </div>

      {/* Feedback */}
      {result.feedback && result.feedback.length > 0 && (
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-3">Feedback & Tips:</h5>
          <div className="space-y-2">
            {result.feedback.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement */}
      {result.improvement !== undefined && (
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-2">Progress:</h5>
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
            result.improvement > 0 ? 'bg-green-100 text-green-800' :
            result.improvement < 0 ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {result.improvement > 0 ? '📈' : result.improvement < 0 ? '📉' : '➡️'}
            <span className="ml-1">
              {result.improvement > 0 ? `+${result.improvement}% improvement` :
               result.improvement < 0 ? `${result.improvement}% decline` :
               'No change'}
            </span>
          </div>
        </div>
      )}

      {/* Achievement Badge */}
      {result.overallScore >= 85 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-400 to-green-600 rounded-lg text-white text-center">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-semibold text-lg">Excellent Work!</div>
          <div className="text-sm opacity-90">You've mastered this exercise!</div>
        </div>
      )}

      {/* Encouragement for Lower Scores */}
      {result.overallScore < 70 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg text-white text-center">
          <div className="text-2xl mb-2">💪</div>
          <div className="font-semibold text-lg">Keep Practicing!</div>
          <div className="text-sm opacity-90">Every practice session makes you better!</div>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">Next Steps:</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Practice this exercise again to improve your score</p>
          <p>• Try exercises with similar difficulty level</p>
          <p>• Focus on the feedback points mentioned above</p>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;
