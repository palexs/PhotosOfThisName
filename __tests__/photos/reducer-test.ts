import reducer from '../../src/store/photos/reducer';
import {
  SEARCH_START,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  LOAD_MORE_START,
  LOAD_MORE_SUCCESS,
  LOAD_MORE_FAILURE,
  GET_LOCATION_START,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILURE,
} from '../../src/store/photos/constants';
import {Action, Photo} from '../../src/store/photos/types';

describe('photos reducer', () => {
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
      locations: {},
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: true,
      loadingMore: false,
      data: [],
      locations: {},
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
      locations: {},
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [photo1],
      locations: {},
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
      locations: {},
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {},
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
      locations: {},
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [],
      locations: {},
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
      locations: {},
      error: null,
      totalPages: 10,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [photo1, photo2],
      locations: {},
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
      locations: {},
      error: null,
      totalPages: 10,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {},
      error: error,
      totalPages: 10,
    };
    const action: Action = {type: LOAD_MORE_FAILURE, error};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('GET_LOCATION_START case', () => {
    expect.assertions(1);

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {},
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {
        '12345': {
          loading: true,
          country: null,
          error: null,
        },
      },
      error: null,
      totalPages: 0,
    };
    const action: Action = {type: GET_LOCATION_START, photoID: '12345'};
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('GET_LOCATION_SUCCESS case', () => {
    expect.assertions(1);

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {
        '12345': {
          loading: true,
          country: null,
          error: null,
        },
      },
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {
        '12345': {
          loading: false,
          country: 'Ukraine',
          error: null,
        },
      },
      error: null,
      totalPages: 0,
    };
    const action: Action = {
      type: GET_LOCATION_SUCCESS,
      photoID: '12345',
      country: 'Ukraine',
    };
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('GET_LOCATION_FAILURE case', () => {
    expect.assertions(1);
    const error = Error('Photo has no location information.');

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {
        '12345': {
          loading: true,
          country: null,
          error: null,
        },
      },
      error: null,
      totalPages: 0,
    };
    const expectedState = {
      query: 'test',
      fetching: false,
      loadingMore: false,
      data: [],
      locations: {
        '12345': {
          loading: false,
          country: null,
          error,
        },
      },
      error: null,
      totalPages: 0,
    };
    const action: Action = {
      type: GET_LOCATION_FAILURE,
      photoID: '12345',
      error,
    };
    const outputState = reducer(inputState, action);
    expect(outputState).toEqual(expectedState);
  });

  it('DEFAULT case', () => {
    expect.assertions(1);

    const inputState = {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [],
      locations: {},
      error: null,
      totalPages: 10,
    };
    // @ts-ignore
    const outputState = reducer(inputState, {type: 'SOME_OTHER_ACTION'});
    expect(outputState).toEqual(inputState);
  });
});
