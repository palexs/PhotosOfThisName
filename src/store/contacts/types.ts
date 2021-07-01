import {Contact} from 'react-native-contacts';
import {
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_SUCCESS,
  LOAD_CONTACTS_FAILURE,
  SET_PERMISSIONS_GRANTED,
} from './constants';

export interface ContactsState {
  loading: boolean;
  contacts: Contact[];
  permissionsGranted: boolean | null;
  error: Error | null;
}

interface LoadContactsStart {
  type: typeof LOAD_CONTACTS_START;
}

interface LoadContactsSuccess {
  type: typeof LOAD_CONTACTS_SUCCESS;
  contacts: Contact[];
}

interface LoadContactsFailure {
  type: typeof LOAD_CONTACTS_FAILURE;
  error: Error;
}

interface SetPermissionsGranted {
  type: typeof SET_PERMISSIONS_GRANTED;
  granted: boolean;
}

export type Action =
  | LoadContactsStart
  | LoadContactsSuccess
  | LoadContactsFailure
  | SetPermissionsGranted;
