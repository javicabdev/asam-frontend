import { useUIStore } from '@/stores/uiStore'

/**
 * Hook to control the loading overlay
 */
export const useLoadingOverlay = () => {
  const { isRefreshingToken, setRefreshingToken } = useUIStore()

  const showTokenRefresh = () => setRefreshingToken(true)
  const hideTokenRefresh = () => setRefreshingToken(false)

  return {
    isRefreshingToken,
    showTokenRefresh,
    hideTokenRefresh,
  }
}
