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
    marginTop: -50,
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
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16
  },
  imageButton: {
    padding: 40,
    backgroundColor: '#7049f6',
    borderRadius: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderColor:'#5029d6',
    borderWidth:2.5,
  },
  imageButtonText: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '500',
  },
  profileImage: {
    width:120,
    height:120,
  },
  label : {
    color: '#f0f0f0',
    fontSize: 15,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 18,
  }
});

export { styles };