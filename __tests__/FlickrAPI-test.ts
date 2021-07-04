import fetchMock from 'jest-fetch-mock';
import {fetchPhotos} from '../src/FlickrAPI';

fetchMock.enableMocks();

describe('Flickr API', () => {
  describe('fetchPhotos', () => {
    beforeEach(() => {
      fetchMock.resetMocks();
    });

    it('correct url', async () => {
      expect.assertions(1);
      fetchMock.mockResponse(JSON.stringify({stat: 'ok', photos: {}}));

      await fetchPhotos('test', 1);

      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e9ed25c3cad22a3ab90a4a1c15dc9dec&text=test&format=json&page=1&nojsoncallback=1',
      );
    });

    it('success', async () => {
      expect.assertions(1);
      fetchMock.mockResponse(
        JSON.stringify({stat: 'ok', photos: {foo: 'bar'}}),
      );

      const response = await fetchPhotos('test', 1);

      expect(response).toEqual({foo: 'bar'});
    });

    it('failure - status fail', async () => {
      expect.assertions(1);
      fetchMock.mockResponse(JSON.stringify({stat: 'fail'}));

      try {
        await fetchPhotos('test', 1);
      } catch (error) {
        expect(error).toEqual(Error('Unknown error occurred.'));
      }
    });

    it('failure - status code 500', async () => {
      expect.assertions(1);
      fetchMock.mockResponse('', {status: 500});

      try {
        await fetchPhotos('test', 1);
      } catch (error) {
        expect(error).toEqual(
          Error('Data is unavailable. Response status: 500'),
        );
      }
    });
  });
});
