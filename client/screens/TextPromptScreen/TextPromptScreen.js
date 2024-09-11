import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { UserContext } from '../../contexts/UserContext';
import styles from './TextPromptScreenStyles';

export default function TextPromptScreen() {
  const { isLoggedIn } = useContext(UserContext);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState('');

  // Load either user's favorites or guest favorites
  useEffect(() => {
    const loadFavorites = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);

      if (storedToken) {
        // User is logged in, fetch favorites from backend
        const response = await fetch('http://192.168.1.145:5000/auth/favorites', {
          headers: { Authorization: storedToken },
        });
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        // Guest mode, fetch favorites from AsyncStorage
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      }
    };

    loadFavorites();
  }, [isLoggedIn]);

  // Save favorite images based on login state
  const saveFavorite = async (image) => {
    if (token) {
      // User is logged in, save favorite to backend
      await fetch('http://192.168.1.145:5000/auth/favorites', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });
    } else {
      // Guest mode, save favorite locally in AsyncStorage
      const updatedFavorites = [...favorites, image];
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://192.168.1.145:5000/api/generate-image', {
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

  const shareImage = async () => {
    try {
      await Sharing.shareAsync(imageUrl);
    } catch (err) {
      console.error('Error sharing image:', err);
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
        <>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={() => saveFavorite(imageUrl)}>
            <Text style={styles.buttonText}>Favorite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={shareImage}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.favoritesContainer}>
        <Text style={styles.favoritesTitle}>Favorite Images</Text>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <Image key={index} source={{ uri: favorite }} style={styles.favoriteImage} />
          ))
        ) : (
          <Text>No favorites yet.</Text>
        )}
      </View>
    </View>
  );
}
