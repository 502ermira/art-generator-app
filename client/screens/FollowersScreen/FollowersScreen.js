import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './FollowersScreenStyles';
import { UserContext } from '../../contexts/UserContext';
import CustomHeader from '@/components/CustomHeader';

export default function FollowersFollowingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username: loggedInUsername } = useContext(UserContext);
  const { username, type } = route.params;
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/followers-following/${username}`);
        const data = await response.json();
        setFollowers(data.followers);
        setFollowing(data.following);

        const status = {};
        data.following.forEach(user => {
          status[user.followingId.username] = true;
        });
        data.followers.forEach(user => {
          if (!status[user.followerId.username]) {
            status[user.followerId.username] = false;
          }
        });
        setFollowingStatus(status);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching followers and following:', error);
        setLoading(false);
      }
    };

    fetchFollowersAndFollowing();
  }, [username]);

  const handleFollowToggle = async (user) => {
    const isFollowing = followingStatus[user.username];
    const url = isFollowing 
      ? `http://192.168.1.145:5000/auth/unfollow/${user.username}` 
      : `http://192.168.1.145:5000/auth/follow/${user.username}`;

    try {
      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
        setFollowingStatus((prevStatus) => ({
          ...prevStatus,
          [user.username]: !isFollowing,
        }));
      } else {
        console.error('Error toggling follow status');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleUserPress = (user) => {
    if (user.username === loggedInUsername) {
      navigation.push('Profile');
    } else {
      navigation.push('UserProfile', { username: user.username });
    }
  };

  const getHeaderTitle = () => {
    const possessiveUsername = username.endsWith('s') ? `${username}'` : `${username}'s`;
    return `${possessiveUsername} ${type === 'followers' ? 'Followers' : 'Following'}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderUserItem = (user, isFollowing) => (
    <View key={user.username} style={styles.userItemContainer}>
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(user)}>
        <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.fullname}>{user.fullname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </TouchableOpacity>

      {user.username !== loggedInUsername && (
        <TouchableOpacity
          style={[styles.followButton, isFollowing ? styles.following : styles.notFollowing]}
          onPress={() => handleFollowToggle(user)}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title={getHeaderTitle()} screenType={null}/>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {type === 'followers' ? (
          <>
            <Text style={styles.sectionTitle}>Followers</Text>
            {followers.length > 0 ? (
              followers.map((follower) => renderUserItem(follower.followerId, followingStatus[follower.followerId.username]))
            ) : (
              <Text style={styles.emptyText}>No followers yet</Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Following</Text>
            {following.length > 0 ? (
              following.map((user) => renderUserItem(user.followingId, followingStatus[user.followingId.username]))
            ) : (
              <Text style={styles.emptyText}>Not following anyone</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}