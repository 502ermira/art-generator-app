import React, { useState, useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import styles from './SearchScreenStyles';

export default function SearchScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState('images');
  const navigation = useNavigation();
  const layout = Dimensions.get('window');

  const handleSearch = async (type) => {
    if (searchQuery.trim() === '') return;

    setIsLoading(true);
    setSearchType(type);

    try {
      let response;
      if (type === 'images') {
        response = await fetch(`http://192.168.1.145:5000/api/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ query: searchQuery }),
        });
      } else {
        response = await fetch(`http://192.168.1.145:5000/auth/search-users?searchQuery=${searchQuery}`, {
          headers: { Authorization: token },
        });
      }

      const data = await response.json();
      setSearchResults(type === 'images' ? data.results || [] : data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultPress = (item) => {
    if (searchType === 'images') {
      navigation.navigate('PostScreen', { postId: item.postId });
    } else {
      if (item.username === loggedInUsername) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('UserProfile', { username: item.username });
      }
    }
  };

  const renderSearchResults = (type) => {
    const filteredResults = searchResults.filter(item => {
      return type === 'images' ? item.image : item.username;
    });

    return (
      <FlatList
        data={filteredResults}
        keyExtractor={(item) => (type === 'images' ? item.id : item.username)}
        numColumns={type === 'images' ? 2 : 1}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultContainer}
            onPress={() => handleResultPress(item)}
          >
            {type === 'images' ? (
              <Image source={{ uri: item.image }} style={styles.photoImage} />
            ) : (
              <View style={styles.userResult}>
                <Image source={{ uri: item.profilePicture }} style={styles.profileImage} />
                <View style={styles.textContainer}>
                  <Text style={styles.fullname}>{item.fullname}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    );
  };

  const renderScene = SceneMap({
    images: () => renderSearchResults('images'),
    users: () => renderSearchResults('users'),
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'images', title: 'Images' },
    { key: 'users', title: 'Users' },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.tabIndicator}
      labelStyle={styles.tabLabel}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => {
            handleSearch(index === 0 ? 'images' : 'users');
          }}
          returnKeyType="search"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : searchResults.length > 0 ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      ) : (
        <Text style={styles.noResultsText}>No results found</Text>
      )}
    </View>
  );
}
