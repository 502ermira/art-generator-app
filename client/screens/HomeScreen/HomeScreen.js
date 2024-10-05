import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { styles } from './HomeScreenStyles.js';
import Loader from '@/components/Loader';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(1);
  const { token, username } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (page) => {
    if (!hasMorePosts && page > 1) return;
    try {
      if (page === 1) setIsLoading(true);
      const response = await axios.get(`http://192.168.1.145:5000/api/posts/relevant?page=${page}&limit=20`, {
        headers: {
          Authorization: token,
        },
      });
      
      const newPosts = response.data;
      if (newPosts.length < 10) setHasMorePosts(false);
      
      setPosts(prevPosts => (page === 1 ? newPosts : [...prevPosts, ...newPosts]));
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchPosts(1);
    setRefreshing(false);
    setHasMorePosts(true);
  };

  const loadMorePosts = async () => {
    if (!loadingMore && hasMorePosts) {
      setLoadingMore(true);
      await fetchPosts(page);
      setLoadingMore(false);
    }
  };

  const handleLike = async (postId, isLikedByUser) => {
    try {
      const response = await axios.post(
        `http://192.168.1.145:5000/auth/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: token }
        }
      );
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLikedByUser: !isLikedByUser,
                likes: isLikedByUser ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleRepost = async (postId, isRepostedByUser) => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/repost`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  reposts: isRepostedByUser ? post.reposts - 1 : post.reposts + 1,
                  isRepostedByUser: !isRepostedByUser,
                }
              : post
          )
        );
      } else {
        console.error('Failed to repost:', data.error);
      }
    } catch (error) {
      console.error('Error handling repost:', error);
    }
  };

  const handleCommentsPress = (postId) => {
    navigation.push('CommentsScreen', { postId });
  };

  const handleLikesPress = (postId) => {
    navigation.push('LikesScreen', { postId });
  };

  const handleRepostsPress = (postId) => {
    navigation.push('RepostsScreen', { postId });
  };

  const handleUserPress = (user) => {
    if (user.username === username) {
      navigation.push('Profile');
    } else {
      navigation.push('UserProfile', { username: user.username });
    }
  };

  const RenderPromptWithReadMore = ({ text }) => {
    const [showFullPrompt, setShowFullPrompt] = useState(false);

    return (
      <View>
        <Text
          style={styles.prompt}
          numberOfLines={showFullPrompt ? undefined : 1} 
        > {text}
        </Text>
        {text.length > 100 && (
          <TouchableOpacity onPress={() => setShowFullPrompt(!showFullPrompt)}>
            <Text style={styles.readMoreText}>
              {showFullPrompt ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const RenderDescriptionWithReadMore = ({ text }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    return (
      <View>
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : 2} 
        >
          {text}
        </Text>
        {text.length > 150 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMoreText}>
              {showFullDescription ? 'Show Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader/>
      ) : (
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <RenderPromptWithReadMore text={item.image.prompt} />
            <Image source={{ uri: item.image.image }} style={styles.image} />
            <RenderDescriptionWithReadMore text={item.description} />
            <View style={styles.userInfoAndEngagement}>
              <View style={styles.userInfoContainer}>
                <TouchableOpacity onPress={() => handleUserPress(item.user)}>
                  <Image source={{ uri: item.user.profilePicture }} style={styles.profileImage} />
                </TouchableOpacity>
                <View>
                  <TouchableOpacity onPress={() => handleUserPress(item.user)}>
                    <Text style={styles.username}>{item.user.username}</Text>
                  </TouchableOpacity>
                  <Text style={styles.date}>{new Date(item.sharedAt).toLocaleDateString()}</Text>
                </View>
              </View>

              <View style={styles.engagementContainer}>
                <TouchableOpacity onPress={() => handleLikesPress(item._id)}>
                  <Text style={styles.likes}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLike(item._id, item.isLikedByUser)}>
                  <Icon
                    name={item.isLikedByUser ? 'heart' : 'heart-o'}
                    style={styles.icon}
                    size={21}
                    color={item.isLikedByUser ? '#7049f6' : 'black'}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCommentsPress(item._id)}>
                  <Text style={styles.comments}>{item.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCommentsPress(item._id)}>
                  <Icon name="comment-o" style={styles.commentIcon} size={21} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRepostsPress(item._id)}>
                  <Text style={styles.reposts}>{item.reposts}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRepost(item._id, item.isRepostedByUser)}>
                  <AntDesign
                    name="retweet"
                    style={styles.repostIcon}
                    size={21}
                    color={item.isRepostedByUser ? '#7049f6' : 'black'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
        showsVerticalScrollIndicator={false}              
      />
      )}
    </View>
  );
}