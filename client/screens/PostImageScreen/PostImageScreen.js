import React, { useState, useContext } from 'react';
import { Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ScrollView, Alert } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import CustomHeader from '../../components/CustomHeader';
import styles from './PostImageScreenStyles';

export default function PostImageScreen({ route, navigation }) {
  const { selectedImage, imagePrompt } = route.params;
  const { token } = useContext(UserContext);
  const [description, setDescription] = useState('');

  const handleShare = async () => {
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/share', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: { url: selectedImage },
          description,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Image shared successfully!', [
          {
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        Alert.alert('Error', 'Failed to share image.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Error occurred: ' + err.message);
    }
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= 250) {
      setDescription(text);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 10, android: 10 })}
    >
      <CustomHeader title="Share Image" screenType="headerContainerNull" />

      <ScrollView 
        contentContainerStyle={styles.innerContainer}         
        showsVerticalScrollIndicator={false}              
      >
        <Image source={{ uri: selectedImage }} style={styles.image} />

        <Text style={styles.promptText}>
          Prompt: {imagePrompt}
        </Text>

        <TextInput
          value={description}
          onChangeText={handleDescriptionChange}
          placeholder="Enter a description"
          placeholderTextColor="#bbb"
          style={styles.input}
          maxLength={250}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          blurOnSubmit={true}
        />
        <Text style={styles.characterCount}>
          {description.length}/250 characters
        </Text>

        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}