import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons name="arrow-back" size={24} color="black" />
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

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerContainerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#999',
    textAlign: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerContainerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: '45%',
  },
  headerContainerNull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding:15,
    borderBottomWidth: 0,
    textAlign: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  backButton :{
    marginRight: 10,
  },
  menuButton : {
    marginLeft: 14,
  }
});
