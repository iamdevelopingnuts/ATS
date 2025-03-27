import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in by looking for token in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setCurrentUser(JSON.parse(userData));
      // Set axios default headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/login/', { username, password });
      
      const { access, refresh, user_id, username: user, email, role } = response.data;
      
      // Store token and user data in localStorage
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify({ id: user_id, username: user, email, role }));
      
      // Set axios default headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setCurrentUser({ id: user_id, username: user, email, role });
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      return { success: false, error: err.response?.data?.error || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/register/', userData);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      return { success: false, error: err.response?.data?.error || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Remove axios default headers
    delete axios.defaults.headers.common['Authorization'];
    
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};