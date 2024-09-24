import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  searchContainer : {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    height: 43,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 15,
    marginRight: 8,
    width: '82%',
  },
  button: {
    backgroundColor: '#7049f6',
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6200ea',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  navIcon: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 30,
  },
  imageContainer: {
    flex: 1,
    margin: 7,
    marginTop:25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoImage: {
    width: (width / 2) - 30,
    height: (height / 4) - 20,
    resizeMode: 'cover',
  },
});

export default styles;