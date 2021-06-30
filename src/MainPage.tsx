import React, {FC, useState, useRef, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Button, Icon, Input, ListItem, Image} from 'react-native-elements';
import {Contact} from 'react-native-contacts';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from './App';

const API_KEY = 'e9ed25c3cad22a3ab90a4a1c15dc9dec';

enum PhotoSize {
  thumbnail75 = 's',
  thumbnail100 = 't',
  thumbnail150 = 'q',
  small240 = 'm',
  small320 = 'n',
  small400 = 'w',
  medium800 = 'c',
  large1024 = 'b',
  large1600 = 'h',
  large2048 = 'k',
}

type NumericBool = 0 | 1;

interface Photo {
  id: string;
  owner: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  ispublic: NumericBool;
  isfriend: NumericBool;
  isfamily: NumericBool;
}

const MainPage: FC<{
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}> = ({navigation}) => {
  const [name, setName] = useState('');
  const [data, setData] = useState<Photo[]>([]);
  const [fetching, setFetching] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const didMount = useRef(false);
  const totalPages = useRef(0);
  const inputRef = useRef(null);

  const onSelectContact = (contact: Contact) => {
    setName(contact.givenName);
  };

  const fetchPhotos = useCallback(
    async (isInitialSearch: boolean = false) => {
      // ReactDOM.unstable_batchedUpdates(() => {});
      setFetching(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${name}&format=json&page=${
            isInitialSearch ? 1 : page
          }&nojsoncallback=1`,
        );
        if (response.status !== 200) {
          // ReactDOM.unstable_batchedUpdates(() => {});
          setData([]);
          setFetching(false);
          setError(
            Error(`Data is unavailable. Response status: ${response.status}`),
          );
          return;
        }

        const jsonData = await response.json();
        const {stat, photos} = jsonData;
        if (stat === 'ok') {
          totalPages.current = photos.pages;
          if (photos.total > 0) {
            setData(prevData =>
              isInitialSearch ? photos.photo : [...prevData, ...photos.photo],
            );
          }
        } else {
          // ReactDOM.unstable_batchedUpdates(() => {});
          setData([]);
          setError(Error(jsonData.message || 'Unknown error occurred.'));
        }
        setFetching(false);
      } catch (err) {
        // ReactDOM.unstable_batchedUpdates(() => {});
        setData([]);
        setFetching(false);
        setError(err);
      }
    },
    [name, page],
  );

  useEffect(() => {
    if (inputRef && inputRef.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (didMount.current) {
      if (!fetching && page <= totalPages.current) {
        fetchPhotos();
      }
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const getSizedImageUrlForPhoto = (
    photo: Photo,
    size: PhotoSize = PhotoSize.small240,
  ) => {
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
  };

  const onItemPress = async (item: Photo) => {
    const url = getSizedImageUrlForPhoto(item, PhotoSize.medium800);
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
    } else {
      console.warn(`Can't open URI: ${url}`);
    }
  };

  const renderItem = ({item, index}: {item: Photo; index: number}) => {
    return (
      <ListItem
        key={item.id}
        bottomDivider
        style={{marginHorizontal: 10}}
        onPress={() => onItemPress(item)}>
        <Image
          style={styles.thumbnailImage}
          source={{
            uri: getSizedImageUrlForPhoto(item, PhotoSize.small240),
          }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>{index}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  const onEndReached = () => {
    if (!fetching) {
      // ReactDOM.unstable_batchedUpdates(() => {});
      setPage(prevPage => prevPage + 1);
      setFetchingMore(true);
    }
  };

  const onFetchPhotosPress = async () => {
    // ReactDOM.unstable_batchedUpdates(() => {});
    setPage(1);
    setData([]);
    await fetchPhotos(true);
  };

  const renderFooter = () => {
    if (!fetchingMore || page >= totalPages.current || data.length === 0) {
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
          {didMount.current ? 'No results found.' : ''}
        </Text>
      </View>
    );
  };

  const renderInput = () => {
    return (
      <Input
        ref={inputRef}
        containerStyle={{flex: 1}}
        autoCorrect={false}
        placeholder={'Type name here...'}
        leftIcon={
          <Icon
            name={'person-outline'}
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
  thumbnailImage: {
    width: 60,
    height: 60,
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
