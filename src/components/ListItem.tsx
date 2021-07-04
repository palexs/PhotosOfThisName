import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {Photo, PhotoSize} from '../store/photos/types';
import {getLocation} from '../store/photos/actions';
import {Icon, Image, ListItem} from 'react-native-elements';
import {
  getSizedImageUrlForPhoto,
  getPhotoLocation,
} from '../store/photos/selectors';
import {useAppDispatch, useAppSelector} from '../store/hooks';

const PhotoItem: FC<{
  item: Photo;
  onItemPress: (item: Photo) => void;
}> = ({item, onItemPress}) => {
  const location = useAppSelector(state => getPhotoLocation(state, item.id));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLocation(item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTitle = () => {
    return <ListItem.Title>{item.title}</ListItem.Title>;
  };

  const renderUserInfo = () => {
    return (
      <View style={styles.subtitleContainer}>
        <Icon
          style={styles.icon}
          name={'person-outline'}
          type={'ionicon'}
          size={16}
          color={'black'}
        />
        <ListItem.Subtitle>{item.owner}</ListItem.Subtitle>
      </View>
    );
  };

  const renderLocationInfo = () => {
    if (location) {
      if (location.loading) {
        return (
          <ActivityIndicator
            style={{transform: [{scale: 0.7}]}}
            animating
            size={'small'}
          />
        );
      }
      if (location.country) {
        return (
          <View style={styles.subtitleContainer}>
            <Icon
              style={styles.icon}
              name={'location-outline'}
              type={'ionicon'}
              size={16}
              color={'black'}
            />
            <ListItem.Subtitle>{location.country}</ListItem.Subtitle>
          </View>
        );
      }
    }
    return <View style={styles.subtitleContainer} />;
  };

  return (
    <ListItem
      key={item.id}
      bottomDivider
      style={styles.listItem}
      onPress={() => onItemPress(item)}>
      <Image
        style={styles.thumbnailImage}
        source={{
          uri: getSizedImageUrlForPhoto(item, PhotoSize.small240),
        }}
      />
      <ListItem.Content>
        {renderTitle()}
        {renderUserInfo()}
        {renderLocationInfo()}
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginHorizontal: 10,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
  },
  subtitleContainer: {
    flexDirection: 'row',
    height: 20,
  },
  icon: {
    paddingRight: 5,
  },
});

export default PhotoItem;
