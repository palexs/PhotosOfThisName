import {Dispatch} from 'redux';
import {AppDispatch, Dependencies, GetRootState} from '../types';
import {
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_SUCCESS,
  LOAD_CONTACTS_FAILURE,
  SET_PERMISSIONS_GRANTED,
  TRACK_GRANT_ACCESS,
} from './constants';
import {ThunkActionCreator} from './types';

export const loadContacts: ThunkActionCreator =
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

const loadContactsIOS: ThunkActionCreator =
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

const loadContactsAndroid: ThunkActionCreator =
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

export const grantAccess: ThunkActionCreator =
  () =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Linking}: Dependencies,
  ) => {
    await Linking.openSettings();
    dispatch({type: TRACK_GRANT_ACCESS});
  };
