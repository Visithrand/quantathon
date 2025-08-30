import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, validateCurrentToken, logoutUser } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.token) {
          // Validate the token
          const isValid = await validateCurrentToken();
          if (isValid) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear auth data
            await logoutUser();
          }
        } else {
          // No user found, create a default user for testing
          const defaultUser = {
            id: 'default_user',
            name: 'Test User',
            email: 'test@example.com',
            token: 'default_token'
          };
          
          // Store default user in localStorage
          localStorage.setItem('authToken', defaultUser.token);
          localStorage.setItem('user', JSON.stringify(defaultUser));
          
          // Set as authenticated
          setUser(defaultUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Create default user even if there's an error
        const defaultUser = {
          id: 'default_user',
          name: 'Test User',
          email: 'test@example.com',
          token: 'default_token'
        };
        
        localStorage.setItem('authToken', defaultUser.token);
        localStorage.setItem('user', JSON.stringify(defaultUser));
        
        setUser(defaultUser);
        setIsAuthenticated(true);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    // Store token and user data in localStorage
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    
    // Update context state
    setUser(userData.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutUser();
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Update context state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
