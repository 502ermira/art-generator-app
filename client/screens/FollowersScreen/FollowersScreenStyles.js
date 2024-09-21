import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151419',
    minHeight: height,
    width:width,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
    marginHorizontal: 18,
    marginBottom: -10
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: 10,
    elevation: 5,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    width:'100%',
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 14.5,
    color: '#bbb',
    fontWeight: '400',
  },
  fullname: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 18,
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#7049f6',
    borderRadius: 20,
  },
  following: {
    backgroundColor: '#999',
  },
  notFollowing: {
    backgroundColor: '#7049f6',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#777',
    paddingRight: 105,
    marginBottom:6,
    backgroundColor: '#28272C',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    width: width - 36,
  },
  tabBar : {
    backgroundColor: '#7049f6'
  },
  searchBar: {
    height: 36,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 23,
    color: 'white',
    marginHorizontal: 18,
  }  
});
