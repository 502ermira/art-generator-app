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
    <View style={styles.navbarContainer}>
      <Image source={logo} style={styles.logo} />
      {isLoggedIn ? (
        <View style={styles.loggedInContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Icon name="user-circle" style={styles.usernameText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      ) : (
        <View style={styles.authContainer}>
          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.authButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
