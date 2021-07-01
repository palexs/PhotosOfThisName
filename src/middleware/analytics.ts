import {Middleware} from 'redux';
import {RootState} from '../store/store';

const analytics = (): Middleware<{}, RootState> => {
  return store => next => action => {
    // TODO: Track actions here
    return next(action);
  };
};

export default analytics;
