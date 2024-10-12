import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 0,
    paddingBottom: 77,
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
    marginBottom: 7,
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
    fontSize: 15,
    marginBottom: 4,
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
    justifyContent: 'flex-start',
    padding: 2.5
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  postContainer: {
    overflow: 'hidden',
    padding: 2.5,
    justifyContent: 'flex-start',
    paddingTop:2.5
  },
  followButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 6,
    marginHorizontal: 20,
    marginBottom: -11,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#fafafa',
    marginTop: 13,
    marginHorizontal: 6,
    height: 42,
    marginBottom:-3
  },
  noPostsText : {
    textAlign: 'center',
    top:23,
    fontSize: 15,
  }
});