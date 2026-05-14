import axios from 'axios';
import toast from 'react-hot-toast';
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
import type { LoginResponse } from '../dto/common';
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
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      try {
        // Call refresh API 1 time
        const response = await axios.post<LoginResponse>(
          `${config.serverApiUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Update auth store with new token
        useAuthStore.getState().login(response.data.user, response.data.accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out and show error
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError);
      }
    }

    // Other cases: raise error using toast message
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
