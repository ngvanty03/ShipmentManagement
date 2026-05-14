import axios from 'axios';
import config from '../config.json';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: config.serverApiUrl,
  withCredentials: true, // Crucial for sending and receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

import { useAuthStore } from '../stores/authStore';

// Optionally add interceptors here to handle 401s (e.g., call refresh token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, we might want to automatically redirect to login or attempt refresh
    return Promise.reject(error);
  }
);

export default axiosInstance;
