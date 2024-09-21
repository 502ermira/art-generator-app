import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#151419',
    },
    scrollContainer: {
      paddingVertical: 20,
      marginHorizontal: 17,
    },
    repost: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      marginBottom: 6,
      backgroundColor: '#28272C',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      elevation: 5,
      paddingHorizontal: 14,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 50,
      marginRight: 15,
    },
    repostInfo: {
      flex: 1,
    },
    username: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
    repostedAt: {
      fontSize: 13.5,
      color: '#ddd',
      marginTop: 5,
    },
    emptyText: {
      fontSize: 16,
      color: '#aaa',
      textAlign: 'center',
      marginTop: 20,
    },
    searchBar: {
      height: 37,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginTop: 25,
      color: 'white',
      marginHorizontal: 18,
      marginVertical:3,
    }  
  });