import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    minHeight: height,
    width: width,
    paddingBottom: 100,
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
    paddingHorizontal: 16,
    paddingTop: 12,
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
    fontWeight: '600',
    fontSize: 17,
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
  },
  prompt: {
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#303030',
    fontSize: 15,
    paddingLeft: 16,
  },
  description: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    paddingLeft: 16,
  },
  date: {
    color: '#888',
    paddingLeft: 16,
    marginTop: 19,
    fontSize: 13,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  likeIcon: {
    marginRight: 5,
  },
  likeButton: {
    padding: 9,
    borderRadius: 50,
    marginLeft: -3,
  },
  unlikeButton: {
    padding: 9,
    borderRadius: 50,
    marginLeft: -3,
  },
  commentsSection: {
    marginTop: 0,
    paddingTop: 16,
    textAlign: 'center',
    justifyItems : 'center',
  },
  comment: {
    paddingHorizontal: 3,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingLeft: 16,
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
    marginTop: 3,
    paddingHorizontal: 16,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 9,
    marginRight: 10,
    fontSize: 14,
  },
  commentButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  commentIcon: {
    marginLeft: 10,
    marginTop: -3,
    marginRight:12,
  },
  submitIcon: {
    paddingRight: 2,
  },
  viewMoreText : {
    marginBottom: 6,
    paddingLeft: 16,
    marginTop: -3,
  },
  repostedByText: {  
    fontSize: 15.5, 
    fontStyle: 'italic',
    color: '#999',
    paddingLeft: 18,
    paddingTop:13,
    alignItems: 'center',
    padding: 10,
  },
  repostIcon : {
    paddingRight:8,
  },
  repostDate : {
    fontSize: 14,
  }
});