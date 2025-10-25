import { useTokenRefresh } from '@/hooks/auth'
import { SessionExpirationWarning } from '@/components/auth'

/**
 * AppContent - Component that wraps app-level functionality that requires ApolloProvider
 * This component is rendered INSIDE the ApolloProvider, so it can use Apollo hooks
 */
export const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This hook needs Apollo Client, so it must be inside ApolloProvider
  useTokenRefresh()

  return (
    <>
      {children}
      <SessionExpirationWarning />
    </>
  )
}
