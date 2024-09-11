import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('username', data.username);
        setLoading(false);
        navigation.replace('TextPromptScreen');
      } else {
        setError(data.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed');
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title="Login" onPress={loginUser} />
          {error && <Text>{error}</Text>}
        </>
      )}
    </View>
  );
}
