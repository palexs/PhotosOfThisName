import React, {FC, useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SearchBar, ListItem, Avatar} from 'react-native-elements';
import Contacts, {Contact} from 'react-native-contacts';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

const ContactsPage: FC<{
  navigation: StackNavigationProp<RootStackParamList, 'Contacts'>;
  route: RouteProp<RootStackParamList, 'Contacts'>;
}> = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );

  const requestPermissionsAndLoadContactsIOS = async () => {
    const permissionStatus = await Contacts.requestPermission();
    if (permissionStatus === 'authorized') {
      await loadContacts();
      setPermissionGranted(true);
    } else {
      setPermissionGranted(false);
    }
  };

  const requestPermissionsAndLoadContactsAndroid = async () => {
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to access your contacts.',
        buttonPositive: 'Grant access',
      },
    );
    if (permissionStatus === 'granted') {
      await loadContacts();
      setPermissionGranted(true);
    } else {
      setPermissionGranted(false);
    }
  };

  const loadContacts = async () => {
    Contacts.getAll()
      .then(allContacts => {
        setFilteredContacts(allContacts);
        setContacts(allContacts);
      })
      .catch(e => {
        // this.setState({ loading: false });
        console.log('>>> ERROR: ', e);
      });

    // await Contacts.checkPermission();
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        await requestPermissionsAndLoadContactsAndroid();
      } else {
        await requestPermissionsAndLoadContactsIOS();
      }
    })();
  }, []);

  const searchFilterFunction = (query: string) => {
    if (query) {
      const newData = contacts.filter(
        contact =>
          contact.givenName.toUpperCase().indexOf(query.toUpperCase()) !== -1 ||
          contact.familyName.toUpperCase().indexOf(query.toUpperCase()) !== -1,
      );
      setFilteredContacts(newData);
    } else {
      setFilteredContacts(contacts);
    }
    setSearch(query);
  };

  const renderItem = ({item}: {item: Contact}) => {
    return (
      <ListItem
        bottomDivider
        style={{marginHorizontal: 10}}
        onPress={() => onItemPress(item)}>
        <Avatar source={item.hasThumbnail && {uri: item.thumbnailPath}} />
        <ListItem.Content>
          <ListItem.Title>{item.givenName}</ListItem.Title>
          <ListItem.Subtitle>{item.familyName}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  const onItemPress = (item: Contact) => {
    navigation.goBack();
    route.params.onSelectContact(item);
  };

  if (permissionGranted === false) {
    // TODO: Request access
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text>{'Contacts access permissions not granted!'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <SearchBar
          round
          searchIcon={{size: 24}}
          onChangeText={(text: string) => searchFilterFunction(text)}
          onClear={() => searchFilterFunction('')}
          placeholder={'Type name here...'}
          value={search}
          lightTheme
        />
        <FlatList
          data={filteredContacts}
          keyExtractor={(item: Contact) => item.recordID}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ContactsPage;
