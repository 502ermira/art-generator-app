import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  },
});
