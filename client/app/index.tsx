import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TextPromptScreen from '../screens/TextPromptScreen/TextPromptScreen';
import FavoritesScreen from '../screens/FavoritesScreen/FavoritesScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignupScreen from '../screens/SignupScreen/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen/UserProfileScreen';
import PostScreen from '../screens/PostScreen/PostScreen';
import FollowersScreen from '../screens/FollowersScreen/FollowersScreen';
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
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Followers" component={FollowersScreen} />
          <Stack.Screen name="Following" component={FollowersScreen} />
          <Stack.Screen name="PostScreen" component={PostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
