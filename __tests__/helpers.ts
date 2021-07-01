import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const getMockStore = ({state = {}, ...extraArguments}: {state?: any}) => {
  const middlewares = [thunk.withExtraArgument(extraArguments)];
  return configureMockStore(middlewares)(state);
};

export default getMockStore;
