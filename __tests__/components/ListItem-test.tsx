import React from 'react';
import renderer from 'react-test-renderer';
import PhotoItem from '../../src/components/ListItem';
import {Photo} from '../../src/store/photos/types';
import getMockStore from '../helpers';
import {Provider} from 'react-redux';

describe('ListItem component', () => {
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

  it('renders - no country info', () => {
    expect.assertions(1);
    const store = getMockStore({
      state: {
        photos: {
          locations: {},
        },
      },
    });

    const component = renderer
      .create(
        <Provider store={store}>
          <PhotoItem item={photo} onItemPress={jest.fn()} />
        </Provider>,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });

  it('renders - has country info', () => {
    expect.assertions(1);
    const store = getMockStore({
      state: {
        photos: {
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

    const component = renderer
      .create(
        <Provider store={store}>
          <PhotoItem item={photo} onItemPress={jest.fn()} />
        </Provider>,
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
