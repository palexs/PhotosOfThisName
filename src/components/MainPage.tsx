import React, {FC, useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {Contact} from 'react-native-contacts';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';
import {search, loadMore, openURL} from '../store/search/actions';
import {
  getQuery,
  getFetching,
  getLoadingMore,
  getTotalPages,
  getError,
  getData,
  getSizedImageUrlForPhoto,
} from '../store/search/selectors';
import {Photo, PhotoSize} from '../store/search/types';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import PhotoItem from './ListItem';

const MainPage: FC<{
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}> = ({navigation}) => {
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);

  const query = useAppSelector(getQuery);
  const fetching = useAppSelector(getFetching);
  const data = useAppSelector(getData);
  const totalPages = useAppSelector(getTotalPages);
  const loadingMore = useAppSelector(getLoadingMore);
  const error = useAppSelector(getError);

  const didMount = useRef(false);

  const dispatch = useAppDispatch();

  const onSelectContact = (contact: Contact) => {
    setName(contact.givenName);
  };

  useEffect(() => {
    if (didMount.current) {
      if (!loadingMore && page <= totalPages) {
        dispatch(loadMore(page));
      }
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onItemPress = (item: Photo) => {
    const url = getSizedImageUrlForPhoto(item, PhotoSize.medium800);
    dispatch(openURL(url));
  };

  const renderItem = ({item}: {item: Photo}) => {
    return <PhotoItem item={item} onItemPress={onItemPress} />;
  };

  const onEndReached = () => {
    if (!fetching) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const onFetchPhotosPress = () => {
    setPage(1);
    dispatch(search(name));
  };

  const renderFooter = () => {
    if (!loadingMore || page >= totalPages || data.length === 0) {
      return null;
    }
    return (
      <View style={styles.fetchMoreActivityIndicatorContainer}>
        <ActivityIndicator animating size={'small'} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.noResultsText}>
          {query !== '' && data.length === 0 ? 'No results found.' : ''}
        </Text>
      </View>
    );
  };

  const renderInput = () => {
    return (
      <Input
        autoFocus
        containerStyle={{flex: 1}}
        autoCorrect={false}
        placeholder={'Type name here...'}
        leftIcon={
          <Icon
            name={'search-outline'}
            type={'ionicon'}
            size={24}
            color={'black'}
          />
        }
        value={name}
        onChangeText={text => setName(text)}
      />
    );
  };

  const renderContactsButton = () => {
    return (
      <Button
        style={styles.contactsButton}
        type={'clear'}
        icon={
          <Icon
            name={'contacts'}
            type={'material'}
            size={28}
            color={'rgb(22,137,220)'}
          />
        }
        onPress={() => {
          navigation.navigate('Contacts', {onSelectContact});
        }}
      />
    );
  };

  const renderFetchPhotosButton = () => {
    return (
      <Button
        style={styles.fetchPhotosButton}
        title={'Fetch Photos'}
        disabled={name === '' || fetching}
        onPress={onFetchPhotosPress}
      />
    );
  };

  const renderPhotosList = () => {
    if (error) {
      return (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{error.message}</Text>
        </View>
      );
    }
    if (fetching && data.length === 0) {
      return (
        <View style={styles.mainActivityIndicatorContainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }

    return (
      <FlatList
        style={styles.photosList}
        contentContainerStyle={{flexGrow: 1}}
        data={data}
        renderItem={renderItem}
        keyboardDismissMode={'on-drag'}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.inputSectionContainer}>
          {renderInput()}
          {renderContactsButton()}
        </View>
        {renderFetchPhotosButton()}
        {renderPhotosList()}
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
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  inputSectionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  contactsButton: {
    paddingTop: 5,
  },
  fetchPhotosButton: {
    paddingHorizontal: 20,
  },
  mainActivityIndicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  fetchMoreActivityIndicatorContainer: {
    position: 'relative',
    padding: 10,
  },
  photosList: {
    marginVertical: 10,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    color: 'gray',
    textAlign: 'center',
  },
  errorMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorMessageText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default MainPage;
