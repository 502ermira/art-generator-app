import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { UserContext } from '../../contexts/UserContext.js';
import styles from './ProfileScreenStyles';

export default function ProfileScreen({ navigation }) {
  const { token, loading: contextLoading } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contextLoading && token) { 
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://192.168.1.145:5000/auth/profile', {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setUserData(data);
          setPosts(data.posts || []);
        } catch (err) {
          console.error('Error fetching user data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [token, contextLoading]);

  if (contextLoading || loading) {
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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile', { updateUserData: setUserData })}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <Text style={styles.postsTitle}>Your Posts</Text>
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