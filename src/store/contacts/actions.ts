import {ActionCreator, Dispatch} from 'redux';
import {Contact} from 'react-native-contacts';
import {AppDispatch, Dependencies, GetRootState} from '../types';
import {
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_SUCCESS,
  LOAD_CONTACTS_FAILURE,
  SET_PERMISSIONS_GRANTED,
  TRACK_GRANT_ACCESS,
} from './constants';
import {
  LoadContactsFailure,
  LoadContactsStart,
  LoadContactsSuccess,
  SetPermissionsGranted,
  ThunkActionCreator,
  TrackGrantAccess,
} from './types';

const loadContactsStart: ActionCreator<LoadContactsStart> = () => ({
  type: LOAD_CONTACTS_START,
});

const loadContactsSuccess: ActionCreator<LoadContactsSuccess> = (
  contacts: Contact[],
) => ({
  type: LOAD_CONTACTS_SUCCESS,
  contacts,
});

const loadContactsFailure: ActionCreator<LoadContactsFailure> = (
  error: Error,
) => ({type: LOAD_CONTACTS_FAILURE, error});

const setPermissionsGranted: ActionCreator<SetPermissionsGranted> = (
  granted: boolean,
) => ({
  type: SET_PERMISSIONS_GRANTED,
  granted,
});

const trackGrantAccess: ActionCreator<TrackGrantAccess> = () => ({
  type: TRACK_GRANT_ACCESS,
});

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
    dispatch(loadContactsStart());
    const permissionStatus = await Contacts.requestPermission();
    if (permissionStatus === 'authorized') {
      try {
        const contacts = await Contacts.getAll();
        dispatch(loadContactsSuccess(contacts));
      } catch (error) {
        dispatch(loadContactsFailure());
      }
      dispatch(setPermissionsGranted(true));
    } else {
      dispatch(setPermissionsGranted(false));
    }
  };

const loadContactsAndroid: ThunkActionCreator =
  () =>
  async (
    dispatch: AppDispatch,
    getState: GetRootState,
    {Contacts, PermissionsAndroid}: Dependencies,
  ) => {
    dispatch(loadContactsStart());
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
        dispatch(loadContactsSuccess(contacts));
      } catch (error) {
        dispatch(loadContactsFailure(error));
      }
      dispatch(setPermissionsGranted(true));
    } else {
      dispatch(setPermissionsGranted(false));
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
    dispatch(trackGrantAccess());
  };
