import { ApolloClient, InMemoryCache, ApolloLink, FieldPolicy } from '@apollo/client'
import { createCustomHttpLink } from './links/customHttpLink'
import { createDebugLink } from './links/debugLink'
import { createAuthRefreshLink } from './links/authRefreshLink'
import { setApolloClientInstance } from './apolloClientInstance'
import type { Member, Payment } from '@/graphql/generated/operations'

interface PaginatedResult<T = unknown> {
  items?: T[]
  pagination?: {
    page?: number
    total?: number
    totalPages?: number
  }
}

interface PaginationArgs {
  filter?: {
    pagination?: {
      page?: number
      pageSize?: number
    }
  }
}

/**
 * Creates a field policy for paginated queries
 * Handles merging of paginated results when fetching additional pages
 */
const createPaginationFieldPolicy = <T = unknown>(): FieldPolicy<PaginatedResult<T>> => ({
  keyArgs: ['filter'],
  merge(
    existing: PaginatedResult<T> | undefined,
    incoming: PaginatedResult<T>,
    { args }
  ) {
    // Cast args to our expected type, handling null case
    const paginationArgs = args as PaginationArgs | null | undefined
    
    // If no pagination args, replace entirely
    if (!paginationArgs?.filter?.pagination) {
      return incoming
    }

    const page = paginationArgs.filter.pagination.page || 1

    // First page replaces all existing data
    if (page === 1) {
      return incoming
    }

    // Subsequent pages append to existing items
    const existingItems = existing?.items || []
    const incomingItems = incoming?.items || []

    return {
      ...incoming,
      items: [...existingItems, ...incomingItems],
    }
  },
})

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
            // Pagination handling for listMembers with typed Member items
            listMembers: createPaginationFieldPolicy<Member>(),
            // Pagination handling for listPayments with typed Payment items
            listPayments: createPaginationFieldPolicy<Payment>(),
            // Add more paginated queries here as needed
            // listAnotherEntity: createPaginationFieldPolicy(),
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
    // Apollo Client automatically connects to DevTools in development
    // The connectToDevTools option is deprecated and no longer needed
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
