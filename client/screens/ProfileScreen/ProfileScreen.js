import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { UserContext } from '../../contexts/UserContext.js';
import CustomHeader from '@/components/CustomHeader.js';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Loader from '@/components/Loader.js';
import { styles } from '../UserProfileScreen/UserProfileScreenStyles.js';

export default function ProfileScreen({ navigation }) {
  const { token, username: loggedInUsername, loading: contextLoading } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'reposts', title: 'Reposts' },
    { key: 'likes', title: 'Likes' },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth > 600 ? 3 : 2;
  const imageSize = screenWidth / numColumns - 10;

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/profile', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setUserData(data);
    
      const postsResponse = await fetch(`http://192.168.1.145:5000/auth/user/${loggedInUsername}/posts`, {
        headers: { Authorization: token },
      });
      const postsData = await postsResponse.json();

      if (postsResponse.ok) {
        setPosts(postsData);
      } else {
        console.error('Failed to fetch posts:', postsData.error);
      }

      const repostsResponse = await fetch(`http://192.168.1.145:5000/auth/user/${loggedInUsername}/reposts`, {
        headers: { Authorization: token },
      });
      const repostsData = await repostsResponse.json();

      if (repostsResponse.ok) {
        setReposts(repostsData);
      } else {
        console.error('Failed to fetch reposts:', repostsData.error);
      }

      const likesResponse = await fetch(`http://192.168.1.145:5000/auth/user/${loggedInUsername}/likes`, {
        headers: { Authorization: token },
      });
      const likesData = await likesResponse.json();
      
      if (likesResponse.ok) {
        setLikes(likesData);
      } else {
        console.error('Failed to fetch likes:', likesData.error);
      }          

      const followResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${loggedInUsername}`);
      const followData = await followResponse.json();
      setFollowerCount(followData.followers.length);
      setFollowingCount(followData.following.length);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefreshProfile = () => {
    fetchUserData();
};

  useEffect(() => {
    if (!contextLoading && token) {
      fetchUserData();
    }
  }, [token, contextLoading, loggedInUsername]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchUserData();
  };

  const navigateToFollowers = () => {
    navigation.push('Followers', { username: loggedInUsername, type: 'followers' });
  };

  const navigateToFollowing = () => {
    navigation.push('Following', { username: loggedInUsername, type: 'following' });
  };

  const PostsRoute = () => (
    <View style={styles.tabContent}>
      {posts.length > 0 ? (
        <View style={[styles.previewGrid, { width: screenWidth }]}>
          {posts
            .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt))
            .map((post, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.postContainer, { width: imageSize, height: imageSize }]} 
                onPress={() => navigation.navigate('PostScreen', { postId: post._id , onRefreshProfile: handleRefreshProfile, })}
              >
                <Image source={{ uri: post.image.image }} style={styles.previewImage} />
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
        <View style={[styles.previewGrid, { width: screenWidth }]}>
          {reposts
            .sort((a, b) => new Date(b.repostedAt) - new Date(a.repostedAt))
            .map((repost, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.postContainer, { width: imageSize, height: imageSize }]} 
                onPress={() => navigation.navigate('PostScreen', { postId: repost.post._id, repostedBy: loggedInUsername ,repostedAt: repost.repostedAt })} 
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

  const LikesRoute = () => (
    <View style={styles.tabContent}>
      {likes.length > 0 ? (
        <View style={[styles.previewGrid, { width: screenWidth }]}>
          {likes
            .map((like, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.postContainer, { width: imageSize, height: imageSize }]} 
                onPress={() => navigation.navigate('PostScreen', { postId: like.post._id })}
              >
                <Image source={{ uri: like.post.image.image }} style={styles.previewImage} />
              </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noPostsText}>No liked posts available</Text>
      )}
    </View>
  );  

  const renderScene = SceneMap({
    posts: PostsRoute,
    reposts: RepostsRoute,
    likes: LikesRoute,
  });

  if (contextLoading || loading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <CustomHeader title={loggedInUsername} screenType="ProfileScreen" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        style={{ backgroundColor: '#fafafa' }}
        refreshControl={
          <RefreshControl
           refreshing={isRefreshing} 
           onRefresh={onRefresh}
           tintColor="#7049f6"
           colors={['#7049f6', '#ff6347', '#32cd32']}
           progressBackgroundColor="#fafafa"
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: userData.profilePicture }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.fullname}>{userData.fullname}</Text>

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
          <Text style={styles.bio}>{userData.bio}</Text>

          <TouchableOpacity
            style={styles.followButton}
            onPress={() => navigation.navigate('EditProfile', { updateUserData: setUserData, onRefreshProfile: handleRefreshProfile })}
          >
            <Text style={styles.followButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: screenWidth }}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#7049f6', marginBottom: 1.5 }}
                style={styles.tabBar}
                labelStyle={{ color: 'black' ,fontWeight: '400', fontSize: 13 }}
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}