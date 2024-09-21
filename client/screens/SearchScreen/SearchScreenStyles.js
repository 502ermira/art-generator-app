import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151419',
    paddingTop: 80,
  },
  searchInput: {
    padding: 10,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    color: '#eee',
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7049f6',
  },
  textContainer: {
    marginLeft: 10,
  },
  fullname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  username: {
    fontSize: 14,
    color: '#888',
  },
});
