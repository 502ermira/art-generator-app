import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './SearchScreenStyles';

export default function SearchScreen() {
  const { token } = useContext(UserContext);
  const [imageQuery, setImageQuery] = useState('');
  const [imageResults, setImageResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (imageQuery.trim() === '') {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://192.168.1.145:5000/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ query: imageQuery }),
      });

      const data = await response.json();
      setImageResults(data.results || []);
    } catch (error) {
      console.error('Error searching photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for images..."
        value={imageQuery}
        onChangeText={setImageQuery}
      />

      <TouchableOpacity title="Search" onPress={handleSearch} style={styles.button} >
        <Icon name="search" style={styles.navIcon} />
      </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : imageResults.length > 0 ? (
        <FlatList
          data={imageResults}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.photoImage} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No images found</Text>
      )}
    </ScrollView>
  );
}
