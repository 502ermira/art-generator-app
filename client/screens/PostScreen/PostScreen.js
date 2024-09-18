import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './PostScreenStyles.js';
import { UserContext } from '../../contexts/UserContext';

export default function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { token } = useContext(UserContext);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          setPostData(data);
        } else {
          console.error('Failed to fetch post:', data.error);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, token]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPostData((prev) => ({
          ...prev,
          isLikedByUser: !prev.isLikedByUser,
          likes: prev.isLikedByUser ? prev.likes - 1 : prev.likes + 1,
        }));
      } else {
        console.error('Failed to like post:', data.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLikesPress = () => {
    navigation.navigate('LikesScreen', { postId: postData._id });
  };  


  if (!postData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load post data</Text>
      </View>
    );
  }

  const formattedDate = new Date(postData.sharedAt).toLocaleDateString();
  const formattedTime = new Date(postData.sharedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: postData.user.profilePicture }} style={styles.profileImage} />
        <View style={styles.userDetails}>
          <Text style={styles.fullname}>{postData.user.fullname}</Text>
          <Text style={styles.username}>@{postData.user.username}</Text>
        </View>
      </View>

      <Image source={{ uri: postData.image.image }} style={styles.postImage} />
      <View style={styles.likesContainer}>

      <TouchableOpacity onPress={handleLikesPress}>
  <Text>{postData.likes} {postData.likes === 1 ? 'Like' : 'Likes'}</Text>
</TouchableOpacity>
        <TouchableOpacity 
          style={postData.isLikedByUser ? styles.unlikeButton : styles.likeButton} 
          onPress={() => handleLike(postId)}
        >
          <Text style={styles.buttonText}>{postData.isLikedByUser ? 'Unlike' : 'Like'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.prompt}>Prompt: {postData.image.prompt || 'No prompt available'}</Text>
      <Text style={styles.description}>{postData.description || 'No description available'}</Text>
      <Text style={styles.date}>Posted on {formattedDate} at {formattedTime}</Text>
    </ScrollView>
  );
}