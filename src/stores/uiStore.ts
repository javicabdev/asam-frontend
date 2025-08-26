import { create } from 'zustand'

interface UIState {
  // Token refresh state
  isRefreshingToken: boolean

  // Global error state
  globalError: string | null

  // Loading states for different operations
  loadingStates: Map<string, boolean>
}

interface UIActions {
  // Token refresh actions
  setRefreshingToken: (value: boolean) => void

  // Error actions
  setGlobalError: (error: string | null) => void
  clearGlobalError: () => void

  // Loading state actions
  setLoading: (key: string, value: boolean) => void
  isLoading: (key: string) => boolean
  clearAllLoadingStates: () => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  isRefreshingToken: false,
  globalError: null,
  loadingStates: new Map(),

  // Token refresh actions
  setRefreshingToken: (value) => {
    set({ isRefreshingToken: value })

    // Log for debugging
    if (value) {
      console.log('[UIStore] Token refresh started')
    } else {
      console.log('[UIStore] Token refresh completed')
    }
  },

  // Error actions
  setGlobalError: (error) => {
    set({ globalError: error })

    if (error) {
      console.error('[UIStore] Global error set:', error)
    }
  },

  clearGlobalError: () => {
    set({ globalError: null })
  },

  // Loading state actions
  setLoading: (key, value) => {
    set((state) => {
      const newLoadingStates = new Map(state.loadingStates)
      if (value) {
        newLoadingStates.set(key, true)
      } else {
        newLoadingStates.delete(key)
      }
      return { loadingStates: newLoadingStates }
    })
  },

  isLoading: (key) => {
    return get().loadingStates.get(key) || false
  },

  clearAllLoadingStates: () => {
    set({ loadingStates: new Map() })
  },
}))

// Helper hook to check if any operation is loading
export const useIsAnyLoading = () => {
  const loadingStates = useUIStore((state) => state.loadingStates)
  return loadingStates.size > 0
}

// Helper hook for specific loading states
export const useLoadingState = (key: string) => {
  const isLoading = useUIStore((state) => state.isLoading)
  const setLoading = useUIStore((state) => state.setLoading)

  return {
    isLoading: isLoading(key),
    setLoading: (value: boolean) => setLoading(key, value),
  }
}
