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
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  login: (user, token) => set({ user, isAuthenticated: true, token }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
}));
