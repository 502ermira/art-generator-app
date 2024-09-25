import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 66,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 7,
    marginBottom: 25,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    height: (height / 2) - 65,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#7049f6',
  },
  username: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#7049f6',
  },
  date: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
