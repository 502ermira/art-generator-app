import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    minHeight: '100%',
    width: width,
    paddingBottom: 77,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comment: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  commentContentText: {
    fontSize:15,
    fontWeight: 500,
  },
  profileImageComment: {
    width: 44,
    height: 44,
    borderRadius: 50,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
    margin: 10,
    paddingTop: 11
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    marginTop: 4,
    color: '#909090',
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
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginRight:3,
    paddingVertical: 10,
    marginVertical: 3,
    marginBottom: 7,
    borderRadius: 3,
  },
});