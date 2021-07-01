import {Action, SearchState} from './types';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
} from './constants';

const initialState: SearchState = {
  query: '',
  fetching: false,
  loadingMore: false,
  data: [],
  error: null,
  totalPages: 0,
};

const reducer = (state: SearchState = initialState, action: Action) => {
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
    default:
      return state;
  }
};

export default reducer;
