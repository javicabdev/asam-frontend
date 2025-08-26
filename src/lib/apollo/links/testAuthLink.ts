import { ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuthStore } from '@/stores/authStore'

/**
 * Test auth link that simply logs headers
 */
export const createTestAuthLink = (): ApolloLink => {
  return setContext(() => {
    const token = useAuthStore.getState().accessToken

    console.log('TestAuthLink - Setting headers:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'null',
    })

    if (!token) {
      return {}
    }

    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  })
}
