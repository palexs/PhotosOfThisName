import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {RootState} from '../src/store/store';
import {AppDispatch} from '../src/store/hooks';

const getMockStore = ({state = {}, ...extraArguments}: {state?: any}) => {
  const middlewares = [thunk.withExtraArgument(extraArguments)];
  return configureMockStore<RootState, AppDispatch>(middlewares)(state);
};

export default getMockStore;
