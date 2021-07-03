import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from './types';
import {RootState} from '../store/types';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
