import reducer from '../../src/store/search/reducer';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
} from '../../src/store/search/constants';
import {Action, Photo} from '../../src/store/search/types';

describe('search reducer', () => {
  const photo1: Photo = {
    id: 'id1',
    owner: 'owner1',
    secret: 'secret1',
    server: 'server1',
    farm: 1,
    title: 'title1',
    ispublic: 1,
    isfriend: 0,
    isfamily: 0,
  };

  const photo2: Photo = {
    id: 'id2',
    owner: 'owner2',
    secret: 'secret2',
    server: 'server2',
    farm: 2,
    title: 'title2',
    ispublic: 1,
    isfriend: 0,
    isfamily: 0,
  };

  it('SEARCH_START case', () => {
    expect.assertions(1);

    const inputState = {
      query: '',
      fetching: false,
      loadingMore: false,
      data: [],
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: true,
      loadingMore: false,
      data: [],
      error: null,
      totalPages: 0,
    };
    const action: Action = {type: SEARCH_START, name: 'test'};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('SEARCH_SUCCESS case', () => {
    expect.assertions(1);
    const inputState = {
      query: 'test',
      fetching: true,
      loadingMore: false,
      data: [],
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [photo1],
      error: null,
      totalPages: 10,
    };
    const action: Action = {
      type: SEARCH_SUCCESS,
      photos: [photo1],
      totalPages: 10,
    };
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('SEARCH_FAILURE case', () => {
    expect.assertions(1);

    const error = Error('Test error');

    const inputState = {
      query: 'test',
      fetching: true,
      loadingMore: false,
      data: [],
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      error: error,
      totalPages: 0,
    };
    const action: Action = {type: SEARCH_FAILURE, error};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('LOAD_MORE_START case', () => {
    expect.assertions(1);

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [],
      error: null,
      totalPages: 0,
    };
    const action: Action = {type: LOAD_MORE_START};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('LOAD_MORE_SUCCESS case', () => {
    expect.assertions(1);
    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [photo1],
      error: null,
      totalPages: 10,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [photo1, photo2],
      error: null,
      totalPages: 10,
    };
    const action: Action = {
      type: LOAD_MORE_SUCCESS,
      photos: [photo2],
    };
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('LOAD_MORE_FAILURE case', () => {
    expect.assertions(1);

    const error = Error('Test error');

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [],
      error: null,
      totalPages: 10,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      error: error,
      totalPages: 10,
    };
    const action: Action = {type: LOAD_MORE_FAILURE, error};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });
});
