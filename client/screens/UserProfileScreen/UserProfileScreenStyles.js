import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 0,
    paddingBottom: 100,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  fullname: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    top: 8,
  },
  bio : {
    paddingHorizontal: 21,
    marginTop:-10,
    fontSize: 15,
  },
  followInfo: {
    flexDirection: 'row',
    marginTop: 17,
  },
  followers: {
    marginRight: 10,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  postContainer: {
    overflow: 'hidden',
    padding: 3,
    justifyContent: 'flex-start',
  },
  followButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 11,
    marginHorizontal: 20,
    marginBottom: -3,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#fafafa',
    marginTop: 13,
    marginHorizontal: 8,
  },
  noPostsText : {
    textAlign: 'center',
    top:23,
    fontSize: 15,
  }
});