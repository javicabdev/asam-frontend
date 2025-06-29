import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import { createAuthLink } from './links/authLink';
import { createErrorLink } from './links/errorLink';

/**
 * Create the HTTP link for GraphQL requests
 */
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql',
  credentials: 'include', // Include cookies if needed
});

/**
 * Create the Apollo Client instance with automatic token refresh
 */
export const createApolloClient = () => {
  // Create links
  const authLink = createAuthLink();
  const errorLink = createErrorLink();

  // Combine links in the correct order: error handling -> auth -> http
  const link = from([errorLink, authLink, httpLink]);

  return new ApolloClient({
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
                  return incoming;
                }
                
                const page = args.filter.pagination.page || 1;
                if (page === 1) {
                  return incoming;
                }
                
                return {
                  ...incoming,
                  nodes: [...(existing?.nodes || []), ...incoming.nodes],
                };
              },
            },
            // Pagination handling for listFamilies
            listFamilies: {
              keyArgs: ['filter'],
              merge(existing, incoming, { args }) {
                if (!args?.filter?.pagination) {
                  return incoming;
                }
                
                const page = args.filter.pagination.page || 1;
                if (page === 1) {
                  return incoming;
                }
                
                return {
                  ...incoming,
                  nodes: [...(existing?.nodes || []), ...incoming.nodes],
                };
              },
            },
            // Pagination handling for getTransactions
            getTransactions: {
              keyArgs: ['filter'],
              merge(existing, incoming, { args }) {
                if (!args?.filter?.pagination) {
                  return incoming;
                }
                
                const page = args.filter.pagination.page || 1;
                if (page === 1) {
                  return incoming;
                }
                
                return {
                  ...incoming,
                  nodes: [...(existing?.nodes || []), ...incoming.nodes],
                };
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
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

// Create and export the Apollo Client instance
export const apolloClient = createApolloClient();
