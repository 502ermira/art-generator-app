import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, TextInput, Pressable, Text, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../../contexts/UserContext';
import styles from './EditProfileScreenStyles';

export default function EditProfileScreen({ navigation, route }) {
  const { token } = useContext(UserContext);
  const { updateUserData } = route.params;
  const [fullname, setFullname] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://192.168.1.145:5000/auth/profile', {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setFullname(data.fullname || '');
        setProfilePicture(data.profilePicture || '');
        setUsername(data.username || '');
        setEmail(data.email || '');
      } catch (error) {
        setError('Failed to load profile');
      }
    };

    fetchUserData();
  }, [token]);

  const handleSave = async () => {
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ fullname, profilePicture, username, email }),
      });

      const result = await response.json();

      if (response.ok) {
        let successMessage = 'Profile updated successfully';

        if (result.updates) {
          const updatedFields = Object.keys(result.updates).join(', ');
          successMessage = `${updatedFields} updated successfully`;
          updateUserData(result.updates);
        }

        setError(successMessage);
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('Update failed');
    }
  };

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
        setError('Password updated successfully');
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Password change failed');
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setError('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        <Pressable onPress={selectImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Select Profile Picture</Text>
        </Pressable>
        <TextInput
          placeholder="Full Name"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
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
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable onPress={handleChangePassword} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}