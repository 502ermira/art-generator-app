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
    paddingTop:20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  fullname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  followInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  followers: {
    marginRight: 9,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 25,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: '#fafafa',
    marginTop: 20,
    marginRight: 15,
    marginLeft: 15,
  },
});
