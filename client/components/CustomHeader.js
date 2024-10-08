import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CustomHeader({ title, screenType }) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <View 
      style={
        screenType === 'UserProfileScreen' ? styles.headerContainer 
        : screenType === 'ProfileScreen' && !canGoBack ? styles.headerContainerNew
        : screenType === 'ProfileScreen' ? styles.headerContainerProfile 
        : screenType === 'FollowersFollowing' ? styles.headerContainerFollowers 
        : styles.headerContainerNull
      }
    >
      {canGoBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
      )}
      
      <Text style={styles.headerTitle}>{title}</Text>

      {screenType === 'UserProfileScreen' ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
          <MaterialIcons name="menu-open" size={24} color="black" />
        </TouchableOpacity>
      ) : screenType === 'ProfileScreen' ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.menuButton}>
          <Ionicons name="settings" size={24} color="black" />
        </TouchableOpacity>
      ) : screenType === 'FollowersFollowing' ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.followersButton}>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 11,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop:56,
  },
  headerContainerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 11,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop:56,
  },
  headerContainerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 11,
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: '44%',
    paddingTop:56,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  headerContainerNull: {
    paddingTop:56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding:11,
    borderBottomWidth: 0,
    textAlign: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  headerContainerFollowers : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 11,
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: '14%',
    paddingTop:56,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '600',
  },
  followersButton : {
    marginLeft:0,
    marginRight: '90%,'
  },
  backButton :{
    marginRight: 13,
  },
  menuButton : {
    marginLeft: 20,
  }
});
