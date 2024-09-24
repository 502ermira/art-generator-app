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
    justifyContent: 'flex-start',
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
});