import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../contexts/UserContext';
import styles from './FavoritesScreenStyles';

export default function FavoritesScreen() {
  const { isLoggedIn } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Favorite Images</Text>
        {favorites.length > 0 ? (
          favorites.map((favorite, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(favorite)}>
              <Image source={{ uri: favorite }} style={styles.favoriteImage} />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No favorites yet.</Text>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}> X </Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
