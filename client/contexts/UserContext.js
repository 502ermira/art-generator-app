import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');

      if (token) {
        setIsLoggedIn(true);
        setUsername(storedUsername || '');
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, username, setIsLoggedIn, setUsername, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
