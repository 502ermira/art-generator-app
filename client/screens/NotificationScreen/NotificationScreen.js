import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from './NotificationScreenStyles.js';

export default function NotificationScreen() {
  const { token } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
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

    fetchNotifications();
  }, [token]);

  const handlePostPress = (postId) => {
    navigation.navigate('PostScreen', { postId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification._id}
          style={styles.notification}
          onPress={() => handlePostPress(notification.post._id)}
        >
          <Text style={styles.notificationText}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{new Date(notification.createdAt).toLocaleString()}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}