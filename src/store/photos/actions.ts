import {ActionCreator, Dispatch} from 'redux';
import {fetchPhotos, fetchPhotoLocation} from '../../FlickrAPI';
import {AppDispatch, GetRootState, Dependencies} from '../types';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  TRACK_OPEN_URL,
  GET_LOCATION_START,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  TRACK_OPEN_URL_FAILURE,
} from './constants';
import {
  Action,
  GetLocationFailure,
  GetLocationStart,
  GetLocationSuccess,
  LoadMoreFailure,
  LoadMoreStart,
  LoadMoreSuccess,
  PhotoLocationResponse,
  PhotosResponse,
  SearchFailure,
  SearchStart,
  SearchSuccess,
  ThunkActionCreator,
  TrackOpenURL,
  TrackOpenURLFailure,
} from './types';
import {getQuery} from './selectors';

export const searchStart: ActionCreator<SearchStart> = (name: string) => ({
  type: SEARCH_START,
  name,
});

export const searchSuccess: ActionCreator<SearchSuccess> = (
  response: PhotosResponse,
) => ({
  type: SEARCH_SUCCESS,
  totalPages: response.pages,
  photos: response.photo,
});

export const searchFailure: ActionCreator<SearchFailure> = (error: Error) => ({
  type: SEARCH_FAILURE,
  error,
});

export const loadMoreStart: ActionCreator<LoadMoreStart> = () => ({
  type: LOAD_MORE_START,
});

export const loadMoreSuccess: ActionCreator<LoadMoreSuccess> = (
  response: PhotosResponse,
) => ({type: LOAD_MORE_SUCCESS, photos: response.photo});

export const loadMoreFailure: ActionCreator<LoadMoreFailure> = (
  error: Error,
) => ({
  type: LOAD_MORE_FAILURE,
  error,
});

export const getLocationStart: ActionCreator<GetLocationStart> = (
  photoID: string,
) => ({
  type: GET_LOCATION_START,
  photoID,
});

export const getLocationSuccess: ActionCreator<GetLocationSuccess> = (
  response: PhotoLocationResponse,
  photoID: string,
) => ({
  type: GET_LOCATION_SUCCESS,
  country: response.location.country._content,
  photoID,
});

export const getLocationError: ActionCreator<GetLocationFailure> = (
  error: Error,
  photoID: string,
) => ({
  type: GET_LOCATION_FAILURE,
  error,
  photoID,
});

export const trackOpenURL: ActionCreator<TrackOpenURL> = (url: string) => ({
  type: TRACK_OPEN_URL,
  url,
});

export const trackOpenURLFailure: ActionCreator<TrackOpenURLFailure> = (
  error: Error,
) => ({
  type: TRACK_OPEN_URL_FAILURE,
  error,
});

export const search: ThunkActionCreator =
  (name: string) => async (dispatch: Dispatch<Action>) => {
    dispatch(searchStart(name));
    try {
      const response = await fetchPhotos(name, 1);
      dispatch(searchSuccess(response));
    } catch (error) {
      dispatch(searchFailure(error));
    }
  };

export const getLocation: ThunkActionCreator =
  (photoID: string) => async (dispatch: Dispatch<Action>) => {
    dispatch(getLocationStart(photoID));
    try {
      const response = await fetchPhotoLocation(photoID);
      dispatch(getLocationSuccess(response, photoID));
    } catch (error) {
      dispatch(getLocationError(error, photoID));
    }
  };

export const loadMore: ThunkActionCreator =
  (page: number) => async (dispatch: AppDispatch, getState: GetRootState) => {
    dispatch(loadMoreStart());
    try {
      const state = getState();
      const response = await fetchPhotos(getQuery(state), page);
      dispatch(loadMoreSuccess(response));
    } catch (error) {
      dispatch(loadMoreFailure(error));
    }
  };

export const openURL: ThunkActionCreator =
  (url: string) =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Linking, Alert}: Dependencies,
  ) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      try {
        await Linking.openURL('url');
        dispatch(trackOpenURL(url));
      } catch (error) {
        dispatch(trackOpenURLFailure(error));
      }
    } else {
      Alert.alert('URI not supported', `Can't open URI: ${url}`, [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
    }
  };
