import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { LoginResponse } from '../dto/common';


export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthLogin, logout: setAuthLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string, redirectUrl: string = '/') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      console.log("response.data: ", response.data);
      //const { accessToken, ...user } = response.data;

      setAuthLogin(response.data.user, response.data.accessToken);
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Optionally call a backend /api/auth/logout endpoint to clear cookies if available.
    setAuthLogout();
    navigate('/login', { replace: true });
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
};
