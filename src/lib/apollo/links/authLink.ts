import { ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { tokenManager } from '../tokenManager';

/**
 * Creates an authentication link that adds the authorization header to requests
 * This link will automatically use a valid token, refreshing if necessary
 */
export const createAuthLink = (): ApolloLink => {
  return setContext(async (_, previousContext) => {
    // Skip auth for refresh token mutation to avoid circular dependency
    if (previousContext.skipAuthLink) {
      return previousContext;
    }

    try {
      // Get a valid access token (will refresh if expired)
      const token = await tokenManager.getValidAccessToken();

      return {
        headers: {
          ...previousContext.headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    } catch (error) {
      console.error('Failed to get valid access token:', error);
      return previousContext;
    }
  });
};
