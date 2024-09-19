import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { UserContext } from '../../contexts/UserContext.js';
import CustomHeader from '@/components/CustomHeader.js';
import { styles } from '../UserProfileScreen/UserProfileScreenStyles.js';

export default function ProfileScreen({ navigation }) {
  const { token, username: loggedInUsername, loading: contextLoading } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
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

          const postsResponse = await fetch(`http://192.168.1.145:5000/auth/user/${loggedInUsername}/posts`, {
            headers: { Authorization: token },
          });
          const postsData = await postsResponse.json();

          if (postsResponse.ok) {
            setPosts(postsData);
          } else {
            console.error('Failed to fetch posts:', postsData.error);
          }

          const followResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${loggedInUsername}`);
          const followData = await followResponse.json();
          setFollowerCount(followData.followers.length);
          setFollowingCount(followData.following.length);

        } catch (err) {
          console.error('Error fetching user data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [token, contextLoading, loggedInUsername]);

  const navigateToFollowers = () => {
    navigation.push('Followers', { username: loggedInUsername, type: 'followers' });
  };

  const navigateToFollowing = () => {
    navigation.push('Following', { username: loggedInUsername, type: 'following' });
  };

  if (contextLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <CustomHeader title={loggedInUsername} screenType='ProfileScreen'/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.fullname}>{userData.fullname}</Text>

              <View style={styles.followInfo}>
                <TouchableOpacity onPress={navigateToFollowers}>
                  <Text style={styles.followers}>{followerCount} Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToFollowing}>
                  <Text>{followingCount} Following</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.followButton}
            onPress={() => navigation.navigate('EditProfile', { updateUserData: setUserData })}
          >
            <Text style={styles.followButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.previewContainer}>
            <Text style={styles.sectionTitle}>Your Posts</Text>

            {posts.length > 0 ? (
              <View style={styles.previewGrid}>
                {posts.map((post, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.postContainer} 
                    onPress={() => navigation.navigate('PostScreen', { postId: post._id })}>
                    <Image source={{ uri: post.image.image }} style={styles.previewImage} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text>No posts yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
