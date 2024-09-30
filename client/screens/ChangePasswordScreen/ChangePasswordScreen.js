import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, Pressable, Text, Alert, View } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import styles from '../EditProfileScreen/EditProfileScreenStyles';

export default function ChangePasswordScreen({ navigation }) {
  const { token } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        navigation.goBack();
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Password change failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <Pressable onPress={handleChangePassword} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
