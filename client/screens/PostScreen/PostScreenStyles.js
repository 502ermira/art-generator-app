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
    width: 53,
    height: 53,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    justifyContent: 'center',
  },
  fullname: {
    fontWeight: 'bold',
    fontSize: 17.5,
  },
  username: {
    color: '#888',
    fontSize: 15,
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
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    textAlign: 'center',
  },
  likeIcon: {
    marginRight: 8,
  },
  likeButton: {
    padding: 10,
    borderRadius: 50,
  },
  unlikeButton: {
    padding: 10,
    borderRadius: 50,
  },
  commentsSection: {
    marginTop: 5,
    paddingTop: 16,
    textAlign: 'center',
    justifyItems : 'center',
  },
  commentsTitle: {
    fontSize: 17,
    marginBottom: 12,
  },
  comment: {
    paddingHorizontal: 9,
    paddingVertical: 13,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  profileImageComment : {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  commentUser: {
    marginBottom: 4,
    fontSize: 15,
    justifyContent: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 14,
  },
  commentButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentIcon: {
    marginLeft: 12,
  },
  submitIcon: {
    paddingHorizontal: 7,
  },
});