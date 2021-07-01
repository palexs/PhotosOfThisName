import fetchMock from 'jest-fetch-mock';
import getMockStore from '../helpers';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
} from '../../src/store/search/constants';
import {search} from '../../src/store/search/actions';

fetchMock.enableMocks();

describe('search actions', () => {
  describe('search', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it('success', () => {
      fetchMock.mockResponse(
        JSON.stringify({stat: 'ok', photos: {pages: 1, photo: []}}),
      );

      expect.assertions(1);

      const store = getMockStore({});
      // @ts-ignore
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_SUCCESS, totalPages: 1, photos: []},
        ]);
      });
    });

    it('failure - status fail', () => {
      fetchMock.mockResponse(JSON.stringify({stat: 'fail', photos: {}}));

      const expectedError = Error('Unknown error occurred.');

      expect.assertions(1);

      const store = getMockStore({});
      // @ts-ignore
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });

    it('failure - status code 500', () => {
      fetchMock.mockResponse('', {status: 500});

      const expectedError = Error('Data is unavailable. Response status: 500');

      expect.assertions(1);

      const store = getMockStore({});
      // @ts-ignore
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });

    it('failure - error', () => {
      const expectedError = Error('Server error.');
      fetchMock.mockReject(expectedError);

      expect.assertions(1);

      const store = getMockStore({});
      // @ts-ignore
      return store.dispatch(search('test')).then(() => {
        expect(store.getActions()).toEqual([
          {type: SEARCH_START, name: 'test'},
          {type: SEARCH_FAILURE, error: expectedError},
        ]);
      });
    });
  });
});
