import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Keyboard, Dimensions, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { styles } from './CommentsScreenStyles.js';
import { UserContext } from '../../contexts/UserContext';
import CustomHeader from '../../components/CustomHeader.js';
import Loader from '@/components/Loader.js';

const { height } = Dimensions.get('window');

export default function CommentsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  const { token, username: loggedInUsername } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const textInputRef = useRef(null);

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

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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

  const handleCommentChange = (text) => {
    setNewComment(text);

    const lastWord = text.split(' ').pop();
    if (lastWord.startsWith('@')) {
      const searchTerm = lastWord.slice(1);
      if (searchTerm) {
        fetchUserSuggestions(searchTerm);
        setShowSuggestions(true);
        measureInputPosition();
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchUserSuggestions = async (searchTerm) => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/users/suggestions?searchTerm=${searchTerm}`, {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data);
      } else {
        console.error('Failed to fetch user suggestions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
    }
  };

  const handleMentionPress = (username) => {
    const words = newComment.split(' ');
    words.pop();
    setNewComment([...words, `@${username}`].join(' ') + ' ');
    setShowSuggestions(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://192.168.1.145:5000/auth/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      const data = await response.json();
      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      } else {
        console.error('Failed to delete comment:', data.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const confirmDeleteComment = (commentId) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteComment(commentId) },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = (commentId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => confirmDeleteComment(commentId)}
    >
      <View>
        <Icon name="trash" size={25} color="white" />
      </View>
    </TouchableOpacity>
  );

  const measureInputPosition = () => {
    if (textInputRef.current) {
      textInputRef.current.measureInWindow((x, y, width, height) => {
        setInputPosition({ x, y, width, height });
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="handled">
          <CustomHeader title="Comments" />
          {comments.map((comment) => {
            const isAuthor = comment.user.username === loggedInUsername;

            return isAuthor ? (
          <Swipeable
              key={comment._id}
              renderRightActions={() => renderRightActions(comment._id)}
              overshootRight={false}
          >
            <View style={styles.comment}>
              <TouchableOpacity onPress={() => handleUserPress(comment.user.username)}>
                <Image source={{ uri: comment.user.profilePicture }} style={styles.profileImageComment} />
              </TouchableOpacity>
              <View style={styles.commentContent}>
                <Text style={styles.commentUser}>{comment.user.fullname}</Text>
                <Text style={styles.commentContentText}>{comment.content}</Text>
                <Text style={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleTimeString([], {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Text>
               </View>
             </View>
          </Swipeable>
     ) : (
         <View key={comment._id} style={styles.comment}>
            <TouchableOpacity onPress={() => handleUserPress(comment.user.username)}>
              <Image source={{ uri: comment.user.profilePicture }} style={styles.profileImageComment} />
           </TouchableOpacity>
           <View style={styles.commentContent}>
              <Text style={styles.commentUser}>{comment.user.fullname}</Text>
              <Text style={styles.commentContentText}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleTimeString([], {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Text>
            </View>
          </View>
        );
      })}

          <View style={styles.commentInputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.commentInput}
              placeholder="Add a comment"
              value={newComment}
              onChangeText={handleCommentChange}
              onFocus={measureInputPosition}
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Icon name="paper-plane" size={25} color="black" />
            </TouchableOpacity>
          </View>

          {showSuggestions && (
            <View
              style={{
                position: 'absolute',
                bottom: height - inputPosition.y - keyboardHeight + 29,
                left: inputPosition.x,
                width: inputPosition.width,
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
                paddingVertical: 10,
                maxHeight: 150,
                zIndex: 1000,
              }}
            >
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true}>
                {suggestions.slice(0, 10).map((item) => (
                  <TouchableOpacity key={item._id} onPress={() => handleMentionPress(item.username)} style={styles.suggestionItem}>
                    <View style={styles.suggestionContainer}>
                      <Image source={{ uri: item.profilePicture }} style={styles.profileImageSuggestion} />
                      <Text style={styles.suggestionText}>
                        @{item.username} ({item.fullname})
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}