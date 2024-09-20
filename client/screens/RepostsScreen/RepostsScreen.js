import { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import { styles } from './RepostsScreenStyles';
import CustomHeader from '@/components/CustomHeader';

export default function RepostsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [reposts, setReposts] = useState([]);

  useEffect(() => {
    const fetchReposts = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/reposts`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          setReposts(data);
        } else {
          console.error('Failed to fetch reposts:', data.error);
        }
      } catch (error) {
        console.error('Error fetching reposts:', error);
      }
    };

    fetchReposts();
  }, [postId, token]);

  const handleUserPress = (user) => {
    if (user.username === loggedInUsername) {
      navigation.push('Profile');
    } else {
      navigation.push('UserProfile', { username: user.username });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Reposts" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reposts.length > 0 ? (
          reposts.map((repost) => (
            <TouchableOpacity key={repost._id} style={styles.repost} onPress={() => handleUserPress(repost.user)}>
                <Image source={{ uri: repost.user.profilePicture }} style={styles.profileImage} />
                <View style={styles.repostInfo}>
                  <Text style={styles.username}>{repost.user.fullname} (@{repost.user.username})</Text>
                  <Text style={styles.repostedAt}>Reposted on {new Date(repost.repostedAt).toLocaleTimeString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No reposts yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
