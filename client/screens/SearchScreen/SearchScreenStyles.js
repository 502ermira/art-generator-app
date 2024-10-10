import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    backgroundColor: '#f5f5f5',
    paddingTop: 66,
    paddingBottom: 77,
  },
  searchContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    height: 38,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 15,
    marginRight: 8,
    width: '85%',
  },
  resultContainer: {
    flex: 1,
    margin: 3,
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '48%'
    },
  userResult: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyItems: 'flex-start',
  },
  profileImage: {
    width: 47,
    height: 47,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#7049f6',
    left: 8,
    marginRight: 11,
  },
  userInfoContainer : {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture : {
    width:21,
    height:21,
    borderRadius: 50,
    marginRight: 6,
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  fullname: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginTop: 2.5,
  },
  username: {
    fontSize: 15,
    color: '#777',
    marginTop: 1,
  },
  usernamePost : {
    fontSize: 12,
    fontWeight: '500',
    color: '#777',
  },
  photoImage: {
    width: (width / 2) ,
    height: (height / 4) - 20,
    resizeMode: 'cover',
  },
  searchIconContainer : {
    color: '#7049f6',
  },
  tabBar: {
    marginTop: 10,
    backgroundColor: 'none',
    marginHorizontal: 5,
  },
  tabIndicator: {
    backgroundColor: '#7049f6',
    marginBottom: 2,
  },
  tabLabel: {
    color: '#000',
    fontSize: 13,
  },
  noResultsText: {
    fontSize: 17,
    color: '#888',
    top: 32,
    textAlign: 'center'
  },
});

export default styles;