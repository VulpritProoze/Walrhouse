import axios from 'axios';
import { apiUrl } from './api';

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API request failed:', error);
    }

    return Promise.reject(error);
  },
);
