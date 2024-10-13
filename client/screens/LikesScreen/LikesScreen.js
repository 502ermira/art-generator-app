import { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getFollowersScreenStyles } from '../FollowersScreen/FollowersScreenStyles';
import CustomHeader from '@/components/CustomHeader';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Loader from '@/components/Loader';

export default function LikesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { username: loggedInUsername, token } = useContext(UserContext);
  const { currentTheme } = useContext(ThemeContext);
  const styles = getFollowersScreenStyles(currentTheme);
  const [loading, setLoading] = useState(true);
  const [likers, setLikers] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLikers = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/likes`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await response.json();

        if (response.ok && data.likers) {
          setLikers(data.likers);

          const statusResponse = await fetch(`http://192.168.1.145:5000/auth/followers-following/${loggedInUsername}`);
          const statusData = await statusResponse.json();
          
          const status = {};
          statusData.following.forEach(user => {
            status[user.followingId.username] = true;
          });
          statusData.followers.forEach(user => {
            if (!status[user.followerId.username]) {
              status[user.followerId.username] = false;
            }
          });
          setFollowingStatus(status);

        } else {
          console.error('Invalid response format: ', data);
          setLikers([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching likers:', error);
        setLikers([]);
        setLoading(false);
      }
    };

    fetchLikers();
  }, [postId, token, loggedInUsername]);

  const handleFollowToggle = async (user) => {
    const isFollowing = followingStatus[user.username];
    const url = isFollowing 
      ? `http://192.168.1.145:5000/auth/unfollow/${user.username}` 
      : `http://192.168.1.145:5000/auth/follow/${user.username}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setFollowingStatus((prevStatus) => ({
          ...prevStatus,
          [user.username]: !isFollowing,
        }));
      } else {
        console.error('Error toggling follow status');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };  

  const handleUserPress = (user) => {
    if (user.username === loggedInUsername) {
      navigation.push('Profile');
    } else {
      navigation.push('UserProfile', { username: user.username });
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  const filteredLikers = likers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = (user) => (
    <View key={user.username} style={styles.userItemContainer}>
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(user)}>
        <Image source={{ uri: user.profilePicture }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.fullname}>{user.fullname}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </TouchableOpacity>

      {user.username !== loggedInUsername && (
        <TouchableOpacity
          style={[styles.followButton, followingStatus[user.username] ? styles.following : styles.notFollowing]}
          onPress={() => handleFollowToggle(user)}
        >
          <Text style={styles.followButtonText}>
            {followingStatus[user.username] ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Likes" />
      <TextInput
        style={styles.searchBar}
        placeholder="Search Likers"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor='#aaa'
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredLikers.length > 0 ? (
          filteredLikers.map((user) => renderUserItem(user))
        ) : (
          <Text style={styles.emptyText}>No likes yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
