import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 20,
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
  username: {
    fontSize: 18,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginVertical: 13,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap : 'wrap',
    marginHorizontal: -15,
    alignItems: 'flex-start',
    justifyContent:'center',
  },
  previewImage: {
    width: 174,
    height: 180,
    margin: 4,
  },
  followButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  followInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  followers : {
    marginRight: 9,
  },
  postContainer: {
    alignItems: 'center',
  },
});