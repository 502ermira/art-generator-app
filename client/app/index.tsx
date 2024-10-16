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
import LikesScreen from '../screens/LikesScreen/LikesScreen';
import CommentsScreen from '../screens/CommentsScreen/CommentsScreen';
import RepostsScreen from '../screens/RepostsScreen/RepostsScreen';
import NotificationScreen from '../screens/NotificationScreen/NotificationScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import PostImageScreen from '../screens/PostImageScreen/PostImageScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import BlockedUsersScreen from '../screens/BlockedUsersScreen/BlockedUsersScreen';
import Navbar from '../components/Navbar';
import GlobalNotificationPopup from '../components/GlobalNotificationPopup';
import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from '../contexts/ThemeContext';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <UserProvider>
     <ThemeProvider>
      <NavigationContainer independent={true}>
        <Navbar />
        <Stack.Navigator initialRouteName="TextPromptScreen">
          <Stack.Screen name="TextPromptScreen" component={TextPromptScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Followers" component={FollowersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Following" component={FollowersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LikesScreen" component={LikesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PostScreen" component={PostScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CommentsScreen" component={CommentsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RepostsScreen" component={RepostsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="PostImageScreen" component={PostImageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BlockedUsersScreen" component={BlockedUsersScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
        <GlobalNotificationPopup />
      </NavigationContainer>
     </ThemeProvider>
    </UserProvider>
  );
}