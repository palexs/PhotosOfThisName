import {Action, ContactsState} from './types';
import {
  LOAD_CONTACTS_FAILURE,
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_SUCCESS,
  SET_PERMISSIONS_GRANTED,
} from './constants';

const initialState: ContactsState = {
  loading: false,
  contacts: [],
  permissionsGranted: null,
  error: null,
};

const reducer = (state: ContactsState = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_CONTACTS_START: {
      return {
        ...state,
        loading: true,
      };
    }
    case LOAD_CONTACTS_SUCCESS: {
      const {contacts} = action;
      return {
        ...state,
        contacts,
        loading: false,
      };
    }
    case LOAD_CONTACTS_FAILURE: {
      const {error} = action;
      return {
        ...state,
        error,
        loading: false,
      };
    }
    case SET_PERMISSIONS_GRANTED: {
      const {granted} = action;
      return {
        ...state,
        permissionsGranted: granted,
      };
    }
    default:
      return state;
  }
};

export default reducer;
