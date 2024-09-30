import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, TextInput, Pressable, Text, Image, View, Alert, Platform  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../../contexts/UserContext';
import styles from './EditProfileScreenStyles';
import * as FileSystem from 'expo-file-system';

let debounceTimeout;

export default function EditProfileScreen({ navigation, route }) {
  const { token, setUsername: setContextUsername } = useContext(UserContext);
  const { updateUserData } = route.params;

  const [fullname, setFullname] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const [validationLoading, setValidationLoading] = useState(false);
  const [initialFullname, setInitialFullname] = useState('');
  const [initialProfilePicture, setInitialProfilePicture] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialBio, setInitialBio] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [bioError, setBioError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://192.168.1.145:5000/auth/profile', {
          headers: { Authorization: token },
        });
        const data = await response.json();
        setFullname(data.fullname || '');
        setProfilePicture(data.profilePicture || '');
        setUsername(data.username || '');
        setEmail(data.email || '');
        setBio(data.bio || '');

        setInitialFullname(data.fullname || '');
        setInitialProfilePicture(data.profilePicture || '');
        setInitialUsername(data.username || '');
        setInitialEmail(data.email || '');
        setInitialBio(data.bio || '');
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
      }
    };

    fetchUserData();
  }, [token]);

  const debounce = (func, delay) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(func, delay);
  };

  useEffect(() => {
    if (email && email.trim().toLowerCase() !== initialEmail.trim().toLowerCase() && initialEmail) {
      debounce(async () => {
        try {
          const response = await fetch(`http://192.168.1.145:5000/auth/validate-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({ email: email.trim().toLowerCase() }),
          });
          const result = await response.json();
          if (result.error) {
            setEmailError('Email already in use');
          } else {
            setEmailError('');
          }
        } catch (err) {
          setEmailError('Error validating email');
        }
      }, 1000);
    } else if (!email.trim()) {
      setEmailError(''); // Reset error if the email field is empty
    }
  }, [email, initialEmail]);
  
  useEffect(() => {
    if (username && username !== initialUsername && initialUsername) {
      setValidationLoading(true);
      debounce(async () => {
        try {
          const response = await fetch(`http://192.168.1.145:5000/auth/validate-username`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({ username }),
          });
          const result = await response.json();
          if (result.error) {
            setUsernameError('Username already taken');
          } else {
            setUsernameError('');
          }
        } catch (err) {
          setUsernameError('Error validating username');
        } finally {
          setValidationLoading(false);
        }
      }, 1000);
    } else if (!username.trim()) {
      setUsernameError(''); // Reset error if the username field is empty
    }
  }, [username, initialUsername]);  

  const handleSave = async () => {
    if (validationLoading) {
      Alert.alert('Error', 'Please wait for validation to finish.');
      return;
    }
  
    setUsernameError('');
    setEmailError('');
    setFullnameError('');
    setBioError('');
  
    // Check if any field has been changed
    if (
      fullname === initialFullname &&
      bio === initialBio &&
      profilePicture === initialProfilePicture &&
      username.toLowerCase() === initialUsername.toLowerCase() &&
      email.toLowerCase() === initialEmail.toLowerCase()
    ) {
      navigation.goBack();
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.145:5000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          fullname,
          profilePicture,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          bio,
        }),
      });
  
      const result = await response.json();
      setLoading(false);
  
      if (response.ok) {
        if (result.updates) {
          updateUserData(result.updates);
  
          if (result.updates.username && result.updates.username !== initialUsername) {
            setUsername(result.updates.username);
            setContextUsername(result.updates.username);
  
            // Save updated username to AsyncStorage
            await AsyncStorage.setItem('username', result.updates.username);
          }
        }
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        if (result.error.includes('Username already taken')) {
          setUsernameError('Username already taken');
        }
        if (result.error.includes('Email already in use')) {
          setEmailError('Email already in use');
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('Update failed:', err);
      Alert.alert('Error', 'Update failed');
    }
  };  
  
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (Platform.OS === 'web') {
        const webUri = result.assets[0].uri;
        setProfilePicture(webUri);
      } else {
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setProfilePicture(`data:image/jpeg;base64,${base64}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        <Pressable onPress={selectImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Select Profile Picture</Text>
        </Pressable>

        <TextInput
          placeholder="Full Name"
          value={fullname}
          onChangeText={setFullname}
          style={styles.input}
        />
        {fullnameError ? <Text style={styles.fieldErrorText}>{fullnameError}</Text> : null}

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        {usernameError ? <Text style={styles.fieldErrorText}>{usernameError}</Text> : null}

        <TextInput
          placeholder="Add bio"
          placeholderTextColor='#aaa'
          value={bio}
          onChangeText={setBio}
          style={styles.input}
        />
        {bioError ? <Text style={styles.fieldErrorText}>{bioError}</Text> : null}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}

        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}