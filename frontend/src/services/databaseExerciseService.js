import { API_CONFIG } from '../config/api';

// Database Exercise Service
export class DatabaseExerciseService {
  
  /**
   * Fetch all mapped exercises with difficulty levels and categories
   */
  static async getMappedExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.MAPPED}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching mapped exercises:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all exercises from the database
   */
  static async getAllExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.ALL}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  }
  
  /**
   * Fetch exercises by type
   */
  static async getExercisesByType(exerciseType) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.BY_TYPE}/${exerciseType}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises by type:', error);
      throw error;
    }
  }
  
  /**
   * Fetch exercises by difficulty level
   */
  static async getExercisesByDifficulty(difficultyLevel) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.BY_DIFFICULTY}/${difficultyLevel}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises by difficulty:', error);
      throw error;
    }
  }
  
  /**
   * Fetch exercises by category
   */
  static async getExercisesByCategory(category) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.BY_CATEGORY}/${category}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises by category:', error);
      throw error;
    }
  }
  
  /**
   * Search exercises by name or description
   */
  static async searchExercises(searchTerm) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.SEARCH}?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching exercises:', error);
      throw error;
    }
  }
  
  /**
   * Fetch exercises with pagination
   */
  static async getExercisesWithPagination(page = 0, size = 10) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.PAGINATED}?page=${page}&size=${size}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises with pagination:', error);
      throw error;
    }
  }
  
  /**
   * Get exercise statistics
   */
  static async getExerciseStatistics() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.STATISTICS}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercise statistics:', error);
      throw error;
    }
  }
  
  /**
   * Get exercises for user level
   */
  static async getExercisesForUserLevel(userLevel) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.USER_LEVEL}/${userLevel}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises for user level:', error);
      throw error;
    }
  }
  
  /**
   * Get exercises for beginner level
   */
  static async getBeginnerExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.BEGINNER}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching beginner exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get exercises for intermediate level
   */
  static async getIntermediateExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.INTERMEDIATE}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching intermediate exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get exercises for advanced level
   */
  static async getAdvancedExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.ADVANCED}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching advanced exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get breathing exercises
   */
  static async getBreathingExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.BREATHING}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching breathing exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get facial exercises
   */
  static async getFacialExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.FACIAL}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching facial exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get jaw exercises
   */
  static async getJawExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.JAW}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching jaw exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get tongue exercises
   */
  static async getTongueExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.TONGUE}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tongue exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get vocal exercises
   */
  static async getVocalExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.VOCAL}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching vocal exercises:', error);
      throw error;
    }
  }
  
  /**
   * Get relaxation exercises
   */
  static async getRelaxationExercises() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DATABASE_EXERCISES.RELAXATION}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching relaxation exercises:', error);
      throw error;
    }
  }
}

export default DatabaseExerciseService;
