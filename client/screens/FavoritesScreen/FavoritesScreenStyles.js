import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  favoriteItem: {
    marginBottom: 30,
    flexDirection: 'colum',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151419',
    padding: 10,
    borderRadius: 1,
    borderWidth: 1,
    shadowColor: '#111',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    width: 290,
    paddingTop:25,
  },
  favoriteImage: {
    width: 242,
    height: 242,
    borderRadius: 1,
    marginBottom: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 60,
    right: 12,
    backgroundColor: 'red',
    padding: 11,
    paddingHorizontal: 18,
    borderRadius: 50,
    zIndex: 1,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default styles;
