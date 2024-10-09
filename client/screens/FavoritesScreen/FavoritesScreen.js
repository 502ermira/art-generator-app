import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import styles from './FavoritesScreenStyles';
import CustomHeader from '../../components/CustomHeader';

export default function FavoritesScreen() {
  const { token, isLoggedIn } = useContext(UserContext);
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      if (token) {
        const response = await fetch('http://192.168.1.145:5000/auth/favorites', {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setFavorites(data.favorites || []);
        console.log('Fetched favorites from backend:', data.favorites);
      } else {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
          console.log('Loaded favorites from AsyncStorage:', parsedFavorites);
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

  const openInputModal = (image) => {
    navigation.navigate('PostImageScreen', { 
      selectedImage: image.image, 
      imagePrompt: image.prompt 
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Favorites" />
      <ScrollView style={[styles.scrollView, { paddingTop: 60 }]}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Favorite Images</Text>
          {favorites.length > 0 ? (
            favorites.map((favorite, index) => (
              <View key={index}>
                <TouchableOpacity onPress={() => openModal(favorite)}>
                  <Image
                    source={{ uri: typeof favorite === 'string' ? favorite : favorite.image }}
                    style={styles.favoriteImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openInputModal(favorite)} style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No favorites yet.</Text>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}> ☓ </Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image 
            source={{ uri: selectedImage.image }} 
            style={styles.fullscreenImage} />
          )}
        </View>
      </Modal>
    </View>
  );
};