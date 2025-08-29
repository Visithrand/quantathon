# Speech Analysis Backend

Professional speech analysis API for the SpeechCoach application.

## Features

- **Real-time Audio Analysis**: Process audio recordings for speech quality assessment
- **Professional Metrics**: Pronunciation, fluency, intonation, stress patterns
- **AI-Powered Feedback**: Generate personalized improvement suggestions
- **Comprehensive Scoring**: Multiple dimensions of speech evaluation

## Setup

### Prerequisites

- Python 3.8+
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   cd SpeechCoach/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /api/speech-analysis

Analyze speech audio and provide professional feedback.

**Request Body:**
```json
{
  "audio": "base64_encoded_audio_data",
  "audioFormat": "audio/wav",
  "storyId": 1,
  "storyTitle": "Story Title",
  "storyContent": "Story content...",
  "storyWordCount": 150,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00Z",
  "analysis": {
    "duration": 15.5,
    "averageVolume": 0.12,
    "volumeRange": 0.45,
    "maxVolume": 0.67,
    "speechRate": 145,
    "clarity": 85,
    "consistency": 78,
    "energy": 82,
    "sampleRate": 22050,
    "speechSegments": 8
  },
  "pronunciationScore": 88,
  "fluencyScore": 82,
  "intonationScore": 79,
  "stressPatternScore": 75,
  "wordAccuracy": 85,
  "confidenceLevel": 87,
  "suggestedImprovements": [
    "Practice clear pronunciation of difficult words",
    "Work on smooth transitions between words"
  ],
  "detectedIssues": [
    "Speech clarity requires attention"
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "Speech Analysis API"
}
```

## Analysis Metrics

### Core Metrics
- **Duration**: Recording length in seconds
- **Volume**: Average, range, and maximum volume levels
- **Speech Rate**: Estimated words per minute
- **Clarity**: Speech articulation quality
- **Consistency**: Volume and pace stability
- **Energy**: Distribution of audio energy

### Advanced Metrics
- **Pronunciation**: Word articulation quality
- **Fluency**: Smoothness of speech flow
- **Intonation**: Pitch variation patterns
- **Stress Patterns**: Emphasis and rhythm
- **Word Accuracy**: Estimated reading accuracy
- **Confidence Level**: Signal quality assessment

## Technical Details

### Audio Processing
- **Sample Rate**: 22050 Hz (optimized for speech)
- **Format**: WAV audio files
- **Analysis**: Spectral features, MFCC, pitch tracking

### Libraries Used
- **librosa**: Audio analysis and feature extraction
- **numpy**: Numerical computations
- **scipy**: Scientific computing
- **Flask**: Web framework

## Error Handling

The API includes comprehensive error handling:
- Invalid audio data
- Processing failures
- Network timeouts
- Graceful fallbacks to local analysis

## Performance

- **Processing Time**: Typically 2-5 seconds for 30-second recordings
- **Memory Usage**: Optimized for concurrent requests
- **Scalability**: Designed for production deployment

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Code Style
```bash
pip install black flake8
black app.py
flake8 app.py
```

## Deployment

### Production Setup
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables
```bash
export FLASK_ENV=production
export FLASK_DEBUG=0
```

## Support

For issues and questions:
1. Check the logs for error details
2. Verify audio format and quality
3. Ensure all dependencies are installed
4. Check network connectivity for API calls

## License

This project is part of the SpeechCoach application.
