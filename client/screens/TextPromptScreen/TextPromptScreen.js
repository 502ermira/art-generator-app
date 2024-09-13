import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ImageBackground, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import styles from './TextPromptScreenStyles';

const backgroundImage = require('../../assets/images/bg.jpg');

export default function TextPromptScreen() {
  const { isLoggedIn } = useContext(UserContext);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);

      if (storedToken) {
        const response = await fetch('http://192.168.1.145:5000/auth/favorites', {
          headers: { Authorization: storedToken },
        });
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
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

  const previewFavorites = favorites.slice(0, 6);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.title}>Create, Share, and Inspire with ART-GEN!</Text>
          <Text style={styles.description}>
            Enter a creative prompt and watch as AI transforms it into a unique piece of art. Share your work with others and build your gallery!
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter prompt"
            value={prompt}
            onChangeText={setPrompt}
          />
          <TouchableOpacity style={styles.button} onPress={generateImage} disabled={loading}>
            <Text style={styles.buttonText}>Generate Image</Text>
          </TouchableOpacity>

          {loading && <Text>Loading...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}

          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}

          {previewFavorites.length > 0 && (
            <View style={styles.previewContainer}>
              <Text style={styles.favoritesTitle}>Favorite Images</Text>
              <View style={styles.previewGrid}>
                {previewFavorites.map((favorite, index) => (
                  <Image key={index} source={{ uri: favorite }} style={styles.previewImage} />
                ))}
              </View>
              <TouchableOpacity style={styles.favoritesButton} onPress={() => navigation.navigate('FavoritesScreen')}>
                <Text style={styles.buttonText}>See All Favorites</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}