import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, RefreshControl, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './NotificationScreenStyles.js';
import io from 'socket.io-client';

export default function NotificationScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const navigation = useNavigation();
  const socket = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    socket.current = io('http://192.168.1.145:5000');
    socket.current.emit('joinRoom', loggedInUsername);
  
    const handleNewNotification = (notification) => {
      setNotifications((prevNotifications) => {
        const isDuplicate = prevNotifications.some(
          (existingNotification) =>
            existingNotification.fromUser?._id === notification.fromUser?._id &&
            existingNotification.type === notification.type &&
            (notification.type === 'like' || notification.type === 'repost' || notification.type === 'follow')
        );
  
        const filteredNotifications = prevNotifications.filter(
          (existingNotification) =>
            !(
              existingNotification.fromUser?._id === notification.fromUser?._id &&
              existingNotification.type === notification.type &&
              (notification.type === 'like' || notification.type === 'repost' || notification.type === 'follow')
            )
        );
  
        return [notification, ...filteredNotifications];
      });
    };
  
    socket.current.on('newNotification', handleNewNotification);
  
    return () => {
      socket.current.disconnect();
    };
  }, [loggedInUsername]);  

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

  useEffect(() => {
    fetchNotifications();
    fetchFollowingStatus();
  }, [token, loggedInUsername]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    await fetchFollowingStatus();
    setRefreshing(false);
  };

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
    <View>
      <ScrollView contentContainerStyle={styles.container}
       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
                <TouchableOpacity onPress={() => handleUserPress(notification.fromUser?.username)}>
                  <Image
                    source={{ uri: notification.fromUser?.profilePicture }}
                    style={styles.profilePicture}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.notificationTextContainer}>
                <View style={styles.usernameAndTextContainer}>
                  <Text style={styles.notificationText}>
                  {notification.fromUser?.username ? (
                    <TouchableOpacity onPress={() => handleUserPress(notification.fromUser.username)}>
                      <Text style={styles.usernameText}>{notification.fromUser.username}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.usernameText}>Unknown User</Text>
                  )}
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
    </View>
  );
}