import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getCompanies = async () => {
  try {
    const response = await api.get('/companies');
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};
