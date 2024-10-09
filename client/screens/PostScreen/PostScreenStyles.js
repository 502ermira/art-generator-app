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
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 11,
    justifyContent:'space-between',
    alignItems: 'center'
  },
  userInfoInner : {
    flexDirection: 'row',
  },
  profileImage: {
    width: 49,
    height: 49,
    borderRadius: 25,
    marginRight: 9,
    borderColor: '#7049f6',
    borderWidth: 1
  },
  userDetails: {
    justifyContent: 'center',
  },
  fullname: {
    fontWeight: '600',
    fontSize: 16,
  },
  username: {
    color: '#888',
    fontSize: 14,
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
    marginVertical: 4,
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
    marginRight:10,
  },
  repostDate : {
    fontSize: 14,
  },
  suggestionItem :{
    padding:7,
    flex: 1
  },
  profileImageSuggestion : {
    width: 27,
    height: 27,
    borderRadius: 50,
    marginRight: 10,
  },
  suggestionContainer : {
    flexDirection: 'row', 
    alignItems: 'center' ,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 0,
  },
  deleteMessage : {
    color: '#7049f6',
    paddingTop : 18,
    textAlign: 'center',
    fontWeight: 500,
    fontSize: 14.5
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '70%',
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#7049f6',
    borderRadius: 5,
    padding: 10,
    width: '50%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});