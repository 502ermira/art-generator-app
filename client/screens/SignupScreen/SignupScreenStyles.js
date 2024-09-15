import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#151419',
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
    color: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
  error: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
  },
  imageButton: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  imagePlaceholderText: {
    color: '#fff',
    fontSize: 16,
  },
  imageButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width:120,
    height:120,
  },
});

export { styles };
