import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: height,
    width: width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 13,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    justifyContent: 'center',
  },
  fullname: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  prompt: {
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#303030',
    fontSize: 15,
  },
  description: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  date: {
    color: '#888',
  },
});
