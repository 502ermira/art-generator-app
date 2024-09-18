import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151419',
    minHeight: height,
    width: width,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151419',
  },
  loadingText: {
    color: '#eee',
    fontSize: 18,
  },
  scrollContainer: {
    paddingVertical: 20,
    marginHorizontal: 17,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    elevation: 5,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 16,
    color: '#ddd',
    fontWeight: '400',
  },
  fullname: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#7049f6',
    borderRadius: 20,
  },
  following: {
    backgroundColor: '#999',
  },
  notFollowing: {
    backgroundColor: '#7049f6',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#777',
    paddingRight: 110,
    marginBottom:5,
    backgroundColor: '#28272C',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
});
