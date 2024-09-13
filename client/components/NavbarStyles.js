import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navbarContainer: {
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
  loggedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 36.5,
    color: '#fff',
    marginRight: 13,
    borderRadius: 50,
  },
  logoutButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#ff5252',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  authContainer: {
    flexDirection: 'row',
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
});

export default styles;
