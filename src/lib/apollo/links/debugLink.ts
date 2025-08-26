import { ApolloLink, Observable } from '@apollo/client'

/**
 * List of public operations (same as in authLink)
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
 * Debug link that logs requests and responses
 * Only active in development mode
 */
export const createDebugLink = (): ApolloLink => {
  if (!import.meta.env.DEV) {
    // In production, return a pass-through link
    return new ApolloLink((operation, forward) => forward(operation))
  }

  return new ApolloLink((operation, forward) => {
    const startTime = Date.now()
    const isPublicOperation = PUBLIC_OPERATIONS.includes(operation.operationName || '')

    console.group(
      `${isPublicOperation ? '🌐' : '🚀'} GraphQL ${operation.operationName} (${isPublicOperation ? 'Public' : 'Authenticated'})`
    )
    console.log('Variables:', operation.variables)
    console.log('Operation Type:', isPublicOperation ? 'Public' : 'Authenticated')

    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          const duration = Date.now() - startTime

          // Log the response
          if (result.errors) {
            console.error('❌ Errors:', result.errors)
          } else {
            console.log('✅ Data:', result.data)
          }
          console.log(`⏱️ Duration: ${duration}ms`)
          console.groupEnd()

          observer.next(result)
        },
        error: (error) => {
          const duration = Date.now() - startTime
          console.error('💥 Network Error:', error)
          console.log(`⏱️ Duration: ${duration}ms`)
          console.groupEnd()

          observer.error(error)
        },
        complete: () => {
          observer.complete()
        },
      })

      return () => {
        if (subscription) subscription.unsubscribe()
      }
    })
  })
}
