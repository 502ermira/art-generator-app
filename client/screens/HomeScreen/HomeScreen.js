import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import { styles } from './HomeScreenStyles.js';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const { token } = useContext(UserContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://192.168.1.145:5000/api/posts/relevant', {
        headers: {
          Authorization: token,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image source={{ uri: item.image.image }} style={styles.image} />
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.userInfoContainer}>
              <Image source={{ uri: item.user.profilePicture }} style={styles.profileImage} />
              <View>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.date}>{new Date(item.sharedAt).toLocaleDateString()}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};