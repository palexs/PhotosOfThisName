import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {RootState, AppDispatch} from '../src/store/types';

const getMockStore = ({state = {}, ...extraArguments}: any) => {
  const middlewares = [thunk.withExtraArgument(extraArguments)];
  return configureMockStore<RootState, AppDispatch>(middlewares)(state);
};

export default getMockStore;
