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
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: '#28272C',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      elevation: 5,
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
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
    },
    repostedAt: {
      fontSize: 14,
      color: '#ddd',
      marginTop: 5,
    },
    emptyText: {
      fontSize: 16,
      color: '#aaa',
      textAlign: 'center',
      marginTop: 20,
    },
  });