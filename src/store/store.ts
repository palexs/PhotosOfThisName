import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import Contacts from 'react-native-contacts';
import searchReducer from './search/reducer';
import contactsReducer from './contacts/reducer';
import analyticsMiddleware from '../middleware/analytics';
import {Dependencies} from './types';

const dependencies: Dependencies = {
  Linking,
  Contacts,
  PermissionsAndroid,
  Platform,
};

const middlewares: any[] = [
  thunk.withExtraArgument(dependencies),
  analyticsMiddleware(),
];
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

export default store;
