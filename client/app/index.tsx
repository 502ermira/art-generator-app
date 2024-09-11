import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextPromptScreen from '../screens/TextPromptScreen/TextPromptScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import Navbar from '../components/Navbar';

const Stack = createNativeStackNavigator();

export default function Index() {
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
    <NavigationContainer independent={true}>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Stack.Navigator initialRouteName="TextPromptScreen">
        <Stack.Screen name="TextPromptScreen" component={TextPromptScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
