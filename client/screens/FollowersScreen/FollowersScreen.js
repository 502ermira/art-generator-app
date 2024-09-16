import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './FollowersScreenStyles';

export default function FollowersFollowingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, type } = route.params;
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/followers-following/${username}`);
        const data = await response.json();
        setFollowers(data.followers);
        setFollowing(data.following);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching followers and following:', error);
        setLoading(false);
      }
    };

    fetchFollowersAndFollowing();
  }, [username]);

  const handleUserPress = (user) => {
    navigation.navigate('UserProfile', { username: user.username });
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
        {type === 'followers' ? (
          <>
            <Text style={styles.sectionTitle}>Followers</Text>
            {followers.length > 0 ? (
              followers.map((follower, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.userItem}
                  onPress={() => handleUserPress(follower.followerId)}
                >
                  <Image source={{ uri: follower.followerId.profilePicture }} style={styles.userImage} />
                  <View style={styles.userInfo}>
                    <Text style={styles.fullname}>{follower.followerId.fullname}</Text>
                    <Text style={styles.username}>@{follower.followerId.username}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No followers yet</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Following</Text>
            {following.length > 0 ? (
              following.map((user, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.userItem}
                  onPress={() => handleUserPress(user.followingId)}
                >
                  <Image source={{ uri: user.followingId.profilePicture }} style={styles.userImage} />
                  <View style={styles.userInfo}>
                    <Text style={styles.fullname}>{user.followingId.fullname}</Text>
                    <Text style={styles.username}>@{user.followingId.username}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Not following anyone</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
