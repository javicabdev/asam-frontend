import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { createCustomHttpLink } from './links/customHttpLink'
import { createDebugLink } from './links/debugLink'
import { createAuthRefreshLink } from './links/authRefreshLink'
import { setApolloClientInstance } from './apolloClientInstance'

// Get GraphQL endpoint
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql'

/**
 * Create and initialize the Apollo Client instance
 * This sets up the client and stores it in the singleton instance
 */
export const createApolloClient = () => {
  console.log('🏭 Creating Apollo Client with customHttpLink that handles auth internally')

  // Create the links
  const customHttpLink = createCustomHttpLink(GRAPHQL_URL)
  const authRefreshLink = createAuthRefreshLink()

  // Build the link chain:
  // 1. Debug link (dev only) - logs operations
  // 2. Auth refresh link - handles token refresh on 401
  // 3. Custom HTTP link - adds auth headers and makes requests
  const links = [
    ...(import.meta.env.DEV ? [createDebugLink()] : []),
    authRefreshLink,
    customHttpLink,
  ]

  const link = ApolloLink.from(links)

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Pagination handling for listMembers
            listMembers: {
              keyArgs: ['filter'],
              merge(existing, incoming, { args }) {
                if (!args?.filter?.pagination) {
                  return incoming
                }

                const page = args.filter.pagination.page || 1

                if (page === 1) {
                  return incoming
                }

                const existingItems = existing?.items || []
                const incomingItems = incoming?.items || []

                return {
                  ...incoming,
                  items: [...existingItems, ...incomingItems],
                }
              },
            },
            // Pagination handling for listPayments
            listPayments: {
              keyArgs: ['filter'],
              merge(existing, incoming, { args }) {
                if (!args?.filter?.pagination) {
                  return incoming
                }

                const page = args.filter.pagination.page || 1

                if (page === 1) {
                  return incoming
                }

                const existingItems = existing?.items || []
                const incomingItems = incoming?.items || []

                return {
                  ...incoming,
                  items: [...existingItems, ...incomingItems],
                }
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    connectToDevTools: import.meta.env.DEV,
  })

  // Store the client instance in the singleton
  setApolloClientInstance(client)

  return client
}

/**
 * Export a default instance for backward compatibility
 * This will be initialized when the module is imported
 */
export const apolloClient = createApolloClient()
