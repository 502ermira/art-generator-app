import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import styles from './SearchScreenStyles';

export default function SearchScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const searchUsers = async () => {
        try {
          const response = await fetch(`http://192.168.1.145:5000/auth/search-users?searchQuery=${searchQuery}`, {
            headers: { Authorization: token },
          });
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUserPress = (user) => {
    if (user.username === loggedInUsername) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { username: user.username });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item)}>
              <View style={styles.searchResult}>
                <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.fullname}>{item.fullname}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No users found</Text>
      )}
    </View>
  );
}