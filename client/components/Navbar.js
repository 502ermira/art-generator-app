import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ isLoggedIn, username, onLogout }) {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#f8f8f8', borderBottomWidth: 1 }}>
      <Text style={{ fontSize: 20 }}>AI Image Generator</Text>

      {isLoggedIn ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, marginRight: 20 }}>Hello, {username}!</Text>
          <Button title="Logout" onPress={onLogout} />
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
          <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
        </View>
      )}
    </View>
  );
}
