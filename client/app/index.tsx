import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TextPromptScreen from '../screens/TextPromptScreen/TextPromptScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import Navbar from '../components/Navbar';
import { UserProvider } from '../contexts/UserContext';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <UserProvider>
      <NavigationContainer independent={true}>
        <Navbar />
        <Stack.Navigator initialRouteName="TextPromptScreen">
          <Stack.Screen name="TextPromptScreen" component={TextPromptScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
