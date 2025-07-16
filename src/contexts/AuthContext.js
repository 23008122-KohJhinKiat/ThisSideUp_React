// File: src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginAPI, signupAPI } from '../DataPack/Data'; // Mock API

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persist user session (simple localStorage example)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // const login = async (email, password) => {
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const userData = await loginAPI(email, password);
  //     setCurrentUser(userData);
  //     localStorage.setItem('currentUser', JSON.stringify(userData));
  //     setLoading(false);
  //     return userData;
  //   } catch (err) {
  //     setError(err.message || "Failed to login.");
  //     setLoading(false);
  //     throw err;
  //   }
  // };

  const signup = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await signupAPI(userData); // {name, email, password, role (if employee signup)}
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return newUser;
    } catch (err) {
      setError(err.message || "Failed to sign up.");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Potentially clear other sensitive context data on logout
  };

  const value = {
    currentUser,
    loading,
    error,
    // login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);