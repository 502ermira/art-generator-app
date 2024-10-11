import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window')
export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    paddingVertical:60,
    minHeight: height,
    paddingBottom:100,
  },
  notification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    top:2.5,
  },
  notificationTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  usernameAndTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  loaderContainer: {
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    paddingVertical: 10,
    alignItems: 'center',
  }
});