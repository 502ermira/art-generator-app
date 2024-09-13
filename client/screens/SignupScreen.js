import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import Loader from '../components/Loader';

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
    
    const defaultProfilePicture = 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg';  // Replace with an actual default URL
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

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TextInput placeholder="Fullname" value={fullname} onChangeText={setFullname} />
          <TextInput placeholder="Profile Picture URL (optional)" value={profilePicture} onChangeText={setProfilePicture} />
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
