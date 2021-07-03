import {Photo, PhotoSize} from './types';
import {RootState} from '../types';

export const getQuery = (state: RootState) => state.search.query;

export const getFetching = (state: RootState) => state.search.fetching;

export const getData = (state: RootState) => state.search.data;

export const getTotalPages = (state: RootState) => state.search.totalPages;

export const getLoadingMore = (state: RootState) => state.search.loadingMore;

export const getError = (state: RootState) => state.search.error;

export const getSizedImageUrlForPhoto = (
  photo: Photo,
  size: PhotoSize = PhotoSize.small240,
) => {
  return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
};
