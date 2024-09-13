import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TextPromptScreen from '../screens/TextPromptScreen/TextPromptScreen';
import FavoritesScreen from '../screens/FavoritesScreen/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Navbar from '../components/Navbar';
import { UserProvider } from '../contexts/UserContext';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <UserProvider>
      <NavigationContainer independent={true}>
        <Navbar />
        <Stack.Navigator initialRouteName="TextPromptScreen">
          <Stack.Screen name="TextPromptScreen" component={TextPromptScreen} options={{ headerShown : false}} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
