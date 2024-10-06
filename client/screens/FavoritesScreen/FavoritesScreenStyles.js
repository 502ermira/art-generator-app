import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#151419',
    },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    paddingBottom: 150,
    marginTop: -55,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  favoriteImage: {
    width: width * 0.87,
    height: width * 0.87,
    borderRadius: 5,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  shareButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 38,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16.5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ff5555',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
  },
  fullscreenImage: {
    width: width * 0.95,
    height: height * 0.75,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});