import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import Loader from '@/components/Loader';
import { styles } from './ExploreScreenStyles.js';

export default function ExploreScreen({ route }) {
  const { token } = useContext(UserContext);
  const [explorePosts, setExplorePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const navigation = useNavigation();

  const fetchExplorePosts = async (pageNumber = 1) => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const response = await fetch(`http://192.168.1.145:5000/api/posts/explore?page=${pageNumber}`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();

      if (data.length > 0) {
        setExplorePosts((prevPosts) => [...prevPosts, ...data]);
        setPage(pageNumber + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching explore posts:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchExplorePosts();
  }, []);

  const handlePostPress = (postId) => {
    navigation.push('PostScreen', { postId });
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postContainer} onPress={() => handlePostPress(item._id)}>
      <Image source={{ uri: item.image.image }} style={styles.postImage} />
      <View style={styles.textContainer}>
        <Image source={{ uri: item.user.profilePicture }} style={styles.profileImage} />
        <Text style={styles.username}>{item.user.username}</Text>
      </View>
    </TouchableOpacity>
  );

  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      fetchExplorePosts(page);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Page</Text>
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={explorePosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          numColumns={2}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={styles.loaderContainer}>
                <Loader />
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}