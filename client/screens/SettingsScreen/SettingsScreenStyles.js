import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
      padding: 20,
    },
    option: {
      backgroundColor: '#fff',
      padding: 19,
      marginVertical: 4,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    optionText: {
      fontSize: 16.5,
      color: '#333',
    },
  });
  
  export default styles;