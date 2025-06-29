import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
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
  setLoading: (isLoading: boolean) => void;
  
  // Computed
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: true, // Start as loading to check persisted state

      // Actions
      login: (data) => {
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateTokens: (data) => {
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Computed
      isTokenExpired: () => {
        const state = get();
        if (!state.expiresAt) return true;

        const expirationTime = new Date(state.expiresAt).getTime();
        const currentTime = new Date().getTime();
        
        return currentTime >= expirationTime;
      },
    }),
    {
      name: 'auth-storage', // Name of the storage key
      partialize: (state) => ({
        // Only persist tokens and user, not UI state
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, set loading to false
        if (state) {
          state.setLoading(false);
          
          // Check if tokens are expired on rehydration
          if (state.isTokenExpired()) {
            // Clear expired tokens
            state.logout();
          }
        }
      },
    }
  )
);
