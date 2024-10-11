import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, Modal, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../contexts/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import styles from './FavoritesScreenStyles';
import CustomHeader from '../../components/CustomHeader';
import Loader from '@/components/Loader';

export default function FavoritesScreen() {
  const { token, isLoggedIn } = useContext(UserContext);
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { height } = Dimensions.get('window');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        if (token) {
          const response = await fetch('http://192.168.1.145:5000/auth/favorites', {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setFavorites(data.favorites || []);
        } else {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            const parsedFavorites = JSON.parse(storedFavorites);
            setFavorites(parsedFavorites);
          } else {
            setFavorites([]);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isLoggedIn]);

  const unfavoriteImage = async (image) => {
    try {
      if (token) {
        const response = await fetch('http://192.168.1.145:5000/auth/unfavorite', {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: image.image }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Failed to unfavorite');
        }
  
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite.image !== image.image)
        );
        alert('Image unfavorited');
      } else {
        const updatedFavorites = favorites.filter((favorite) => favorite.image !== image.image);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        alert('Image unfavorited locally');
      }
    } catch (error) {
      console.error('Error unfavoriting image:', error);
      alert('Error unfavoriting image: ' + error.message);
    }
  };  

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
      imagePrompt: image.prompt, 
      embedding: image.embedding,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Favorites" />
      <ScrollView style={[styles.scrollView, { paddingTop: 60 }]}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Favorite Images</Text>
          {loading ? (
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: height/2 + 120 }}>
            <Loader />
           </View>
          ) : (
            favorites.length > 0 ? (
              favorites.slice().reverse().map((favorite, index) => (
                <View key={index} style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => openModal(favorite)}>
                    <Image
                      source={{ uri: typeof favorite === 'string' ? favorite : favorite.image }}
                      style={styles.favoriteImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => unfavoriteImage(favorite)} style={styles.unfavoriteButton}>
                    <FontAwesome name="star" size={35} color="#978af8" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openInputModal(favorite)} style={styles.shareButton}>
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noFavorites}>No favorites yet.</Text>
            )
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