import React from 'react';
import renderer from 'react-test-renderer';
import getMockStore from '../helpers';
import {Provider} from 'react-redux';
import MainPage from '../../src/components/MainPage';
import {Photo} from '../../src/store/photos/types';

describe('MainPage component', () => {
  const photo: Photo = {
    id: '12345',
    owner: 'owner1',
    secret: 'secret1',
    server: 'server1',
    farm: 1,
    title: 'title1',
    ispublic: 1,
    isfriend: 0,
    isfamily: 0,
  };
  const navigation = {navigate: jest.fn()};

  it('renders - no data', () => {
    expect.assertions(1);
    const store = getMockStore({
      state: {
        photos: {
          fetching: false,
          query: 'test',
          data: [],
          error: null,
          locations: {},
        },
      },
    });

    // @ts-ignore
    const mainPage = <MainPage navigation={navigation} />;

    const component = renderer
      .create(<Provider store={store}>{mainPage}</Provider>)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('renders - has data', () => {
    expect.assertions(1);

    const store = getMockStore({
      state: {
        photos: {
          fetching: false,
          query: 'test',
          data: [photo],
          error: null,
          locations: {
            '12345': {
              loading: false,
              country: 'Ukraine',
              error: null,
            },
          },
        },
      },
    });

    // @ts-ignore
    const mainPage = <MainPage navigation={navigation} />;

    const component = renderer
      .create(<Provider store={store}>{mainPage}</Provider>)
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('renders - error', () => {
    expect.assertions(1);

    const store = getMockStore({
      state: {
        photos: {
          fetching: false,
          query: 'test',
          data: [],
          error: Error('Failed to fetch photos.'),
          locations: {},
        },
      },
    });

    // @ts-ignore
    const mainPage = <MainPage navigation={navigation} />;

    const component = renderer
      .create(<Provider store={store}>{mainPage}</Provider>)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
