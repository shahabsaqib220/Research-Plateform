// services/GroupMemberAuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GroupMemberAuthContext = createContext();

export const GroupMemberAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null); // Add phone number state

  // Check localStorage for token and user data on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('groupMemberToken');
    const storedUser = localStorage.getItem('groupMemberUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      // Set phone number from user data if available
      if (userData.phoneNumber) {
        setPhoneNumber(userData.phoneNumber);
      }
    }
  }, []);

  const memberLogin = (token, userData) => {
    localStorage.setItem('groupMemberToken', token);
    localStorage.setItem('groupMemberUser', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
    // Set phone number from user data if available
    if (userData.phoneNumber) {
      setPhoneNumber(userData.phoneNumber);
    }
    console.log('Member login:', userData);
  };

  const memberLogout = () => {
    localStorage.removeItem('groupMemberToken');
    localStorage.removeItem('groupMemberUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setPhoneNumber(null); // Reset phone number on logout
  };

  const updatePhoneNumber = (number) => {
    setPhoneNumber(number);
  };

  return (
    <GroupMemberAuthContext.Provider
      value={{ isAuthenticated, token, user, phoneNumber, updatePhoneNumber, memberLogin, memberLogout }}
    >
      {children}
    </GroupMemberAuthContext.Provider>
  );
};

export const useGroupMemberAuth = () => useContext(GroupMemberAuthContext);