import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151419',
    minHeight: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151419',
  },
  loadingText: {
    color: '#eee',
    fontSize: 18,
  },
  scrollContainer: {
    paddingVertical: 20,
    marginHorizontal: 17,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28272C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 16,
    color: '#ddd',
    fontWeight: '400',
  },
  fullname: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});
