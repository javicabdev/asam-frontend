import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { apolloClient } from '../apollo-client'
import {
  RefreshTokenDocument,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
} from '@/graphql/generated/operations'

class TokenManager {
  private refreshPromise: Promise<string> | null = null
  private refreshSubscribers: Array<(token: string) => void> = []
  private readonly MAX_REFRESH_ATTEMPTS = 3
  private readonly REFRESH_RETRY_DELAY = 1000 // 1 second

  /**
   * Get the current access token from the store
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken
  }

  /**
   * Get the current refresh token from the store
   */
  getRefreshToken(): string | null {
    return useAuthStore.getState().refreshToken
  }

  /**
   * Check if the token is expired or about to expire (within 1 minute)
   */
  isTokenExpired(): boolean {
    return useAuthStore.getState().isTokenExpired()
  }

  /**
   * Validate JWT token format
   */
  private isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      console.error('[TokenManager] Invalid token: not a string')
      return false
    }

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('[TokenManager] Invalid token format: expected 3 parts, got', parts.length)
      return false
    }

    // Check for whitespace or special characters that shouldn't be in a JWT
    if (/\s/.test(token)) {
      console.error('[TokenManager] Invalid token: contains whitespace')
      return false
    }

    // Each part should be base64url encoded (alphanumeric, -, _)
    const base64urlRegex = /^[A-Za-z0-9_-]+$/
    for (const part of parts) {
      if (!base64urlRegex.test(part)) {
        console.error('[TokenManager] Invalid token: part contains invalid characters')
        return false
      }
    }

    return true
  }

  /**
   * Subscribe to token refresh completion
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback)
  }

  /**
   * Notify all subscribers when token is refreshed
   */
  private notifyRefreshSubscribers(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  /**
   * Refresh the access token using the refresh token with retry logic
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      console.error('[TokenManager] No refresh token available')
      throw new Error('No refresh token available')
    }

    // Validate refresh token format
    if (!this.isValidTokenFormat(refreshToken)) {
      console.error('[TokenManager] Invalid refresh token format')
      this.clearTokens()
      throw new Error('Invalid refresh token format')
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      console.log('[TokenManager] Refresh already in progress, waiting...')
      return new Promise((resolve) => {
        this.subscribeTokenRefresh(resolve)
      })
    }

    // Start a new refresh process
    this.refreshPromise = this.performTokenRefreshWithRetry(refreshToken)

    try {
      const newToken = await this.refreshPromise
      this.notifyRefreshSubscribers(newToken)
      return newToken
    } catch (error) {
      console.error('[TokenManager] Refresh failed after retries:', error)
      throw error
    } finally {
      this.refreshPromise = null
    }
  }

  /**
   * Perform token refresh with retry logic
   */
  private async performTokenRefreshWithRetry(refreshToken: string): Promise<string> {
    let lastError: any = null

    for (let attempt = 1; attempt <= this.MAX_REFRESH_ATTEMPTS; attempt++) {
      try {
        console.log(`[TokenManager] Refresh attempt ${attempt}/${this.MAX_REFRESH_ATTEMPTS}`)

        // Add delay between retries (exponential backoff)
        if (attempt > 1) {
          const delay = this.REFRESH_RETRY_DELAY * Math.pow(2, attempt - 2)
          console.log(`[TokenManager] Waiting ${delay}ms before retry...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        const newToken = await this.performTokenRefresh(refreshToken)
        console.log('[TokenManager] Refresh successful on attempt', attempt)
        return newToken
      } catch (error) {
        lastError = error
        console.error(`[TokenManager] Refresh attempt ${attempt} failed:`, error)

        // Don't retry if it's a clear authentication failure
        if (this.isAuthenticationError(error)) {
          console.error('[TokenManager] Authentication error, not retrying')
          throw error
        }
      }
    }

    throw lastError || new Error('Token refresh failed after all attempts')
  }

  /**
   * Check if error is an authentication error
   */
  private isAuthenticationError(error: any): boolean {
    const errorMessage = error?.message?.toLowerCase() || ''
    return (
      errorMessage.includes('invalid refresh token') ||
      errorMessage.includes('refresh token expired') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('unauthenticated')
    )
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    // Set UI state to show refresh is in progress
    useUIStore.getState().setRefreshingToken(true)

    try {
      console.log('[TokenManager] Performing token refresh...')

      const { data } = await apolloClient.mutate<
        RefreshTokenMutation,
        RefreshTokenMutationVariables
      >({
        mutation: RefreshTokenDocument,
        variables: {
          input: { refreshToken },
        },
        // Don't use the error link for this request to avoid infinite loops
        context: {
          skipAuthLink: true,
          skipAuthRefreshLink: true,
        },
        fetchPolicy: 'no-cache',
      })

      if (!data?.refreshToken) {
        throw new Error('Invalid refresh token response: no data returned')
      }

      const { accessToken, refreshToken: newRefreshToken, expiresAt } = data.refreshToken

      // Validate the new access token format
      if (!this.isValidTokenFormat(accessToken)) {
        throw new Error('Invalid access token format in refresh response')
      }

      console.log('[TokenManager] Token refresh successful, updating store')

      // Update the store with new tokens
      useAuthStore.getState().updateTokens({
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      })

      return accessToken
    } catch (error: any) {
      console.error('[TokenManager] Token refresh failed:', error)

      // Only clear tokens if it's an authentication error
      if (this.isAuthenticationError(error)) {
        this.clearTokens()
      }

      throw error
    } finally {
      // Clear UI state
      useUIStore.getState().setRefreshingToken(false)
    }
  }

  /**
   * Clear all tokens and logout
   */
  clearTokens(): void {
    useAuthStore.getState().logout()

    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string | null> {
    const currentToken = this.getAccessToken()

    if (!currentToken) {
      console.log('[TokenManager] No access token available')
      return null
    }

    // Validate token format
    if (!this.isValidTokenFormat(currentToken)) {
      console.error('[TokenManager] Current access token has invalid format')
      this.clearTokens()
      return null
    }

    // Check if token is expired or about to expire
    if (this.isTokenExpired()) {
      console.log('[TokenManager] Token expired or about to expire, refreshing...')
      try {
        const newToken = await this.refreshAccessToken()
        return newToken
      } catch (error) {
        console.error('[TokenManager] Failed to get valid token:', error)
        return null
      }
    }

    return currentToken
  }

  /**
   * Reset refresh attempts counter
   * @deprecated This method is no longer used as attempts are tracked locally
   */
  resetRefreshAttempts(): void {
    // No-op: attempts are now tracked locally in performTokenRefreshWithRetry
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager()
