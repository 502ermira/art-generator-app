import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext.js';
import styles from './ProfileScreenStyles';

export default function ProfileScreen({ navigation }) {
  const { token } = useContext(UserContext);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://192.168.1.145:5000/auth/profile', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setUserData(data);
    };

    fetchUserData();
  }, [token]);

  const updateUserData = (updatedData) => {
    setUserData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
      <Text style={styles.fullname}>{userData.fullname}</Text>
      <Text style={styles.username}>@{userData.username}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile', { updateUserData })}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}