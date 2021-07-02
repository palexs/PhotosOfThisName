import React, {FC, useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SearchBar, ListItem, Avatar, Button} from 'react-native-elements';
import Contacts, {Contact} from 'react-native-contacts';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {grantAccess, loadContacts} from '../store/contacts/actions';
import {
  getContacts,
  getPermissionsGranted,
  getLoading,
} from '../store/contacts/selectors';

const ContactsPage: FC<{
  navigation: StackNavigationProp<RootStackParamList, 'Contacts'>;
  route: RouteProp<RootStackParamList, 'Contacts'>;
}> = ({navigation, route}) => {
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const contacts = useAppSelector(getContacts);
  const permissionGranted = useAppSelector(getPermissionsGranted);
  const loading = useAppSelector(getLoading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadContacts());
  }, []);

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

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

  const renderSearchBar = () => {
    return (
      <SearchBar
        round
        searchIcon={{size: 24}}
        onChangeText={(text: string) => searchFilterFunction(text)}
        onClear={() => searchFilterFunction('')}
        placeholder={'Type name here...'}
        value={search}
        lightTheme
      />
    );
  };

  const renderContactsList = () => {
    if (loading) {
      return (
        <View style={styles.mainActivityIndicatorContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    return (
      <FlatList
        data={filteredContacts}
        keyExtractor={(item: Contact) => item.recordID}
        renderItem={renderItem}
        keyboardDismissMode={'on-drag'}
      />
    );
  };

  const renderPermissionsNotGrantedMessage = () => {
    return (
      <SafeAreaView style={styles.pageContainer}>
        <View style={styles.permissionsNotGrantedMessageContainer}>
          <Text style={styles.permissionsNotGrantedMessageText}>
            {'Contacts access permissions not granted!'}
          </Text>
          <Button
            title={'Grant access'}
            onPress={() => dispatch(grantAccess())}
          />
        </View>
      </SafeAreaView>
    );
  };

  if (permissionGranted === false) {
    return renderPermissionsNotGrantedMessage();
  }

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        {renderSearchBar()}
        {renderContactsList()}
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
  mainActivityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  permissionsNotGrantedMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  permissionsNotGrantedMessageText: {
    paddingBottom: 10,
  },
});

export default ContactsPage;
