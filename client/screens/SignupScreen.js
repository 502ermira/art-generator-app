import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Loader from '../components/Loader';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signupUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
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

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <Button title="Signup" onPress={signupUser} />
          {error && <Text>{error}</Text>}
        </>
      )}
    </View>
  );
}
