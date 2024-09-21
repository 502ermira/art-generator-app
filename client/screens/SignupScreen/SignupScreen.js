import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
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
    
    const defaultProfilePicture = 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg';
    const finalProfilePicture = profilePicture || defaultProfilePicture;

    const normalizedUsername = username.toLowerCase();
    const normalizedEmail = email.toLowerCase();

    try {
      const response = await fetch('http://192.168.1.145:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: normalizedUsername,
          email: normalizedEmail,
          password,
          fullname,
          profilePicture: finalProfilePicture,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        Alert.alert(
          "Signup Successful",
          "You have signed up successfully! Please proceed to login with your credentials.",
          [
            { text: "OK", onPress: () => navigation.replace('Login') }
          ]
        );
      } else {
        if (data.error) {
          setError(data.error);
        } else {
          setError('An unknown error occurred. Please try again.');
        }
        setLoading(false);
      }
    } catch (err) {
      setError('Signup failed. Please check your connection and try again.');
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
                <Text style={styles.imageButtonText}><Icon name="image" size={30} color="#eee" /></Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.label}>Choose Your Profile Picture</Text>
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
    </KeyboardAvoidingView>
  );
}