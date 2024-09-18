import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from '../FollowersScreen/FollowersScreenStyles';
import { UserContext } from '../../contexts/UserContext';

export default function LikesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { username: loggedInUsername, token } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [likers, setLikers] = useState([]);

  useEffect(() => {
    console.log('postId:', postId);
    
    const fetchLikers = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/likes`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();

        if (response.ok && data.likers) {
          setLikers(data.likers);
        } else {
          console.error('Invalid response format: ', data);
          setLikers([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching likers:', error);
        setLikers([]);
        setLoading(false);
      }
    };

    fetchLikers();
  }, [postId, token]);

  const handleUserPress = (user) => {
    if (user.username === loggedInUsername) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { username: user.username });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {likers && likers.length > 0 ? (
          likers.map((user) => (
            <View key={user.username} style={styles.userItemContainer}>
              <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(user)}>
                <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
                <View style={styles.userInfo}>
                  <Text style={styles.fullname}>{user.fullname}</Text>
                  <Text style={styles.username}>@{user.username}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No likes yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
