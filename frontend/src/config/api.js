// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete'
  },
  EXERCISES: {
    LIST: '/exercises',
    RECOMMENDATIONS: '/exercises/recommendations',
    PASSAGES: '/exercises/passages',
    PROGRESS: '/exercises/progress',
    TRENDS: '/exercises/progress/trends'
  },
  DATABASE_EXERCISES: {
    ALL: '/database-exercises/all',
    MAPPED: '/database-exercises/mapped',
    BY_TYPE: '/database-exercises/type',
    BY_DIFFICULTY: '/database-exercises/difficulty',
    BY_CATEGORY: '/database-exercises/category',
    SEARCH: '/database-exercises/search',
    PAGINATED: '/database-exercises/page',
    STATISTICS: '/database-exercises/statistics',
    USER_LEVEL: '/database-exercises/user-level',
    // Specific difficulty levels
    BEGINNER: '/database-exercises/beginner',
    INTERMEDIATE: '/database-exercises/intermediate',
    ADVANCED: '/database-exercises/advanced',
    // Specific exercise types
    BREATHING: '/database-exercises/type/breathing',
    FACIAL: '/database-exercises/type/facial',
    JAW: '/database-exercises/type/jaw',
    TONGUE: '/database-exercises/type/tongue',
    VOCAL: '/database-exercises/type/vocal',
    RELAXATION: '/database-exercises/type/relaxation'
  },
  WEEKLY_PLAN: {
    GET: '/weekly-plan',
    UPDATE: '/weekly-plan/update'
  },
  SPEECH_ANALYSIS: {
    ANALYZE: '/speech/analyze'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Auth API functions
export const loginUser = async (credentials) => {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signupUser = async (userData) => {
  const response = await fetch(getApiUrl(API_CONFIG.AUTH.SIGNUP), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const logoutUser = async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('authToken');
  return user ? { ...JSON.parse(user), token } : null;
};

export const validateCurrentToken = async () => {
  const user = getCurrentUser();
  if (!user || !user.token) return false;
  
  try {
    // For now, just check if token exists in localStorage
    // In production, you'd validate with backend
    return !!localStorage.getItem('authToken');
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};
