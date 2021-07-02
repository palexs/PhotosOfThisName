import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {RootState, Dependencies} from './store';
import {Action as SearchAction} from './search/types';
import {Action as ContactAction} from './contacts/types';

type Action = SearchAction | ContactAction;

export type AppDispatch = ThunkDispatch<RootState, Dependencies, Action>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
