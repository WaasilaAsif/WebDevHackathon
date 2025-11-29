import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

// MOCK USER DATA - Remove this when backend is ready
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@test.com',
    password: 'password123',
    fullName: 'Test User',
    profileComplete: true
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      console.log('✅ User found in localStorage');
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else {
      console.log('❌ No user in localStorage');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      console.log('🔵 Mock login attempt:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find mock user
      const mockUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!mockUser) {
        console.log('❌ Mock login failed: Invalid credentials');
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }

      // Create mock token
      const token = 'mock-jwt-token-' + Date.now();
      const userData = {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        profileComplete: mockUser.profileComplete
      };

      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      console.log('✅ Mock login successful:', userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Mock login error:', error);
      return { 
        success: false, 
        error: 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('🔵 Mock signup attempt:', userData.email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === userData.email);
      if (existingUser) {
        console.log('❌ Mock signup failed: User already exists');
        return { 
          success: false, 
          error: 'User already exists' 
        };
      }

      // Create new mock user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        fullName: userData.fullName || userData.email.split('@')[0],
        profileComplete: false // New users need onboarding
      };

      // Create mock token
      const token = 'mock-jwt-token-' + Date.now();

      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);

      console.log('✅ Mock signup successful:', newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Mock signup error:', error);
      return { 
        success: false, 
        error: 'Signup failed' 
      };
    }
  };

  const logout = useCallback(() => {
    console.log('🔵 Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Logged out');
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

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
