import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window')
export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    paddingVertical:60,
    minHeight: height,
  },
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 2,
  },
  usernameText: {
    fontWeight: '600',
  },
  notificationTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  usernameAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  notificationText: {
    fontSize: 14,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginLeft:20,
  },
  followButton: {
    padding: 10,
    backgroundColor: '#1DA1F2',
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 8.5,
    paddingHorizontal: 11,
    borderRadius: 5,
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  popup: {
    position: 'absolute',
    width: '100%',
    padding: 16,
    paddingVertical: 12,
    backgroundColor: '#ddd',
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0.5 },
    elevation: 5,
    paddingTop:40,
  },
  
  popupMessage: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
  
  popupProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight:12,
  },
  
  popupPostImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginLeft:15,
  },
  
  popupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    justifyItems: 'center',
    alignContent: 'center',
  },
  
  popupTextContainer: {
    flex: 1,
    alignItems: 'center',
    },

  popupUserInfo : {
   alignContent: 'flex-start',
   flexDirection:'row',
   flex:1,
   alignItems: 'center',
  }
});