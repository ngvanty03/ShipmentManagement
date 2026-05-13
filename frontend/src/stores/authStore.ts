import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Customer';
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  // Note: We don't store token here because it's delivered via HttpOnly Cookies
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
