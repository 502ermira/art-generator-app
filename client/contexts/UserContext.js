import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');

      if (token) {
        setIsLoggedIn(true);
        setUsername(storedUsername || '');
        setToken(token);
      } else {
        setIsLoggedIn(false);
        setUsername('');
        setToken('');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setToken('');
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, token, username, setIsLoggedIn, setUsername, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};
