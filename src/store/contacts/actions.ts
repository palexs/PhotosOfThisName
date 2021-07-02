import {ActionCreator, Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {AppDispatch, Dependencies, GetRootState, RootState} from '../store';
import {
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_SUCCESS,
  LOAD_CONTACTS_FAILURE,
  SET_PERMISSIONS_GRANTED,
  TRACK_GRANT_ACCESS,
} from './constants';
import {Action} from './types';

export const loadContacts: ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
> =
  () =>
  async (
    dispatch: Dispatch<any>,
    getState: GetRootState,
    {Platform}: Dependencies,
  ) => {
    if (Platform.OS === 'android') {
      dispatch(loadContactsAndroid());
    } else {
      dispatch(loadContactsIOS());
    }
  };

const loadContactsIOS: ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
> =
  () =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Contacts}: Dependencies,
  ) => {
    dispatch({type: LOAD_CONTACTS_START});
    const permissionStatus = await Contacts.requestPermission();
    if (permissionStatus === 'authorized') {
      try {
        const contacts = await Contacts.getAll();
        dispatch({type: LOAD_CONTACTS_SUCCESS, contacts});
      } catch (error) {
        dispatch({type: LOAD_CONTACTS_FAILURE, error});
      }
      dispatch({type: SET_PERMISSIONS_GRANTED, granted: true});
    } else {
      dispatch({type: SET_PERMISSIONS_GRANTED, granted: false});
    }
  };

const loadContactsAndroid: ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
> =
  () =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Contacts, PermissionsAndroid}: Dependencies,
  ) => {
    dispatch({type: LOAD_CONTACTS_START});
    const permissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts',
        message: 'This app would like to access your contacts.',
        buttonPositive: 'Grant access',
      },
    );
    if (permissionStatus === 'granted') {
      try {
        const contacts = await Contacts.getAll();
        dispatch({type: LOAD_CONTACTS_SUCCESS, contacts});
      } catch (error) {
        dispatch({type: LOAD_CONTACTS_FAILURE, error});
      }
      dispatch({type: SET_PERMISSIONS_GRANTED, granted: true});
    } else {
      dispatch({type: SET_PERMISSIONS_GRANTED, granted: false});
    }
  };

export const grantAccess: ActionCreator<
  ThunkAction<Promise<void>, RootState, Dependencies, Action>
> =
  () =>
  async (
    dispatch: Dispatch<any>,
    getState: GetRootState,
    {Linking}: Dependencies,
  ) => {
    await Linking.openSettings();
    dispatch({type: TRACK_GRANT_ACCESS});
  };
