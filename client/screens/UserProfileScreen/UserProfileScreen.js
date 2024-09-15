import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './UserProfileScreenStyles.js';

export default function UserProfileScreen({ route }) {
  const { username } = route.params;
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/profile?username=${username}`);
        const data = await response.json();
        setUserData(data);
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
        <Text style={styles.fullname}>{userData.fullname}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
        <Text style={styles.postsTitle}>{`${userData.username}'s Posts`}</Text>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Image key={index} source={{ uri: post }} style={styles.postImage} />
          ))
        ) : (
          <Text>No posts yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}
