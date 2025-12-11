import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUsername = localStorage.getItem('adminUsername');
    if (savedToken) {
      setToken(savedToken);
      setUsername(savedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authApi.login(credentials);
      const { token: newToken, username: newUsername } = response.data;
      
      setToken(newToken);
      setUsername(newUsername);
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminUsername', newUsername);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setError(null);
  };

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
