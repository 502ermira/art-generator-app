import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 13,
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
  bioInput: {
    height: 100
  },  
  characterCount: {
    color: '#C6B4FF',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: -10,
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
    color: '#C6B4FF',
    fontSize: 14,
    top: -10,
    bottom: 7,
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
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
    borderRadius: 100,
  },
  label : {
    color: '#C6B4FF',
    fontSize: 15,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: 18,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
  },
  buttonStyle : {
    backgroundColor: '#7049f6',
    paddingHorizontal: 17,
    paddingVertical: 7,
    borderRadius: 10
  },
  buttonText : {
    color:'white',
    fontSize: 18,
    fontWeight: 500
  }
});

export { styles };