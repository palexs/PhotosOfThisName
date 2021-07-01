import {RootState} from '../store';

export const getContacts = (state: RootState) => state.contacts.contacts;

export const getPermissionsGranted = (state: RootState) =>
  state.contacts.permissionsGranted;

export const getLoading = (state: RootState) => state.contacts.loading;

export const getError = (state: RootState) => state.contacts.error;
