import {PhotosResponse, PhotoLocationResponse} from './store/search/types';

const API_KEY = 'e9ed25c3cad22a3ab90a4a1c15dc9dec';
const BASE_URL = 'https://api.flickr.com/services/rest/';

const flickrFetch = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw Error(`Data is unavailable. Response status: ${response.status}`);
  }
  const jsonData = await response.json();
  const {stat} = jsonData;
  if (stat === 'ok') {
    return jsonData;
  } else {
    throw Error(jsonData.message || 'Unknown error occurred.');
  }
};

export const fetchPhotos = async (
  name: string,
  page: number,
): Promise<PhotosResponse> => {
  const jsonResponse = await flickrFetch(
    `${BASE_URL}?method=flickr.photos.search&api_key=${API_KEY}&text=${name}&format=json&page=${page}&nojsoncallback=1`,
  );
  const {photos} = jsonResponse;
  return photos;
};

export const fetchPhotoLocation = async (
  photoID: string,
): Promise<PhotoLocationResponse> => {
  const jsonResponse = await flickrFetch(
    `${BASE_URL}?method=flickr.photos.geo.getLocation&api_key=${API_KEY}&photo_id=${photoID}&format=json&nojsoncallback=1`,
  );

  const {photo} = jsonResponse;
  return photo;
};
