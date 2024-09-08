import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';

export default function TextPromptScree() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://192.168.1.145:3000/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (response.ok) {
        setImageUrl(data.image);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Image Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter prompt"
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Generate Image" onPress={generateImage} disabled={loading} />

      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
