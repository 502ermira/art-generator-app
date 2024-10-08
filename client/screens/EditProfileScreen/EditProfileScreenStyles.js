import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  imageButton: {
    padding: 11,
    backgroundColor: '#28a745',
    borderRadius: 8,
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  bioInput: {
    height: 100
  },  
  characterCount: {
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: -5,
    fontSize:12.5,
  }, 
  saveButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginVertical: 10,
  },
  fieldErrorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
});