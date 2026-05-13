import { useState } from 'react';
import { useAuthStore, type User } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthLogin, logout: setAuthLogout } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string, redirectUrl: string = '/') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<User>('/auth/login', {
        email,
        password,
      });

      // Response contains User details. Token is set via HttpOnly Cookie by the backend.
      const user = response.data;

      setAuthLogin(user);
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
