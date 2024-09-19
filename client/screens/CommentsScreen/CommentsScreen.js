import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './CommentsScreenStyles.js';
import { UserContext } from '../../contexts/UserContext';
import CustomHeader from '../../components/CustomHeader.js';

export default function CommentsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/comments`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          setComments(data);
        } else {
          console.error('Failed to fetch comments:', data.error);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      const data = await response.json();
      if (response.ok) {
        setComments((prev) => [data, ...prev]);
        setNewComment('');
      } else {
        console.error('Failed to add comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUserPress = (username) => {
    if (username === loggedInUsername) {
      navigation.push('Profile');
    } else {
      navigation.push('UserProfile', { username });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading comments...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Comments" />
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: 60 }]}>
        <Text style={styles.commentsTitle}>Comments</Text>
        
        {comments.map((comment) => (
          <View key={comment._id} style={styles.comment}>
            <TouchableOpacity onPress={() => handleUserPress(comment.user.username)}>
              <Image source={{ uri: comment.user.profilePicture }} style={styles.profileImageComment} />
            </TouchableOpacity>
            <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{comment.user.fullname}</Text>
              <Text style={styles.commentContentText}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleTimeString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <Icon name="paper-plane" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}