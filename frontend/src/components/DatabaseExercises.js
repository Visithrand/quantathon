import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Clock, Target, TrendingUp, BookOpen, Star } from 'lucide-react';
import DatabaseExerciseService from '../services/databaseExerciseService';
import BackButton from './BackButton';

const DatabaseExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);
  const [statistics, setStatistics] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableDifficulties, setAvailableDifficulties] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    loadExercises();
    loadStatistics();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedType, selectedDifficulty, selectedCategory]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const response = await DatabaseExerciseService.getAllExercises();
      if (response.success) {
        setExercises(response.exercises);
        setTotalPages(Math.ceil(response.total_exercises / pageSize));
      } else {
        setError(response.message || 'Failed to load exercises');
      }
    } catch (error) {
      setError('Error loading exercises: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await DatabaseExerciseService.getExerciseStatistics();
      if (response.success) {
        setStatistics(response.statistics);
        setAvailableTypes(response.available_exercise_types || []);
        setAvailableDifficulties(response.available_difficulty_levels || []);
        setAvailableCategories(response.available_categories || []);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const filterExercises = () => {
    let filtered = [...exercises];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise => 
        exercise.exercise_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(exercise => exercise.exercise_type === selectedType);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty_level === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    setFilteredExercises(filtered);
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'breathing': return '🫁';
      case 'facial': return '😊';
      case 'jaw': return '🦷';
      case 'tongue': return '👅';
      case 'vocal': return '🎵';
      case 'relaxation': return '🧘';
      default: return '💪';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading exercises from database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-lg font-semibold">Error Loading Exercises</p>
              <p className="mt-2">{error}</p>
              <button 
                onClick={loadExercises}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton to="/home" variant="outline">
              Back to Home
            </BackButton>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Speech Therapy Exercises
          </h1>
          <p className="text-xl text-gray-600">
            {statistics.total_exercises || exercises.length} exercises available from your database
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{statistics.total_exercises || exercises.length}</div>
            <div className="text-gray-600">Total Exercises</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{statistics.exercise_types || availableTypes.length}</div>
            <div className="text-gray-600">Exercise Types</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{statistics.difficulty_levels || availableDifficulties.length}</div>
            <div className="text-gray-600">Difficulty Levels</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{statistics.categories || availableCategories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="w-full lg:w-48">
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="w-full lg:w-48">
              <select
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                {availableDifficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.map((exercise, index) => (
              <div key={exercise.id || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Exercise Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getTypeIcon(exercise.exercise_type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty_level)}`}>
                      {exercise.difficulty_level || 'Unknown'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {exercise.exercise_name || 'Unnamed Exercise'}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {exercise.description || 'No description available'}
                  </p>
                </div>

                {/* Exercise Details */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {exercise.duration_seconds || 0}s
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Target className="w-4 h-4 mr-1" />
                      {exercise.repetitions || 0}x
                    </div>
                  </div>

                  {/* Target Muscles */}
                  {exercise.target_muscles && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Target Muscles:</p>
                      <p className="text-sm text-gray-700">{exercise.target_muscles}</p>
                    </div>
                  )}

                  {/* Speech Benefits */}
                  {exercise.speech_benefits && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Benefits:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{exercise.speech_benefits}</p>
                    </div>
                  )}

                  {/* Instructions Preview */}
                  {exercise.instructions && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{exercise.instructions}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 mr-2" />
                    Start Exercise
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(0, Math.min(totalPages - 1, currentPage - 2 + i));
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseExercises;
