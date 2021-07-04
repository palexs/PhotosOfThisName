import {ThunkDispatch} from 'redux-thunk';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import store from './store';
import {Action as SearchAction} from './photos/types';
import {Action as ContactAction} from './contacts/types';

export interface Dependencies {
  Linking: typeof Linking;
  Contacts: typeof Contacts;
  PermissionsAndroid: typeof PermissionsAndroid;
  Platform: typeof Platform;
}

export type RootState = ReturnType<typeof store.getState>;
export type GetRootState = () => RootState;

type Action = SearchAction | ContactAction;

export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, Dependencies, Action>;
