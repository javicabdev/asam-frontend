import { ApolloLink, Observable, Operation, FetchResult, NextLink } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { useAuthStore } from '@/stores/authStore';

// Track refresh attempts to prevent infinite loops
const refreshAttempts = new Map<string, boolean>();

// Track if we're currently refreshing to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * List of operations that should not trigger token refresh
 */
const SKIP_REFRESH_OPERATIONS = [
  'Login',
  'Register',
  'RefreshToken',
  'RequestPasswordReset',
  'ResetPasswordWithToken',
  'VerifyEmail',
  'ResendVerificationEmail',
];

/**
 * Check if an error is an authentication error that requires token refresh
 */
const isAuthenticationError = (error: GraphQLError): boolean => {
  return (
    error.extensions?.code === 'UNAUTHENTICATED' ||
    error.message.includes('UNAUTHORIZED') ||
    error.message.includes('401') ||
    error.message.includes('token expired') ||
    error.message.includes('invalid token')
  );
};

/**
 * Execute the refresh token mutation
 */
const executeTokenRefresh = async (operation: Operation): Promise<boolean> => {
  const { refreshToken, updateTokens, logout } = useAuthStore.getState();
  
  if (!refreshToken) {
    console.warn('AuthRefreshLink: No refresh token available');
    return false;
  }

  try {
    // Import dynamically to avoid circular dependencies
    const { apolloClient } = await import('../client');
    const { RefreshTokenDocument } = await import('@/graphql/generated/operations');
    
    console.log('AuthRefreshLink: Attempting to refresh token');
    
    const { data } = await apolloClient.mutate({
      mutation: RefreshTokenDocument,
      variables: {
        input: { refreshToken },
      },
      // Skip all links to make a direct request
      context: {
        skipAuthLink: true,
      },
    });

    if (data?.refreshToken) {
      console.log('AuthRefreshLink: Token refresh successful');
      
      // Update tokens in the store
      updateTokens({
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
        expiresAt: data.refreshToken.expiresAt,
      });
      
      return true;
    }
    
    console.error('AuthRefreshLink: Token refresh failed - no data returned');
    return false;
  } catch (error) {
    console.error('AuthRefreshLink: Token refresh error:', error);
    
    // If refresh fails, logout the user
    logout();
    return false;
  }
};

/**
 * Auth Refresh Link - Automatically refreshes expired tokens
 */
export const createAuthRefreshLink = (): ApolloLink => {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    // Skip refresh for certain operations or when explicitly requested
    if (
      SKIP_REFRESH_OPERATIONS.includes(operation.operationName) ||
      operation.getContext().skipAuthRefreshLink
    ) {
      return forward(operation);
    }

    return new Observable<FetchResult>((observer) => {
      let subscription: any;
      let didRefresh = false;

      // Create a unique key for this operation
      const operationKey = `${operation.operationName}-${Date.now()}`;

      // Forward the operation
      const forwardOperation = () => {
        subscription = forward(operation).subscribe({
          next: (result) => {
            observer.next(result);
          },
          error: async (error) => {
            // Check if we have GraphQL errors with authentication issues
            const hasAuthError = error.graphQLErrors?.some(isAuthenticationError);
            
            if (hasAuthError && !didRefresh && !refreshAttempts.get(operationKey)) {
              console.log(`AuthRefreshLink: Auth error detected for ${operation.operationName}`);
              
              // Mark that we've attempted refresh for this operation
              refreshAttempts.set(operationKey, true);
              didRefresh = true;

              try {
                let refreshSuccess = false;

                // If we're already refreshing, wait for it
                if (isRefreshing && refreshPromise) {
                  console.log('AuthRefreshLink: Waiting for ongoing refresh');
                  refreshSuccess = await refreshPromise;
                } else {
                  // Start a new refresh
                  isRefreshing = true;
                  refreshPromise = executeTokenRefresh(operation);
                  refreshSuccess = await refreshPromise;
                  isRefreshing = false;
                  refreshPromise = null;
                }

                if (refreshSuccess) {
                  console.log(`AuthRefreshLink: Retrying ${operation.operationName} after refresh`);
                  
                  // Retry the operation - the new token will be picked up by customHttpLink
                  subscription = forward(operation).subscribe({
                    next: (result) => {
                      observer.next(result);
                    },
                    error: (retryError) => {
                      console.error('AuthRefreshLink: Retry failed:', retryError);
                      observer.error(retryError);
                    },
                    complete: () => {
                      observer.complete();
                    },
                  });
                  
                  return;
                }
              } catch (refreshError) {
                console.error('AuthRefreshLink: Refresh error:', refreshError);
              } finally {
                // Clean up the refresh attempt tracking
                setTimeout(() => {
                  refreshAttempts.delete(operationKey);
                }, 1000);
              }
            }

            // If we can't refresh or refresh failed, forward the original error
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          },
        });
      };

      forwardOperation();

      // Cleanup function
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        refreshAttempts.delete(operationKey);
      };
    });
  });
};
