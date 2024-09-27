import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import { styles } from './ExploreScreenStyles.js';

export default function ExploreScreen({ route }) {
  const { token } = useContext(UserContext);
  const [explorePosts, setExplorePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fetchExplorePosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://192.168.1.145:5000/api/posts/explore`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setExplorePosts(data || []);
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const handlePostPress = (postId) => {
    navigation.navigate('PostScreen', { postId });
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postContainer} onPress={() => handlePostPress(item._id)}>
      <Image source={{ uri: item.image.image }} style={styles.postImage} />
      <View style={styles.textContainer}>
      <Image source={{ uri: item.user.profilePicture }} style={styles.profileImage} />
        <Text style={styles.username}>{item.user.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Explore Page</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={explorePosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          numColumns={2}
        />
      )}
    </View>
  );
}