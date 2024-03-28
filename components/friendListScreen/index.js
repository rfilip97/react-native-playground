import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-paper';
import theme from '../../theme';
import { Repository } from '../../repository';
import { useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/selectors';

function generateUserObjects(names) {
  return names.map((name, index) => {
    const [firstName, lastName] = name.split(' ');
    return {
      id: index + 1,
      imageUri: `https://picsum.photos/200?random=${index + 1}`,
      status: 'offline',
      firstName: firstName,
      lastName: lastName
    };
  });
}

const FriendListScreen = ({ navigation }) => {
  const userDetails = useSelector(getUserDetails);
  const { id, token } = userDetails;
  const [friends, setFriends] = useState([])

  const getFriends = async () => {
    try {
      const response = await Repository.getFriends(token, id);
      if (response) {
      const friends = response.items[0].friend_list.map((friend) => friend.name)
      const friendsData = generateUserObjects(friends)
      setFriends(friendsData)
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getFriends()
  }, [])

  const sortedFriends = [...friends].sort((a, b) => {
    if (a.status === 'online' && b.status === 'offline') {
      return -1;
    }
    if (a.status === 'offline' && b.status === 'online') {
      return 1;
    }
    return 0;
  });

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      style={styles.friendContainer}
      onPress={() => navigation.navigate('Chat', { friend: item })}
      activeOpacity={0.6}
    >
      <Image source={{ uri: item.imageUri }} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>
          {item.lastName} {item.firstName}
        </Text>
        <View style={styles.statusContainer}>
          <View
            style={
              item.status === 'online'
                ? styles.statusDotOnline
                : styles.statusDotOffline
            }
          />
          <Text style={styles.friendStatus}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
      />

      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate('FindFriends')} // Make sure you have a FindFriends route defined in your navigator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.colors.secondary
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendInfo: {
    justifyContent: 'center',
  },
  friendName: {
    fontSize: theme.fonts.big.fontSize,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDotOnline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
  },
  statusDotOffline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'grey',
    marginRight: 5,
  },
  friendStatus: {
    fontSize: theme.fonts.regular.fontSize,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});

export default FriendListScreen;
