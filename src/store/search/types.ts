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
  TRACK_OPEN_URL,
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

export interface SearchState {
  query: string;
  fetching: boolean;
  loadingMore: boolean;
  data: Photo[];
  error: Error | null;
  totalPages: number;
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

export interface TrackOpenURL {
  type: typeof TRACK_OPEN_URL;
}

export type Action =
  | SearchStart
  | SearchSuccess
  | SearchFailure
  | LoadMoreStart
  | LoadMoreSuccess
  | LoadMoreFailure
  | TrackOpenURL;

export type ThunkActionCreator = ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
>;
