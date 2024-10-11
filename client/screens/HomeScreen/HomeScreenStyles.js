import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 50,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 7,
    marginBottom: 25,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    resizeMode: 'contain',
    height:65,
    width: 110,
    marginTop:4,
    marginBottom: 18,
    alignSelf: 'center',
    tintColor: 'rgba(0, 0, 0, 0.33)',
  },
  image: {
    height: (height / 2) - 65,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    lineHeight: 22,
    marginTop: 5,
  },
  profileImage: {
    width: 41,
    height: 41,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#7049f6',
  },
  username: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#7049f6',
  },
  date: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoAndEngagement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },
  engagementContainer: {
    flexDirection: 'row',
    right:7,
  },
  likes: {
    fontWeight: '500',
    marginHorizontal: 7,
    alignContent: 'center'
  },
  comments: {
    fontWeight: '500',
    marginHorizontal: 7,
    alignContent: 'center',
  },
  commentIcon : {
    top:-2
  },
  reposts: {
    fontWeight: '500',
    marginHorizontal: 7,
    alignContent: 'center',
    alignItems: 'center'
  },
  repostIcon : {
    top:-1.5,
  },
  prompt : {
    fontSize: 13,
    color: '#808080',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  readMoreText: {
    color: '#7049f6',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
