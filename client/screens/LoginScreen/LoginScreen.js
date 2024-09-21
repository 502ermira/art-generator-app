import React, { useState, useContext } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader.js';
import { UserContext } from '../../contexts/UserContext.js';
import { styles } from './LoginScreenStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setUsername } = useContext(UserContext);

  const loginUser = async () => {
    setLoading(true);
    const normalizedEmail = email.toLowerCase();
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('username', data.username);

        setIsLoggedIn(true);
        setUsername(data.username);
        setTimeout(() => {
          navigation.replace('TextPromptScreen');
        }, 100);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Login failed');
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Login</Text>
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
          <TouchableOpacity style={styles.button} onPress={loginUser}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      )}
    </KeyboardAvoidingView>
  );
}