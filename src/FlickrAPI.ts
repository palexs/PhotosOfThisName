import {PhotosResponse} from './store/search/types';

const API_KEY = 'e9ed25c3cad22a3ab90a4a1c15dc9dec';

export const fetchPhotos = async (
  name: string,
  page: number,
): Promise<PhotosResponse> => {
  const response = await fetch(
    `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&text=${name}&format=json&page=${page}&nojsoncallback=1`,
  );
  if (response.status !== 200) {
    throw Error(`Data is unavailable. Response status: ${response.status}`);
  }
  const jsonData = await response.json();
  const {stat, photos} = jsonData;
  if (stat === 'ok') {
    return photos;
  } else {
    throw Error(jsonData.message || 'Unknown error occurred.');
  }
};
