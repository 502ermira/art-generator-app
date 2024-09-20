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
    padding: 13,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop:60,
  },
  headerContainerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 13,
    borderBottomWidth: 1,
    borderColor: '#999',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop:60,
  },
  headerContainerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 13,
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: '44%',
    paddingTop:60,
  },
  headerContainerNull: {
    paddingTop:60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding:13,
    borderBottomWidth: 0,
    textAlign: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '600',
  },
  backButton :{
    marginRight: 13,
  },
  menuButton : {
    marginLeft: 20,
  }
});
