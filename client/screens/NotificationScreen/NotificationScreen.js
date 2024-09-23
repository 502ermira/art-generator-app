import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Animated, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './NotificationScreenStyles.js';
import io from 'socket.io-client';

export default function NotificationScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigation = useNavigation();
  const socket = useRef(null);
  const popupAnimation = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    socket.current = io('http://192.168.1.145:5000');
    socket.current.emit('joinRoom', loggedInUsername);

    const handleNewNotification = (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      showPopup(
        notification.message,
        notification.fromUser?.username,
        notification.fromUser?.profilePicture,
        notification.post?.image?.image
      );
    };

    socket.current.on('newNotification', handleNewNotification);

    return () => {
      socket.current.off('newNotification', handleNewNotification);
      socket.current.disconnect();
    };
  }, [loggedInUsername]);

  const showPopup = (message, fromUser, profilePicture, postImage) => {
    setPopupMessage({ message, fromUser, profilePicture, postImage });
    setPopupVisible(true);

    Animated.timing(popupAnimation, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      hidePopup();
    }, 5000);
  };

  const hidePopup = () => {
    Animated.timing(popupAnimation, {
      toValue: -100,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => {
      setPopupVisible(false);
      setPopupMessage(null);
    });
  };

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
    <View>
      {popupVisible && popupMessage && (
        <Animated.View style={[styles.popup, { transform: [{ translateY: popupAnimation }] }]}>
          <View style={styles.popupContainer}>
            <View style={styles.popupUserInfo}>
              <Image 
                source={{ uri: popupMessage.profilePicture }}
                style={styles.popupProfileImage}
              />
              <Text style={styles.popupMessage}>
                {popupMessage.message}
              </Text>
            </View>
            {popupMessage.postImage && (
              <Image
                source={{ uri: popupMessage.postImage }}
                style={styles.popupPostImage}
              />
            )}
          </View>
        </Animated.View>
      )}

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
                <TouchableOpacity onPress={() => handleUserPress(notification.fromUser?.username)}>
                  <Image
                    source={{ uri: notification.fromUser?.profilePicture }}
                    style={styles.profilePicture}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.notificationTextContainer}>
                <View style={styles.usernameAndTextContainer}>
                  {notification.fromUser?.username ? (
                    <TouchableOpacity onPress={() => handleUserPress(notification.fromUser.username)}>
                      <Text style={styles.usernameText}>{notification.fromUser.username}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.usernameText}>Unknown User</Text>
                  )}
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
    </View>
  );
}