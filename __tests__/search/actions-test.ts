import fetchMock from 'jest-fetch-mock';
import getMockStore from '../helpers';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  TRACK_OPEN_URL,
} from '../../src/store/search/constants';
import {
  loadMoreFailure,
  loadMoreStart,
  loadMoreSuccess,
  openURL,
  search,
  searchFailure,
  searchStart,
  searchSuccess,
  trackOpenURL,
} from '../../src/store/search/actions';
import {PhotosResponse} from '../../src/store/search/types';
import {Linking} from 'react-native';

fetchMock.enableMocks();

describe('search action creators', () => {
  const response: PhotosResponse = {
    page: 1,
    pages: 10,
    perpage: 10,
    total: 100,
    photo: [],
  };

  const error = Error('Test error');

  it('searchStart', () => {
    expect.assertions(1);
    expect(searchStart()).toEqual({type: SEARCH_START});
  });

  it('searchSuccess', () => {
    expect.assertions(1);
    expect(searchSuccess(response)).toEqual({
      type: SEARCH_SUCCESS,
      totalPages: 10,
      photos: [],
    });
  });

  it('searchFailure', () => {
    expect.assertions(1);
    expect(searchFailure(error)).toEqual({type: SEARCH_FAILURE, error});
  });

  it('loadMoreStart', () => {
    expect.assertions(1);
    expect(loadMoreStart()).toEqual({type: LOAD_MORE_START});
  });

  it('loadMoreSuccess', () => {
    expect.assertions(1);
    expect(loadMoreSuccess(response)).toEqual({
      type: LOAD_MORE_SUCCESS,
      photos: [],
    });
  });

  it('loadMoreFailure', () => {
    expect.assertions(1);
    expect(loadMoreFailure(error)).toEqual({type: LOAD_MORE_FAILURE, error});
  });

  it('trackOpenURL', () => {
    expect.assertions(1);
    const url = 'https://test.com/';
    expect(trackOpenURL(url)).toEqual({type: TRACK_OPEN_URL, url});
  });
});

describe('search thunk action', () => {
  describe('search', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it('success', () => {
      expect.assertions(1);
      fetchMock.mockResponse(
        JSON.stringify({stat: 'ok', photos: {pages: 1, photo: []}}),
      );

      const store = getMockStore({});
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_SUCCESS, totalPages: 1, photos: []},
        ]);
      });
    });

    it('failure - status fail', () => {
      expect.assertions(1);
      fetchMock.mockResponse(JSON.stringify({stat: 'fail', photos: {}}));

      const expectedError = Error('Unknown error occurred.');

      const store = getMockStore({});
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });

    it('failure - status code 500', () => {
      expect.assertions(1);
      fetchMock.mockResponse('', {status: 500});

      const expectedError = Error('Data is unavailable. Response status: 500');

      const store = getMockStore({});
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });

    it('failure - error', () => {
      expect.assertions(1);
      const expectedError = Error('Server error.');
      fetchMock.mockReject(expectedError);

      const store = getMockStore({});
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });
  });
});

describe('openURL thunk action', () => {
  it('supports URL', () => {
    expect.assertions(1);
    const url = 'https://test.com';

    const store = getMockStore({
      Linking: {
        canOpenURL: jest.fn(() => Promise.resolve(true)),
        openURL: jest.fn(() => Promise.resolve()),
      },
    });
    return store.dispatch(openURL(url)).then(() => {
      expect(store.getActions()).toEqual([{type: TRACK_OPEN_URL, url}]);
    });
  });

  it('does not support URL', () => {
    expect.assertions(1);
    const url = 'https://test.com';

    const store = getMockStore({
      Linking: {
        canOpenURL: jest.fn(() => Promise.resolve(false)),
      },
    });
    return store.dispatch(openURL(url)).then(() => {
      expect(store.getActions()).toEqual([]);
    });
  });
});
