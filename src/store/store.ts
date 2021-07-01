import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import Contacts from 'react-native-contacts';
import searchReducer from './search/reducer';
import contactsReducer from './contacts/reducer';

export interface Dependencies {
  Linking: typeof Linking;
  Contacts: typeof Contacts;
  PermissionsAndroid: typeof PermissionsAndroid;
  Platform: typeof Platform;
}

const dependencies = {
  Linking,
  Contacts,
  PermissionsAndroid,
  Platform,
};

const middlewares: any[] = [thunk.withExtraArgument(dependencies)];
if (__DEV__) {
  middlewares.push(logger);
}

const store = createStore(
  combineReducers({
    contacts: contactsReducer,
    search: searchReducer,
  }),
  applyMiddleware(...middlewares),
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type GetRootState = () => RootState;

export default store;
