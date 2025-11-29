import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await api.get('/auth/me');
      if (response.data && response.data.user) {
        const userData = {
          id: response.data.user._id || response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          profilePic: response.data.user.profilePic,
          profileComplete: response.data.user.profileComplete || response.data.user.isVerified || false
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User authenticated:', userData);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔵 Login attempt:', email);
      
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token && response.data.user) {
        const token = response.data.token;
        const userData = {
          id: response.data.user._id || response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          profilePic: response.data.user.profilePic,
          profileComplete: response.data.user.profileComplete || response.data.user.isVerified || false
        };

        // Save to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);

        console.log('✅ Login successful:', userData);

        return { success: true, user: userData };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('🔵 Signup attempt:', userData.email);
      
      const response = await api.post('/auth/signup', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password
      });
      
      if (response.data && response.data.token && response.data.user) {
        const token = response.data.token;
        const userDataFromServer = {
          id: response.data.user._id || response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          profilePic: response.data.user.profilePic,
          profileComplete: response.data.user.profileComplete || false
        };

        // Save to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userDataFromServer));
        
        // Update state
        setUser(userDataFromServer);
        setIsAuthenticated(true);

        console.log('✅ Signup successful:', userDataFromServer);
        return { 
          success: true, 
          user: userDataFromServer,
          message: response.data.message || 'Account created successfully'
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('❌ Signup error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Signup failed';
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      console.log('🔵 Logging out...');
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logged out');
    }
  }, []);

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    console.log('✅ User updated:', updatedUser);
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      console.log('🔵 Completing onboarding...');
      
      // Update local user data
      const updatedUser = {
        ...user,
        ...onboardingData,
        profileComplete: true
      };
      
      updateUser(updatedUser);
      console.log('✅ Onboarding completed');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Onboarding failed:', error);
      return { 
        success: false, 
        error: 'Onboarding failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
