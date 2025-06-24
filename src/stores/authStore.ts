import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }) => void;
  logout: () => void;
  updateTokens: (data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  }) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  expiresAt: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    set({
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
    });
  },

  updateTokens: (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
    });
  },

  setUser: (user) => {
    set({ user });
  },
}));
