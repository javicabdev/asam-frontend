import { useTokenRefresh, useIdleTimeout } from '@/hooks/auth'
import { SessionExpirationWarning } from '@/components/auth'

// Read idle timeout configuration from environment
const IDLE_TIMEOUT_MINUTES = Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES) || 15
const IDLE_WARNING_MINUTES = Number(import.meta.env.VITE_IDLE_WARNING_MINUTES) || 2

/**
 * AppContent - Component that wraps app-level functionality that requires ApolloProvider
 * This component is rendered INSIDE the ApolloProvider, so it can use Apollo hooks
 */
export const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This hook needs Apollo Client, so it must be inside ApolloProvider
  useTokenRefresh()

  // Automatic logout after configured minutes of inactivity
  useIdleTimeout(
    IDLE_TIMEOUT_MINUTES * 60 * 1000, // Convert minutes to milliseconds
    IDLE_WARNING_MINUTES * 60 * 1000  // Convert minutes to milliseconds
  )

  return (
    <>
      {children}
      <SessionExpirationWarning />
    </>
  )
}
