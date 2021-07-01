import {Photo, PhotoSize} from '../../src/store/search/types';
import {
  getData,
  getError,
  getFetching,
  getLoadingMore,
  getQuery,
  getSizedImageUrlForPhoto,
  getTotalPages,
} from '../../src/store/search/selectors';
import {RootState} from '../../src/store/store';

describe('search selectors', () => {
  const photo: Photo = {
    id: 'id',
    owner: 'owner',
    secret: 'secret',
    server: 'server',
    farm: 1,
    title: 'title',
    ispublic: 1,
    isfriend: 0,
    isfamily: 0,
  };

  const error = Error('Test error');

  const state: RootState = {
    search: {
      query: 'test',
      fetching: false,
      loadingMore: true,
      data: [photo],
      error,
      totalPages: 10,
    },
    // @ts-ignore
    contacts: {},
  };

  it('getQuery', () => {
    expect.assertions(1);
    expect(getQuery(state)).toBe('test');
  });

  it('getFetching', () => {
    expect.assertions(1);
    expect(getFetching(state)).toBe(false);
  });

  it('getData', () => {
    expect.assertions(1);
    expect(getData(state)).toEqual([photo]);
  });

  it('getTotalPages', () => {
    expect.assertions(1);
    expect(getTotalPages(state)).toBe(10);
  });

  it('getLoadingMore', () => {
    expect.assertions(1);
    expect(getLoadingMore(state)).toBe(true);
  });

  it('getError', () => {
    expect.assertions(1);
    expect(getError(state)).toEqual(error);
  });

  it('getSizedImageUrlForPhoto', () => {
    expect.assertions(3);
    const expectedURL1 = 'https://live.staticflickr.com/server/id_secret_m.jpg';
    expect(getSizedImageUrlForPhoto(photo)).toBe(expectedURL1);

    const expectedURL2 = 'https://live.staticflickr.com/server/id_secret_w.jpg';
    expect(getSizedImageUrlForPhoto(photo, PhotoSize.small400)).toBe(
      expectedURL2,
    );

    const expectedURL3 = 'https://live.staticflickr.com/server/id_secret_b.jpg';
    expect(getSizedImageUrlForPhoto(photo, PhotoSize.large1024)).toBe(
      expectedURL3,
    );
  });
});
