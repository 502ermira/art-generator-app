import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: '#fff',
    minHeight: '100%',
    width: width,
    marginTop: -29,
    paddingBottom: 90,
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
    marginBottom: 10,
    alignItems: 'center',
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
    marginBottom: 3,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
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
  }
});
