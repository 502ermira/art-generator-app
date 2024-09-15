import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../../components/Loader.js';
import { styles } from './SignupScreenStyles';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signupUser = async () => {
    setLoading(true);
    
    const defaultProfilePicture = 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg'; // Replace with an actual default URL
    const finalProfilePicture = profilePicture || defaultProfilePicture;

    try {
      const response = await fetch('http://192.168.1.145:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, fullname, profilePicture: finalProfilePicture }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        navigation.replace('Login');
      } else {
        setError(data.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Signup failed');
      setLoading(false);
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
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Text style={styles.title}>Signup</Text>
          <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageButtonText}>Select Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Fullname"
            placeholderTextColor="#eee"
            value={fullname}
            onChangeText={setFullname}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#eee"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#eee"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#eee"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={signupUser}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      )}
    </View>
  );
}