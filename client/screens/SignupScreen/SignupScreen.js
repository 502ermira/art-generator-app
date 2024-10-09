import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, Modal, Dimensions, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../../components/Loader.js';
import { styles } from './SignupScreenStyles';
import * as FileSystem from 'expo-file-system';

const { width } =  Dimensions.get('window');

export default function SignupScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [debouncedPassword, setDebouncedPassword] = useState('');
  const [debouncedFullname, setDebouncedFullname] = useState('');
  const [debouncedBio, setDebouncedBio] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [bioError, setBioError] = useState('');

  const { redirectTo, imageParams } = route.params || {};

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedUsernameValue = useDebounce(username, 500);
  const debouncedEmailValue = useDebounce(email, 500);
  const debouncedPasswordValue = useDebounce(password, 500);
  const debouncedFullnameValue = useDebounce(fullname, 500);
  const debouncedBioValue = useDebounce(bio, 500);

  useEffect(() => {
    const hasSpace = /\s/;
    const startsWithLetter = /^[a-zA-Z]/;
    const validCharacters = /^[a-zA-Z0-9_.]+$/;
    const hasConsecutiveSpecialChars = /[_.]{2,}/;

    if (username.length < 3 || username.length > 18) {
      setUsernameError('Username must be between 3 and 18 characters.');
    } else if (hasSpace.test(username)) {
      setUsernameError('Username cannot contain spaces.');
    } else if (!startsWithLetter.test(username)) {
      setUsernameError('Username must start with a letter.');
    } else if (!validCharacters.test(username)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and full stops.');
    } else if (hasConsecutiveSpecialChars.test(username)) {
      setUsernameError('Username cannot contain consecutive special characters.');
    } else {
      setUsernameError('');
    }
}, [username]);
  
  useEffect(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (debouncedPasswordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else {
      setPasswordError('');
    }
  }, [debouncedPasswordValue]);

  useEffect(() => {
    const hasNumber = /\d/;
    const hasSpecialChar = /[^a-zA-Z\s]/;
    const hasConsecutiveSpaces = /\s{2,}/;
    const trimmedFullname = fullname.trim();
  
    if (trimmedFullname.length < 3 || trimmedFullname.length > 25) {
      setFullnameError('Fullname must be between 3 and 25 characters.');
    } else if (trimmedFullname.startsWith(' ')) {
      setFullnameError('Fullname cannot start with a space.');
    } else if (trimmedFullname.endsWith(' ')) {
      setFullnameError('Fullname cannot end with a space.');
    } else if (hasNumber.test(trimmedFullname)) {
      setFullnameError('Fullname cannot contain numbers.');
    } else if (hasSpecialChar.test(trimmedFullname)) {
      setFullnameError('Fullname cannot contain special characters.');
    } else if (hasConsecutiveSpaces.test(trimmedFullname)) {
      setFullnameError('Fullname cannot contain consecutive spaces.');
    } else {
      setFullnameError('');
    }
  }, [debouncedFullnameValue]);

  useEffect(() => {
    if (debouncedBioValue.length > 150) {
      setBioError('Bio cannot exceed 150 characters.');
    } else {
      setBioError('');
    }
  }, [debouncedBioValue]);

  useEffect(() => {
    const checkUsername = async () => {
      const usernameToCheck = debouncedUsernameValue.trim().toLowerCase();
      if (usernameToCheck && !usernameError) {
        try {
          const response = await fetch('http://192.168.1.145:5000/auth/validate-username', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: usernameToCheck }),
          });
    
          const data = await response.json();
          if (response.status === 409) {
            setUsernameError('Username already taken');
          } else {
            setUsernameError('');
          }
        } catch (error) {
          setUsernameError('Error checking username');
        }
      }
    };

    checkUsername();
  }, [debouncedUsernameValue]);

  useEffect(() => {
    const checkEmail = async () => {
      const emailToCheck = debouncedEmailValue.trim().toLowerCase();
      
      if (emailToCheck && !emailError) {
        try {
          const response = await fetch('http://192.168.1.145:5000/auth/validate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailToCheck }),
          });
  
          if (response.status === 409) {
            setEmailError('Email already in use');
          } else {
            setEmailError('');
          }
        } catch (error) {
          setEmailError('Error checking email');
        }
      }
    };
  
    checkEmail();
  }, [debouncedEmailValue]);

  const validateInputs = () => {
    if (usernameError || emailError || passwordError || fullnameError || bioError) {
      return false;
    }
    
    setError('');
    return true;
  };

  const signupUser = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    const formData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      fullname: fullname.trim(),
      profilePicture: profilePicture,
      bio: bio,
    };

    try {
      const response = await fetch('http://192.168.1.145:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setModalVisible(true);

        navigation.replace('Login', { redirectTo, imageParams });
        
      } else {
        setError(data.error || 'An unknown error occurred. Please try again.');
      }
    } catch (err) {
      setError('Signup failed. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      setError('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setProfilePicture(`data:image/jpeg;base64,${base64}`);
    }
  };

  return (
    <KeyboardAvoidingView 
       style={styles.container} 
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       keyboardVerticalOffset={110}
    >
       <ScrollView contentContainerStyle={{  
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#151419',
         maxWidth : width,
         minWidth :  width,
         padding: 23 }}
        keyboardShouldPersistTaps="handled"
       >
      {loading ? <Loader /> : (
        <>
          <Text style={styles.title}>Signup</Text>
          <TouchableOpacity onPress={selectImage} style={styles.imageButton}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageButtonText}><Icon name="image" size={30} color="#eee" /></Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.label}>Choose Your Profile Picture</Text>
          <TextInput
            style={styles.input}
            placeholder="Fullname*"
            placeholderTextColor="#bbb"
            value={fullname}
            onChangeText={setFullname}
            maxLength={25}
          />
          {fullnameError ? <Text style={styles.error}>{fullnameError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Username*"
            placeholderTextColor="#bbb"
            value={username}
            onChangeText={setUsername}
            maxLength={18}
          />
          {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Email*"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Password*"
            placeholderTextColor="#bbb"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={50}
          />
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            placeholderTextColor="#bbb"
            value={bio}
            onChangeText={(text) => {
             if (text.length <= 150) {
             setBio(text);
             }
            }}
            maxLength={150}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            blurOnSubmit={true}
          />
            <Text style={styles.characterCount}>
             {bio.length}/150 characters
            </Text>
            {bioError ? <Text style={styles.error}>{bioError}</Text> : null}
 
          <TouchableOpacity style={styles.button} onPress={signupUser}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
             <View style={styles.modalContent}>
              <Text style={styles.modalText}>Signup Successful!</Text>
              <TouchableOpacity onPress={() => {
               navigation.replace('Login', { redirectTo, imageParams });
               setModalVisible(false);
              }} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Go to Login</Text>
              </TouchableOpacity>
             </View>
            </View>
          </Modal>
        </>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}