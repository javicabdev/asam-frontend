import { useAuthStore } from '@/stores/authStore';
import { apolloClient } from '../apollo-client';
import { RefreshTokenDocument, RefreshTokenMutation, RefreshTokenMutationVariables } from '@/graphql/generated/operations';

class TokenManager {
  private refreshPromise: Promise<string> | null = null;
  private refreshSubscribers: Array<(token: string) => void> = [];

  /**
   * Get the current access token from the store
   */
  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken;
  }

  /**
   * Get the current refresh token from the store
   */
  getRefreshToken(): string | null {
    return useAuthStore.getState().refreshToken;
  }

  /**
   * Check if the token is expired or about to expire (within 1 minute)
   */
  isTokenExpired(): boolean {
    const expiresAt = useAuthStore.getState().expiresAt;
    if (!expiresAt) return true;

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    const oneMinuteInMs = 60 * 1000;

    return currentTime >= expirationTime - oneMinuteInMs;
  }

  /**
   * Subscribe to token refresh completion
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers when token is refreshed
   */
  private notifyRefreshSubscribers(token: string): void {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // If a refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh(resolve);
      });
    }

    // Start a new refresh process
    this.refreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const newToken = await this.refreshPromise;
      this.notifyRefreshSubscribers(newToken);
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
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
        },
      });

      if (!data?.refreshToken) {
        throw new Error('Invalid refresh token response');
      }

      const { accessToken, refreshToken: newRefreshToken, expiresAt } = data.refreshToken;

      // Update the store with new tokens
      useAuthStore.getState().updateTokens({
        accessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      });

      return accessToken;
    } catch (error) {
      // If refresh fails, logout the user
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Clear all tokens and logout
   */
  clearTokens(): void {
    useAuthStore.getState().logout();
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken(): Promise<string | null> {
    const currentToken = this.getAccessToken();
    
    if (!currentToken) {
      return null;
    }

    if (this.isTokenExpired()) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return null;
      }
    }

    return currentToken;
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();
