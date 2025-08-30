import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Target, 
    Clock, 
    Repeat, 
    Layers, 
    Search,
    Filter,
    Play,
    BookOpen,
    Heart,
    Brain,
    Zap,
    TrendingUp,
    Award,
    Users,
    BarChart3,
    MessageCircle,
    Mic,
    Leaf,
    AlertCircle
} from 'lucide-react';
import { DatabaseExerciseService } from '../services/databaseExerciseService';
import BackButton from './BackButton';

const ExerciseDashboard = () => {
    const [mappedExercises, setMappedExercises] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        beginner: true,
        intermediate: true,
        advanced: true
    });

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const response = await DatabaseExerciseService.getMappedExercises();
            if (response.success) {
                setMappedExercises(response);
            } else {
                setError(response.message || 'Failed to load exercises');
            }
        } catch (err) {
            setError('Error loading exercises: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (difficulty) => {
        setExpandedSections(prev => ({
            ...prev,
            [difficulty]: !prev[difficulty]
        }));
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return <Heart className="w-4 h-4" />;
            case 'intermediate': return <TrendingUp className="w-4 h-4" />;
            case 'advanced': return <Zap className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'breathing': return <Activity className="w-4 h-4" />;
            case 'facial': return <Users className="w-4 h-4" />;
            case 'jaw': return <Target className="w-4 h-4" />;
            case 'tongue': return <MessageCircle className="w-4 h-4" />;
            case 'vocal': return <Mic className="w-4 h-4" />;
            case 'relaxation': return <Leaf className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const filterExercises = (exercises) => {
        if (!exercises) return [];
        
        return exercises.filter(exercise => {
            const matchesDifficulty = selectedDifficulty === 'all' || 
                getDifficultyLevel(exercise) === selectedDifficulty;
            const matchesType = selectedType === 'all' || 
                getExerciseType(exercise) === selectedType;
            const matchesSearch = !searchTerm || 
                exercise.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exercise.targetMuscles?.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesDifficulty && matchesType && matchesSearch;
        });
    };

    const getDifficultyLevel = (exercise) => {
        const desc = exercise.description?.toLowerCase() || '';
        if (desc.includes('advanced') || desc.includes('complex')) return 'advanced';
        if (desc.includes('intermediate') || desc.includes('moderate')) return 'intermediate';
        return 'beginner';
    };

    const getExerciseType = (exercise) => {
        const desc = exercise.description?.toLowerCase() || '';
        if (desc.includes('breathing')) return 'breathing';
        if (desc.includes('facial')) return 'facial';
        if (desc.includes('jaw')) return 'jaw';
        if (desc.includes('tongue')) return 'tongue';
        if (desc.includes('vocal')) return 'vocal';
        if (desc.includes('relaxation')) return 'relaxation';
        return 'general';
    };

    const getCategoryFromTargetMuscles = (targetMuscles) => {
        if (!targetMuscles) return 'General Speech Training';
        
        const muscles = targetMuscles.toLowerCase();
        if (muscles.includes('diaphragm') || muscles.includes('lungs')) return 'Breathing & Voice Control';
        if (muscles.includes('facial') || muscles.includes('lips')) return 'Facial Muscle Training';
        if (muscles.includes('jaw')) return 'Jaw & Mouth Control';
        if (muscles.includes('tongue')) return 'Tongue & Articulation';
        if (muscles.includes('vocal')) return 'Vocal & Resonance';
        return 'General Speech Training';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-700">Loading Exercises...</h2>
                        <p className="text-gray-500">Fetching your speech therapy exercises from the database</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Exercises</h2>
                        <p className="text-red-500 mb-4">{error}</p>
                        <button 
                            onClick={loadExercises}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const exercisesByDifficulty = mappedExercises?.exercises_by_difficulty || {};
    const statistics = mappedExercises?.statistics || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Back Button */}
                    <div className="mb-4">
                        <BackButton to="/home" variant="outline">
                            Back to Home
                        </BackButton>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-purple-600" />
                                Speech Therapy Exercises
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Master your speech with our comprehensive exercise library
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 rounded-lg p-3">
                                <div className="text-2xl font-bold text-purple-700">
                                    {mappedExercises?.total_exercises || 0}
                                </div>
                                <div className="text-sm text-purple-600">Total Exercises</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search exercises by description or target muscles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">All Difficulties</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="breathing">Breathing</option>
                                <option value="facial">Facial</option>
                                <option value="jaw">Jaw</option>
                                <option value="tongue">Tongue</option>
                                <option value="vocal">Vocal</option>
                                <option value="relaxation">Relaxation</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Exercises</p>
                                <p className="text-2xl font-bold text-gray-900">{statistics.total_exercises || 0}</p>
                            </div>
                            <div className="bg-purple-100 rounded-lg p-3">
                                <Activity className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Beginner</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {statistics.difficulty_distribution?.beginner || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                                <Heart className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Intermediate</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {statistics.difficulty_distribution?.intermediate || 0}
                                </p>
                            </div>
                            <div className="bg-yellow-100 rounded-lg p-3">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Advanced</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {statistics.difficulty_distribution?.advanced || 0}
                                </p>
                            </div>
                            <div className="bg-red-100 rounded-lg p-3">
                                <Zap className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exercise Sections */}
                {['beginner', 'intermediate', 'advanced'].map((difficulty) => {
                    const exercises = exercisesByDifficulty[difficulty] || [];
                    const filteredExercises = filterExercises(exercises);
                    
                    if (filteredExercises.length === 0) return null;
                    
                    return (
                        <div key={difficulty} className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                            <div 
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleSection(difficulty)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getDifficultyColor(difficulty)}`}>
                                        {getDifficultyIcon(difficulty)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 capitalize">
                                            {difficulty} Exercises
                                        </h2>
                                        <p className="text-gray-600">
                                            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {expandedSections[difficulty] ? '−' : '+'}
                                </div>
                            </div>
                            
                            {expandedSections[difficulty] && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredExercises.map((exercise, index) => (
                                            <div key={exercise.id || index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                                                        {getDifficultyLevel(exercise)}
                                                    </div>
                                                    <div className="text-gray-400">
                                                        {getTypeIcon(getExerciseType(exercise))}
                                                    </div>
                                                </div>
                                                
                                                <h3 className="font-semibold text-gray-900 mb-2">
                                                    Exercise {exercise.id || index + 1}
                                                </h3>
                                                
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {exercise.description || 'No description available'}
                                                </p>
                                                
                                                <div className="space-y-2 mb-4">
                                                    {exercise.targetMuscles && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Target className="w-4 h-4" />
                                                            <span>{exercise.targetMuscles}</span>
                                                        </div>
                                                    )}
                                                    
                                                    {exercise.durationSeconds && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{exercise.durationSeconds}s</span>
                                                        </div>
                                                    )}
                                                    
                                                    {exercise.repetitions && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Repeat className="w-4 h-4" />
                                                            <span>{exercise.repetitions} reps</span>
                                                        </div>
                                                    )}
                                                    
                                                    {exercise.sets && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Layers className="w-4 h-4" />
                                                            <span>{exercise.sets} sets</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                                                        <Play className="w-4 h-4 inline mr-2" />
                                                        Start Exercise
                                                    </button>
                                                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                                                        <BookOpen className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* No Results */}
                {!loading && !error && 
                 filterExercises(Object.values(exercisesByDifficulty).flat()).length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Exercises Found</h2>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search criteria or filters
                        </p>
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedDifficulty('all');
                                setSelectedType('all');
                            }}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseDashboard;
