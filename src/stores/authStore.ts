import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/graphql/generated/operations'

interface Member {
  miembro_id: string
  numero_socio: string
  nombre: string
  apellidos: string
  correo_electronico?: string | null
}

interface User {
  id: string
  username: string
  email?: string
  role: UserRole
  member?: Member | null
  isActive: boolean
  lastLogin?: string | null
  emailVerified: boolean
  emailVerifiedAt?: string | null
}

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (data: {
    user: User
    accessToken: string
    refreshToken: string
    expiresAt: string
  }) => void
  logout: () => void
  updateTokens: (data: { accessToken: string; refreshToken: string; expiresAt: string }) => void
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void

  // Computed
  isTokenExpired: () => boolean
  hasValidToken: () => boolean
}

// Removed development hack - tokens should expire properly in all environments

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
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      updateTokens: (data) => {
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      // Computed
      isTokenExpired: () => {
        const state = get()
        if (!state.expiresAt) return true

        const expirationTime = new Date(state.expiresAt).getTime()
        const currentTime = new Date().getTime()
        const bufferTime = 60 * 1000 // 1 minute buffer before actual expiration

        // Consider token expired if within 1 minute of expiration
        const isExpired = currentTime >= expirationTime - bufferTime

        if (isExpired) {
          console.log('[AuthStore] Token expired or about to expire:', {
            expiresAt: new Date(expirationTime).toISOString(),
            currentTime: new Date(currentTime).toISOString(),
            bufferApplied: true,
          })
        }

        return isExpired
      },

      hasValidToken: () => {
        const state = get()
        return !!state.accessToken && !state.isTokenExpired()
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
          state.setLoading(false)

          // Log token info for debugging
          if (state.expiresAt) {
            const isExpired = state.isTokenExpired()
            console.log('[AuthStore] Token status on rehydration:', {
              expiresAt: new Date(state.expiresAt).toISOString(),
              currentTime: new Date().toISOString(),
              isExpired,
              hasValidToken: !isExpired && !!state.accessToken,
            })

            // Check if tokens are expired on rehydration
            if (isExpired) {
              console.warn('[AuthStore] Token expired on rehydration, clearing auth state')
              // Clear expired tokens
              state.logout()
            }
          } else {
            console.log('[AuthStore] No token found on rehydration')
          }
        }
      },
    }
  )
)
