import { StyleSheet, Dimensions } from 'react-native';

const {width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
     },
     innerContainer : {
      marginHorizontal: 20,
     },
      image: {
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: 3,
        marginBottom: 10,
        resizeMode: 'cover',
        marginTop: 33,
      },
      promptText: {
        fontSize: 15.5,
        color: '#666',
        marginBottom: 12,
        fontStyle: 'italic',
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        height: 100,
        borderRadius: 7,
        paddingHorizontal:6,
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
      characterCount: {
        color: '#ccc',
        alignSelf: 'flex-end',
        marginBottom: 10,
        marginTop: -10,
      },  
});

export default styles;
