import { useState, useContext } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../../contexts/UserContext';
import ExploreScreen from '../ExploreScreen/ExploreScreen';
import styles from './SearchScreenStyles';

export default function SearchScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageResults, setImageResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const layout = Dimensions.get('window');

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    setIsLoading(true);

    try {
      const imageResponse = await fetch(`http://192.168.1.145:5000/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const imageData = await imageResponse.json();
      setImageResults(imageData.results || []);

      const userResponse = await fetch(`http://192.168.1.145:5000/auth/search-users?searchQuery=${searchQuery}`, {
        headers: { Authorization: token },
      });

      const userData = await userResponse.json();
      setUserResults(userData);

    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultPress = (item) => {
    if (index === 0) {
      navigation.navigate('PostScreen', { postId: item.postId });
    } else if (index === 1) {
      if (item.username === loggedInUsername) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('UserProfile', { username: item.username });
      }
    }
  };

  const renderSearchResults = (type) => {
    const results = type === 'images' ? imageResults : userResults;
  
    if (!isLoading && results.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            {type === 'images' ? 'No images found' : 'No users found'}
          </Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={results}
        keyExtractor={(item) => (type === 'images' ? item.id : item.username)}
        numColumns={type === 'images' ? 2 : 1}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultContainer}
            onPress={() => handleResultPress(item)}
          >
            {type === 'images' ? (
              <View style={styles.postContainer}>
                <Image source={{ uri: item.image }} style={styles.photoImage} />
                <View style={styles.userInfoContainer}>
                  <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
                  <Text style={styles.usernamePost}>{item.username}</Text>
                </View>
              </View>
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
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={handleSearch}
        >
          <Icon name="search" size={28} style={styles.searchIconContainer}/>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (imageResults.length > 0 || userResults.length > 0) ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      ) : (
        <ExploreScreen />
      )}
    </View>
  );
}