import {Photo, PhotoSize, PhotoLocation} from './types';
import {RootState} from '../types';

export const getQuery = (state: RootState) => state.photos.query;

export const getFetching = (state: RootState) => state.photos.fetching;

export const getData = (state: RootState) => state.photos.data;

export const getTotalPages = (state: RootState) => state.photos.totalPages;

export const getLoadingMore = (state: RootState) => state.photos.loadingMore;

export const getError = (state: RootState) => state.photos.error;

export const getPhotoLocation = (state: RootState, photoID: string) =>
  (state.photos.locations as {[photoID: string]: PhotoLocation})[photoID];

export const getSizedImageUrlForPhoto = (
  photo: Photo,
  size: PhotoSize = PhotoSize.small240,
) => {
  return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
};
