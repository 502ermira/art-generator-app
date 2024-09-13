import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop:60,
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
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#7049f6',
    borderWidth: 0,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    color: '#eee',
  },
  button: {
    backgroundColor: '#7049f6',
    paddingVertical: 13,
    paddingHorizontal: 11,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '53%',
    shadowColor: '#6200ea',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 17,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#7049f6',
    shadowColor: '#0b0b16',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  favoritesContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#e0e0e0',
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
  favoritesButton: {
    backgroundColor: '#7049f6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 17,
  },
  error: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
  },
  description: {
    fontSize: 15.5,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  previewContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default styles;