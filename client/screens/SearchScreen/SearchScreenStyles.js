import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    paddingTop: 62,
  },
  searchContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 15,
    marginRight: 14,
    width: '85%',
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 30,
  },
  resultContainer: {
    flex: 1,
    margin: 7,
    marginTop:15,
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userResult: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyItems: 'flex-start',
  },
  profileImage: {
    width: 47,
    height: 47,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#7049f6',
    left: 8,
    marginRight: 11,
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column',
  },
  fullname: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginTop: 2.5,
  },
  username: {
    fontSize: 15,
    color: '#888',
    marginTop: 1,
  },
  photoImage: {
    width: (width / 2) - 30,
    height: (height / 4) - 20,
    resizeMode: 'cover',
  },
  tabBar: {
    marginTop: 10,
    backgroundColor: 'none',
  },
  tabIndicator: {
    backgroundColor: '#7049f6',
    marginBottom: 2,
  },
  tabLabel: {
    color: '#000',
    fontSize: 13,
  },
});

export default styles;