import {fetchPhotos} from '../../FlickrAPI';
import {AppDispatch, GetRootState, Dependencies} from '../store';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  TRACK_OPEN_URL,
} from './constants';

export const search = (name: string) => async (dispatch: AppDispatch) => {
  dispatch({type: SEARCH_START, name});
  try {
    const response = await fetchPhotos(name, 1);
    dispatch({
      type: SEARCH_SUCCESS,
      totalPages: response.pages,
      photos: response.photo,
    });
  } catch (error) {
    dispatch({type: SEARCH_FAILURE, error});
  }
};

export const loadMore =
  (page: number) => async (dispatch: AppDispatch, getState: GetRootState) => {
    dispatch({type: LOAD_MORE_START});
    try {
      const state = getState();
      const response = await fetchPhotos(state.search.query, page);
      dispatch({type: LOAD_MORE_SUCCESS, photos: response.photo});
    } catch (error) {
      dispatch({type: LOAD_MORE_FAILURE, error});
    }
  };

export const openURL =
  (url: string) =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Linking}: Dependencies,
  ) => {
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) {
      await Linking.openURL(url);
      dispatch({type: TRACK_OPEN_URL, url});
    } else {
      console.warn(`Can't open URI: ${url}`);
    }
  };
