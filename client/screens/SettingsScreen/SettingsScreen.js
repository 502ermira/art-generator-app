import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { UserContext } from '../../contexts/UserContext';
import styles from './SettingsScreenStyles.js';

export default function SettingsScreen({ navigation }) {
  const { handleLogout } = useContext(UserContext);

  const handleLogoutAndRefresh = () => {
    handleLogout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'TextPromptScreen' }],
    });
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const navigateToFavorites = () => {
    navigation.navigate('FavoritesScreen');
  };

  return (
    <>
      <CustomHeader title="Settings" screenType={null} />

      <View style={styles.container}>
        <TouchableOpacity style={styles.option} onPress={navigateToChangePassword}>
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option} onPress={navigateToFavorites}>
          <Text style={styles.optionText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handleLogoutAndRefresh}>
         <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}