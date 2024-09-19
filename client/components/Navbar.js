import React, { useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './NavbarStyles';

const logo = require('../assets/images/nav-logo.png');

export default function Navbar() {
  const navigation = useNavigation();
  const { isLoggedIn, handleLogout } = useContext(UserContext);

  return (
    <>
      {!isLoggedIn ? (
        // Navbar for Logged Out Users (Top Navbar)
        <View style={styles.navbarTopContainer}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.authContainer}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.authButtonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Navbar for Logged In Users (Bottom Navbar)
        <View style={styles.navbarBottomContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('TextPromptScreen')}>
            <Icon name="home" style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('SearchScreen')}>
            <Icon name="search" style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="user-circle" style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
