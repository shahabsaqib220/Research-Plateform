// services/AuthContext.js
'use client';
import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser ] = useState(null); // Store user details globally

  // Check token on app initialization
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser  = JSON.parse(localStorage.getItem("userDetails")); // Get user details from localStorage
    if (savedToken && savedUser ) {
      setToken(savedToken);
      setIsLoggedIn(true);
      setUser (savedUser ); // Set user details in state
    }
  }, []);

  // Login function
  const login = (token, userDetails) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userDetails", JSON.stringify(userDetails)); // Save user details
    setToken(token);
    setUser (userDetails); // Set user details in state
    setIsLoggedIn(true);
    z
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails"); // Remove user details from localStorage
    setToken(null);
    setUser (null); // Reset user details
    setIsLoggedIn(false);
  };

  // Optional: You can add a function to check if the user is logged in
  const checkLoginStatus = () => {
    return isLoggedIn;
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, user, login, logout, checkLoginStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};