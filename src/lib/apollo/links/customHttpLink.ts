/**
 * @deprecated This file has been replaced by separate authLink and httpLink
 * following the Single Responsibility Principle.
 * 
 * The functionality has been split into:
 * - authLink.ts: Handles authentication headers
 * - httpLink.ts: Handles HTTP transport
 * 
 * This file will be removed in a future commit.
 */

import { ApolloLink, Observable } from '@apollo/client'
import { print } from 'graphql'
import { useAuthStore } from '@/stores/authStore'

/**
 * List of public operations that don't require authentication
 */
const PUBLIC_OPERATIONS = [
  'VerifyEmail',
  'ResendVerificationEmail',
  'RequestPasswordReset',
  'ResetPasswordWithToken',
  'Login',
  'Register',
]

/**
 * A custom HTTP link that handles auth directly and works correctly
 * This replaces the complex link chain that was causing issues
 */
export const createCustomHttpLink = (uri: string): ApolloLink => {
  return new ApolloLink((operation, _) => {
    return new Observable((observer) => {
      const { operationName, query, variables } = operation
      const context = operation.getContext()

      // Skip auth for refresh token mutation
      if (context.skipAuthLink) {
        console.log('CustomHttpLink - Skipping auth for:', operationName)
      }

      // Check if auth is needed
      const isPublicOperation = PUBLIC_OPERATIONS.includes(operationName || '')

      // CRITICAL: Read token fresh from store for EVERY request
      // This ensures we always get the current token, not a stale reference
      const token = useAuthStore.getState().accessToken

      if (import.meta.env.DEV) {
        const currentState = useAuthStore.getState()
        console.log('CustomHttpLink - Request:', {
          operationName,
          isPublicOperation,
          hasToken: !!token,
          tokenLength: token?.length,
          skipAuthLink: context.skipAuthLink,
          isAuthenticated: currentState.isAuthenticated,
          user: currentState.user?.username,
          timestamp: new Date().toISOString(),
        })

        // Enhanced logging for SendVerificationEmail
        if (operationName === 'SendVerificationEmail') {
          console.log('🔍 SendVerificationEmail - Detailed Auth State:', {
            tokenFromStore: !!token,
            tokenPreview: token ? token.substring(0, 50) + '...' : 'NO TOKEN',
            storeSnapshot: {
              isAuthenticated: currentState.isAuthenticated,
              hasAccessToken: !!currentState.accessToken,
              hasUser: !!currentState.user,
              userEmail: currentState.user?.username,
              emailVerified: currentState.user?.emailVerified,
            },
            willAddAuthHeader: !isPublicOperation && !context.skipAuthLink && !!token,
          })
        }
      }

      // Build headers - ensure we don't override existing auth headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(context.headers || {}),
      }

      // Add auth header if needed
      if (!isPublicOperation && !context.skipAuthLink) {
        // Double-check token right before adding header
        const currentToken = useAuthStore.getState().accessToken

        if (currentToken) {
          headers['Authorization'] = `Bearer ${currentToken}`
          if (import.meta.env.DEV) {
            console.log('CustomHttpLink - Added auth header:', {
              tokenPreview: currentToken.substring(0, 30) + '...',
              fullHeader: headers['Authorization'].substring(0, 50) + '...',
              tokenMatchesInitial: currentToken === token,
            })

            // Special logging for SendVerificationEmail
            if (operationName === 'SendVerificationEmail') {
              console.log('✅ SendVerificationEmail - Auth header added successfully:', {
                headerValue: headers['Authorization'].substring(0, 60) + '...',
                tokenLength: currentToken.length,
              })
            }
          }
        } else {
          console.warn(
            'CustomHttpLink - WARNING: Auth required but no token available for:',
            operationName
          )

          // Critical logging for SendVerificationEmail
          if (operationName === 'SendVerificationEmail') {
            console.error('❌ SendVerificationEmail - CRITICAL: No token available!', {
              isPublicOperation,
              skipAuthLink: context.skipAuthLink,
              storeState: useAuthStore.getState(),
            })
          }

          // Ensure we don't have a stale auth header
          delete headers['Authorization']
        }
      }

      // Make the request - wrapped in async function for clarity
      const executeRequest = async () => {
        try {
          // Final check before request for SendVerificationEmail
          if (import.meta.env.DEV && operationName === 'SendVerificationEmail') {
            console.log('🚀 SendVerificationEmail - Final request state:', {
              uri,
              headers: {
                ...headers,
                Authorization: headers.Authorization ? 'Bearer [REDACTED]' : 'NOT SET',
              },
              hasAuthHeader: !!headers.Authorization,
              bodyPreview: {
                operationName,
                variablesKeys: Object.keys(variables || {}),
              },
            })

            // TEMPORARY: Log full auth header for backend debugging
            // Remove this after debugging!
            console.log('🔐 TEMP DEBUG - Full Authorization header:', headers.Authorization)
          }

          const response = await fetch(uri, {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify({
              query: print(query),
              variables,
            }),
          })

          if (import.meta.env.DEV) {
            console.log('CustomHttpLink - Response:', {
              operation: operationName,
              status: response.status,
              statusText: response.statusText,
              hasAuthHeader: !!headers['Authorization'],
            })
          }

          const result = await response.json()

          if (result.errors) {
            if (import.meta.env.DEV) {
              console.error('CustomHttpLink - GraphQL errors:', result.errors)

              // Log detailed error for SendVerificationEmail
              if (operationName === 'SendVerificationEmail') {
                console.error('❌ SendVerificationEmail - Server Error Details:', {
                  errors: result.errors,
                  errorMessages: result.errors.map((e: any) => e.message),
                  errorExtensions: result.errors.map((e: any) => e.extensions),
                  fullResult: result,
                })
              }
            }
            // Don't handle auth errors here - let authRefreshLink handle them
          }

          observer.next(result)
          observer.complete()
        } catch (error) {
          console.error('CustomHttpLink - Network error:', error)
          observer.error(error)
        }
      }

      // Execute the request
      executeRequest()
    })
  })
}
