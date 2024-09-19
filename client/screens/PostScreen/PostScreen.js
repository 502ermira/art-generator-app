import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './PostScreenStyles.js';
import { UserContext } from '../../contexts/UserContext';

export default function PostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { token } = useContext(UserContext);
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}`, {
          headers: { Authorization: token },
        });
        const data = await response.json();

        if (response.ok) {
          setPostData(data);
        } else {
          console.error('Failed to fetch post:', data.error);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

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
      }
    };

    fetchPostData();
    fetchComments();
  }, [postId, token]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setPostData((prev) => ({
          ...prev,
          isLikedByUser: !prev.isLikedByUser,
          likes: prev.isLikedByUser ? prev.likes - 1 : prev.likes + 1,
        }));
      } else {
        console.error('Failed to like post:', data.error);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async () => {
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

  const handleCommentsPress = () => {
    navigation.navigate('CommentsScreen', { postId: postData._id });
  };  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLikesPress = () => {
    navigation.navigate('LikesScreen', { postId: postData._id });
  };

  const formattedDate = new Date(postData.sharedAt).toLocaleDateString();
  const formattedTime = new Date(postData.sharedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: postData.user.profilePicture }} style={styles.profileImage} />
        <View style={styles.userDetails}>
          <Text style={styles.fullname}>{postData.user.fullname}</Text>
          <Text style={styles.username}>@{postData.user.username}</Text>
        </View>
      </View>

      <Image source={{ uri: postData.image.image }} style={styles.postImage} />
      
      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={handleLikesPress}>
          <Text>{postData.likes} {postData.likes === 1 ? 'Like' : 'Likes'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={postData.isLikedByUser ? styles.unlikeButton : styles.likeButton} 
          onPress={() => handleLike(postId)}
        >
          {postData.isLikedByUser ? (
            <Icon name="heart" style={styles.likeIcon} size={25} color="red" />
          ) : (
            <Icon name="heart-o" style={styles.likeIcon} size={25} color="red" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCommentsPress} style={styles.commentButton}>
          <Text>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</Text>
          <Icon name="comment-o" style={styles.commentIcon} size={25} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.prompt}>Prompt: {postData.image.prompt || 'No prompt available'}</Text>
      <Text style={styles.description}>{postData.description || 'No description available'}</Text>
      <Text style={styles.date}>Posted on {formattedDate} at {formattedTime}</Text>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments</Text>
        {comments.map((comment) => (
          <View key={comment._id} style={styles.comment}>
            <Image source={{ uri: comment.user.profilePicture }} style={styles.profileImageComment} />
            <Text style={styles.commentUser}>{comment.user.fullname}: {comment.content}</Text>
          </View>
        ))}
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Leave a comment"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.commentSubmitButton} onPress={handleAddComment}>
        <Icon name="paper-plane" style={styles.submitIcon} size={27} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}