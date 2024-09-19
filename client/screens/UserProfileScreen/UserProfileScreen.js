import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import { styles } from './UserProfileScreenStyles';
import CustomHeader from '@/components/CustomHeader';

export default function UserProfileScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const route = useRoute();
  const { username } = route.params;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/user/${username}`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
  
        if (response.ok) {
          setProfileData(data);
  
          const followResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${username}`);
          const followData = await followResponse.json();
          
          setFollowerCount(followData.followers.length);
          setFollowingCount(followData.following.length);
  
          const isUserFollowing = followData.followers.some(
            (follower) => follower.followerId.username === loggedInUsername
          );
          setIsFollowing(isUserFollowing);
        } else {
          console.error('Failed to fetch profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [username, token, loggedInUsername]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/user/${username}/posts`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        } else {
          console.error('Failed to fetch posts:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [username, token]);

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing 
        ? `http://192.168.1.145:5000/auth/unfollow/${username}`
        : `http://192.168.1.145:5000/auth/follow/${username}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const navigateToFollowers = () => {
    navigation.push('Followers', { username, type: 'followers' });
  };

  const navigateToFollowing = () => {
    navigation.push('Following', { username, type: 'following' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
      <CustomHeader title={`${profileData.username}`} screenType="UserProfileScreen" />
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.fullname}>{profileData.fullname}</Text>
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
          onPress={handleFollowToggle}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
  
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
          <Text>No posts available</Text>
        )}
      </View>
    </ScrollView>
  );
}
