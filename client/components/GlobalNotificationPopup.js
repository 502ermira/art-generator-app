import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Animated, Text, Image } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { styles } from './GlobalNotificationPopupStyles.js';
import io from 'socket.io-client';

export default function GlobalNotificationPopup() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const popupAnimation = useRef(new Animated.Value(-100)).current;
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://192.168.1.145:5000');
    socket.current.emit('joinRoom', loggedInUsername);

    const handleNewNotification = (notification) => {
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
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      hidePopup();
    }, 5000);
  };

  const hidePopup = () => {
    Animated.timing(popupAnimation, {
      toValue: -100,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setPopupVisible(false);
      setPopupMessage(null);
    });
  };

  if (!popupVisible || !popupMessage) return null;

  return (
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
  );
}