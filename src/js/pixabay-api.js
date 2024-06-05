import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '44085737-801aedd726c9c1496368a8656';

export async function getImages(imageName, page = 1) {
  const params = {
    key: API_KEY,
    q: imageName,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}
