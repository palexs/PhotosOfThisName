import {Action, PhotosState} from './types';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
  GET_LOCATION_START,
} from './constants';

const initialState: PhotosState = {
  query: '',
  fetching: false,
  loadingMore: false,
  data: [],
  error: null,
  totalPages: 0,
  locations: {},
};

const reducer = (state: PhotosState = initialState, action: Action) => {
  switch (action.type) {
    case SEARCH_START: {
      const {name} = action;
      return {
        ...state,
        query: name,
        fetching: true,
        data: [],
        totalPages: 0,
        error: null,
        locations: {},
      };
    }
    case SEARCH_SUCCESS: {
      const {photos, totalPages} = action;
      return {
        ...state,
        data: photos,
        totalPages,
        fetching: false,
      };
    }
    case SEARCH_FAILURE: {
      const {error} = action;
      return {
        ...state,
        fetching: false,
        data: [],
        locations: {},
        error,
      };
    }
    case LOAD_MORE_START: {
      return {
        ...state,
        loadingMore: true,
        error: null,
      };
    }
    case LOAD_MORE_SUCCESS: {
      const {photos} = action;
      return {
        ...state,
        loadingMore: false,
        data: [...state.data, ...photos],
      };
    }
    case LOAD_MORE_FAILURE: {
      const {error} = action;
      return {
        ...state,
        loadingMore: false,
        data: [],
        error,
      };
    }
    case GET_LOCATION_START: {
      const {photoID} = action;
      return {
        ...state,
        locations: {
          ...state.locations,
          [photoID]: {
            loading: true,
            error: null,
            country: null,
          },
        },
      };
    }
    case GET_LOCATION_SUCCESS: {
      const {photoID, country} = action;
      return {
        ...state,
        locations: {
          ...state.locations,
          [photoID]: {
            loading: false,
            country,
            error: null,
          },
        },
      };
    }
    case GET_LOCATION_FAILURE: {
      const {photoID, error} = action;
      return {
        ...state,
        locations: {
          ...state.locations,
          [photoID]: {
            loading: false,
            country: null,
            error,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
