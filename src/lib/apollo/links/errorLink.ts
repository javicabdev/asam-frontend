import { onError } from '@apollo/client/link/error';
import { ApolloLink, Observable, FetchResult } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { tokenManager } from '../tokenManager';

/**
 * Custom error type for authentication errors
 */
interface AuthError extends GraphQLError {
  extensions: {
    code: string;
    [key: string]: any;
  };
}

/**
 * Check if an error is an authentication error
 */
const isAuthError = (error: any): error is AuthError => {
  return error.extensions?.code === 'UNAUTHENTICATED' || 
         error.extensions?.code === 'UNAUTHORIZED';
};

/**
 * Creates an error link that handles authentication errors by refreshing tokens
 */
export const createErrorLink = (): ApolloLink => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    // Handle GraphQL errors
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (isAuthError(error)) {
          // Skip retry for refresh token mutation
          if (operation.operationName === 'RefreshToken') {
            console.error('Refresh token failed:', error);
            tokenManager.clearTokens();
            return;
          }

          // Create a new observable for token refresh and retry
          return new Observable<FetchResult>((observer) => {
            tokenManager
              .refreshAccessToken()
              .then((newToken) => {
                // Update the operation context with the new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newToken}`,
                  },
                });

                // Retry the operation
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              })
              .catch((refreshError) => {
                console.error('Token refresh failed:', refreshError);
                observer.error(refreshError);
              });
          });
        }

        // Handle other GraphQL errors
        switch (error.extensions?.code) {
          case 'FORBIDDEN':
            console.error('Permission denied:', error.message);
            break;
          case 'BAD_USER_INPUT':
            console.error('Invalid input:', error.message);
            break;
          default:
            console.error(`GraphQL error: ${error.message}`);
        }
      }
    }

    // Handle network errors
    if (networkError) {
      console.error('Network error:', networkError);
      
      // Check if it's a 401 Unauthorized at the network level
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        // Skip retry for refresh token mutation
        if (operation.operationName === 'RefreshToken') {
          tokenManager.clearTokens();
          return;
        }

        // Try to refresh token and retry
        return new Observable<FetchResult>((observer) => {
          tokenManager
            .refreshAccessToken()
            .then((newToken) => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${newToken}`,
                },
              });

              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              observer.error(refreshError);
            });
        });
      }
    }
  });
};
