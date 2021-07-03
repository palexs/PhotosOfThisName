import {ActionCreator, Dispatch} from 'redux';
import {fetchPhotos} from '../../FlickrAPI';
import {AppDispatch, GetRootState, Dependencies} from '../types';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  TRACK_OPEN_URL,
} from './constants';
import {
  Action,
  LoadMoreFailure,
  LoadMoreStart,
  LoadMoreSuccess,
  PhotosResponse,
  SearchFailure,
  SearchStart,
  SearchSuccess,
  ThunkActionCreator,
  TrackOpenURL,
} from './types';

const searchStart: ActionCreator<SearchStart> = (name: string) => ({
  type: SEARCH_START,
  name,
});

const searchSuccess: ActionCreator<SearchSuccess> = (
  response: PhotosResponse,
) => ({
  type: SEARCH_SUCCESS,
  totalPages: response.pages,
  photos: response.photo,
});

const searchFailure: ActionCreator<SearchFailure> = (error: Error) => ({
  type: SEARCH_FAILURE,
  error,
});

const loadMoreStart: ActionCreator<LoadMoreStart> = () => ({
  type: LOAD_MORE_START,
});

const loadMoreSuccess: ActionCreator<LoadMoreSuccess> = (
  response: PhotosResponse,
) => ({type: LOAD_MORE_SUCCESS, photos: response.photo});

const loadMoreFailure: ActionCreator<LoadMoreFailure> = (error: Error) => ({
  type: LOAD_MORE_FAILURE,
  error,
});

const trackOpenURL: ActionCreator<TrackOpenURL> = (url: string) => ({
  type: TRACK_OPEN_URL,
  url,
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

export const loadMore: ThunkActionCreator =
  (page: number) => async (dispatch: AppDispatch, getState: GetRootState) => {
    dispatch(loadMoreStart());
    try {
      const state = getState();
      const response = await fetchPhotos(state.search.query, page);
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
    {Linking}: Dependencies,
  ) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
      dispatch(trackOpenURL(url));
    } else {
      console.warn(`Can't open URI: ${url}`);
    }
  };
