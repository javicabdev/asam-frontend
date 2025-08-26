import { setContext } from '@apollo/client/link/context'
import { useAuthStore } from '@/stores/authStore'

/**
 * List of public operations that don't require authentication
 * Must match the backend's publicOperations configuration
 */
const PUBLIC_OPERATIONS = [
  // Email verification operations (no auth required)
  'VerifyEmail',
  'ResendVerificationEmail',
  // Password recovery operations (no auth required)
  'RequestPasswordReset',
  'ResetPasswordWithToken',
  // Login/Register operations
  'Login',
  'Register',
]

/**
 * Creates an authentication link that adds the authorization header to requests
 */
export const createAuthLink = () => {
  return setContext((operation, previousContext) => {
    // Skip auth for refresh token mutation to avoid circular dependency
    if (previousContext.skipAuthLink) {
      console.log('AuthLink - Skipping auth for operation:', operation.operationName)
      return previousContext
    }

    // Check if this is a public operation that doesn't require auth
    const isPublicOperation = PUBLIC_OPERATIONS.includes(operation.operationName || '')
    if (isPublicOperation) {
      console.log('AuthLink - Public operation detected, skipping auth:', operation.operationName)
      return previousContext
    }

    // Get current token from store directly (sync)
    const token = useAuthStore.getState().accessToken

    console.log('AuthLink - Checking token:', {
      operation: operation.operationName,
      hasToken: !!token,
      tokenLength: token?.length,
      isPublicOperation,
    })

    // If no token available, return without adding headers
    if (!token) {
      // Don't warn for public operations
      if (!isPublicOperation) {
        console.log('AuthLink - No token for authenticated operation:', operation.operationName)
      }
      return previousContext
    }

    // Build auth header
    const authHeader = `Bearer ${token}`

    console.log('AuthLink - Adding headers:', {
      operation: operation.operationName,
      authHeaderLength: authHeader.length,
      authHeaderPreview: authHeader.substring(0, 50) + '...',
    })

    // Return new context with auth headers
    const newContext = {
      ...previousContext,
      headers: {
        ...previousContext.headers,
        authorization: authHeader,
      },
    }

    console.log('AuthLink - Final context:', {
      operation: operation.operationName,
      hasHeaders: !!newContext.headers,
      headerKeys: Object.keys(newContext.headers || {}),
      hasAuth: !!newContext.headers?.authorization,
    })

    return newContext
  })
}
