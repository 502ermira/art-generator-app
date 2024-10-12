import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  navbarTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    paddingTop:45,
    backgroundColor: '#000',
  },
  logo: {
    width: 90,
    height:50,
    marginTop: -11,
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 10,
    shadowColor: '#6200ea',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  navbarBottomContainer: {
    width: '100%',
    height: 77,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 7,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    zIndex: 10,
  },
  navIcon: {
    fontSize: 28,
    color: '#ddd',
  },
});