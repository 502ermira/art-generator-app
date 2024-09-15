import { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import { styles } from './UserProfileScreenStyles';

export default function UserProfileScreen() {
  const { token } = useContext(UserContext);
  const route = useRoute();
  const { username } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/user/${username}`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.fullname}>{profileData.fullname}</Text>
            <Text style={styles.username}>@{profileData.username}</Text>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Posts</Text>
          {profileData.posts.length > 0 ? (
            <View style={styles.previewGrid}>
              {profileData.posts.map((post, index) => (
                <Image key={index} source={{ uri: post }} style={styles.previewImage} />
              ))}
            </View>
          ) : (
            <Text>No posts available</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}