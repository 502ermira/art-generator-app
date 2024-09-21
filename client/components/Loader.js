import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -55 }}>
      <ActivityIndicator size="large" color="#7049f6" />
      <Text>Loading...</Text>
    </View>
  );
}