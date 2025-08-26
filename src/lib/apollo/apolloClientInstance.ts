import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

/**
 * Singleton instance of Apollo Client
 * This is separated to avoid circular dependencies
 */
let apolloClientInstance: ApolloClient<NormalizedCacheObject> | null = null

/**
 * Set the Apollo Client instance
 */
export function setApolloClientInstance(client: ApolloClient<NormalizedCacheObject>): void {
  apolloClientInstance = client
}

/**
 * Get the Apollo Client instance
 * @throws Error if client is not initialized
 */
export function getApolloClientInstance(): ApolloClient<NormalizedCacheObject> {
  if (!apolloClientInstance) {
    throw new Error('Apollo Client not initialized. Make sure to call initializeApollo() first.')
  }
  return apolloClientInstance
}

/**
 * Check if Apollo Client is initialized
 */
export function isApolloClientInitialized(): boolean {
  return apolloClientInstance !== null
}

/**
 * Reset the Apollo Client instance (useful for testing)
 */
export function resetApolloClientInstance(): void {
  apolloClientInstance = null
}
