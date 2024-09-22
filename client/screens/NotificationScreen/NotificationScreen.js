import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './NotificationScreenStyles.js';

export default function NotificationScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://192.168.1.145:5000/auth/notifications', {
          headers: { Authorization: token },
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
        } else {
          console.error('Failed to fetch notifications:', data.error);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const fetchFollowingStatus = async () => {
      try {
        const statusResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${loggedInUsername}`, {
          headers: { Authorization: token },
        });
        const statusData = await statusResponse.json();

        const status = {};
        statusData.following.forEach(user => {
          status[user.followingId.username] = true;
        });
        statusData.followers.forEach(user => {
          if (!status[user.followerId.username]) {
            status[user.followerId.username] = false;
          }
        });
        setFollowingStatus(status);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    fetchNotifications();
    fetchFollowingStatus();
  }, [token, loggedInUsername]);

  const handleFollowToggle = async (user) => {
    const isFollowing = followingStatus[user.username];
    const url = isFollowing
      ? `http://192.168.1.145:5000/auth/unfollow/${user.username}`
      : `http://192.168.1.145:5000/auth/follow/${user.username}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

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

  const handlePostPress = (postId) => {
    navigation.navigate('PostScreen', { postId });
  };

  const truncateComment = (content) => {
    const screenWidth = Dimensions.get('window').width;
    const maxCharacters = Math.floor(screenWidth / 10);
    return content.length > maxCharacters ? content.slice(0, maxCharacters) + '...' : content;
  };

  const handleUserPress = (username) => {
    navigation.push('UserProfile', { username });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification._id}
          style={styles.notification}
          onPress={() => {
            if (notification.type !== 'follow') {
              handlePostPress(notification.post._id);
            }
          }}
        >
          <View style={styles.notificationContent}>
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={() => handleUserPress(notification.fromUser.username)}>
                <Image
                  source={{ uri: notification.fromUser.profilePicture }}
                  style={styles.profilePicture}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.notificationTextContainer}>
             <View style={styles.usernameAndTextContainer}>
              <TouchableOpacity onPress={() => handleUserPress(notification.fromUser.username)}>
                <Text style={styles.usernameText}>{notification.fromUser.username}</Text>
              </TouchableOpacity>
              <Text style={styles.notificationText}>
                {notification.type === 'like' && ' liked your post'}
                {notification.type === 'comment' && ` commented on your post: ${truncateComment(notification.comment?.content || '')}`}
                {notification.type === 'mention' && ` mentioned you in a comment: ${truncateComment(notification.comment?.content || '')}`}
                {notification.type === 'repost' && ' reposted your post'}
                {notification.type === 'follow' && ' started following you'}
              </Text>
              </View>
              <Text style={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
            </View>

            {notification.type !== 'follow' && notification.post?.image && (
              <Image
                source={{ uri: notification.post.image.image }}
                style={styles.notificationImage}
              />
            )}

            {notification.type === 'follow' && (
              <TouchableOpacity
                style={[
                  styles.followButton,
                  followingStatus[notification.fromUser.username]
                    ? styles.following
                    : styles.notFollowing,
                ]}
                onPress={() => handleFollowToggle(notification.fromUser)}
              >
                <Text style={styles.followButtonText}>
                  {followingStatus[notification.fromUser.username] ? 'Following' : 'Follow Back'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}