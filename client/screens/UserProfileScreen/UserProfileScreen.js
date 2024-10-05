import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { styles } from './UserProfileScreenStyles';
import CustomHeader from '@/components/CustomHeader';
import Loader from '@/components/Loader';

export default function UserProfileScreen() {
  const { token, username: loggedInUsername } = useContext(UserContext);
  const route = useRoute();
  const { username } = route.params;
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'reposts', title: 'Reposts' },
  ]);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth > 600 ? 3 : 2;
  const imageSize = screenWidth / numColumns - 10;

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/user/${username}`, {
        headers: { Authorization: token },
      });
      const data = await response.json();

      if (response.ok) {
        setProfileData(data.user);
        setReposts(data.reposts);

        const followResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${username}`);
        const followData = await followResponse.json();

        setFollowerCount(followData.followers.length);
        setFollowingCount(followData.following.length);

        const isUserFollowing = followData.followers.some(
          (follower) => follower.followerId.username === loggedInUsername
        );
        setIsFollowing(isUserFollowing);
      } else {
        console.error('Failed to fetch profile:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/user/${username}/posts`, {
        headers: { Authorization: token },
      });
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        console.error('Failed to fetch posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [username, token, loggedInUsername]);

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing 
        ? `http://192.168.1.145:5000/auth/unfollow/${username}`
        : `http://192.168.1.145:5000/auth/follow/${username}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: token },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
      } else {
        const data = await response.json();
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const navigateToFollowers = () => {
    navigation.push('Followers', { username, type: 'followers' });
  };

  const navigateToFollowing = () => {
    navigation.push('Following', { username, type: 'following' });
  };

  const PostsRoute = () => (
    <View style={styles.tabContent}>
      {posts.length > 0 ? (
        <View style={styles.previewGrid}>
          {posts
            .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt))
            .map((post, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.postContainer} 
                onPress={() => navigation.navigate('PostScreen', { postId: post._id })}
              >
                <Image source={{ uri: post.image.image }} style={[styles.postContainer, { width: imageSize, height: imageSize }]}  />
              </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noPostsText}>No posts available</Text>
      )}
    </View>
  );

  const RepostsRoute = () => (
    <View style={styles.tabContent}>
      {reposts.length > 0 ? (
        <View style={styles.previewGrid}>
          {reposts
            .sort((a, b) => new Date(b.repostedAt) - new Date(a.repostedAt))
            .map((repost, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.postContainer, { width: imageSize, height: imageSize }]} 
                onPress={() => navigation.navigate('PostScreen', { postId: repost.post._id, repostedBy: username ,repostedAt: repost.repostedAt })} 
              >
                <Image source={{ uri: repost.post.image.image }} style={styles.previewImage} />
              </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noPostsText}>No reposts available</Text>
      )}
    </View>
  );

  const renderScene = SceneMap({
    posts: PostsRoute,
    reposts: RepostsRoute,
  });

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <CustomHeader title={username} screenType="UserProfileScreen" />
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: profileData.profilePicture }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.fullname}>{profileData.fullname}</Text>
            <View style={styles.followInfo}>
              <TouchableOpacity onPress={navigateToFollowers}>
                <Text style={styles.followers}>{followerCount} Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToFollowing}>
                <Text style={styles.following}>{followingCount} Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.bio}>{profileData.bio}</Text>

        <TouchableOpacity 
          style={styles.followButton} 
          onPress={handleFollowToggle}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#7049f6', marginBottom:1.5 }}
              style={styles.tabBar}
              labelStyle={{ color: 'black', fontWeight: '400', fontSize: 13 }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
}