import {ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {Dependencies, RootState} from '../types';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  GET_LOCATION_START,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  TRACK_OPEN_URL,
  TRACK_OPEN_URL_FAILURE,
} from './constants';

type NumericBool = 0 | 1;

export interface Photo {
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

export interface PhotosResponse {
  page: number;
  pages: number;
  perpage: number;
  total: number;
  photo: Photo[];
}

export interface PhotoLocationResponse {
  id: string;
  location: {
    latitude: string;
    longitude: string;
    accuracy: string;
    context: string;
    locality: {
      _content: string;
    };
    county: {
      _content: string;
    };
    region: {
      _content: string;
    };
    country: {
      _content: string;
    };
    neighbourhood: {
      _content: string;
    };
  };
}

export enum PhotoSize {
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

export interface PhotoLocation {
  loading: boolean;
  country: string | null;
  error: Error | null;
}

export interface PhotosState {
  query: string;
  fetching: boolean;
  loadingMore: boolean;
  data: Photo[];
  error: Error | null;
  totalPages: number;
  locations:
    | {
        [photoID: string]: PhotoLocation;
      }
    | {};
}

export interface SearchStart {
  type: typeof SEARCH_START;
  name: string;
}

export interface SearchSuccess {
  type: typeof SEARCH_SUCCESS;
  totalPages: number;
  photos: Photo[];
}

export interface SearchFailure {
  type: typeof SEARCH_FAILURE;
  error: Error;
}

export interface LoadMoreStart {
  type: typeof LOAD_MORE_START;
}

export interface LoadMoreSuccess {
  type: typeof LOAD_MORE_SUCCESS;
  photos: Photo[];
}

export interface LoadMoreFailure {
  type: typeof LOAD_MORE_FAILURE;
  error: Error;
}

export interface GetLocationStart {
  type: typeof GET_LOCATION_START;
  photoID: string;
}

export interface GetLocationSuccess {
  type: typeof GET_LOCATION_SUCCESS;
  country: string;
  photoID: string;
}

export interface GetLocationFailure {
  type: typeof GET_LOCATION_FAILURE;
  error: Error;
  photoID: string;
}

export interface TrackOpenURL {
  type: typeof TRACK_OPEN_URL;
}

export interface TrackOpenURLFailure {
  type: typeof TRACK_OPEN_URL_FAILURE;
  error: Error;
}

export type Action =
  | SearchStart
  | SearchSuccess
  | SearchFailure
  | LoadMoreStart
  | LoadMoreSuccess
  | LoadMoreFailure
  | GetLocationStart
  | GetLocationSuccess
  | GetLocationFailure
  | TrackOpenURL
  | TrackOpenURLFailure;

export type ThunkActionCreator = ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
>;
