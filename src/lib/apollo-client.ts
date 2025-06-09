import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || '/graphql',
})

// Authentication middleware
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Error handling middleware
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          // Handle token refresh here
          console.error('Authentication error:', err)
          // Redirect to login if needed
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 'FORBIDDEN':
          console.error('Permission error:', err)
          break
        default:
          console.error('GraphQL error:', err)
      }
    }
  }

  if (networkError) {
    console.error('Network error:', networkError)
  }
})

// Combine all links
const link = ApolloLink.from([errorLink, authLink, httpLink])

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
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
              
              return {
                ...incoming,
                nodes: [...(existing?.nodes || []), ...incoming.nodes],
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
  },
})
