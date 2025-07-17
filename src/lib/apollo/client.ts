import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { createCustomHttpLink } from './links/customHttpLink';
import { createDebugLink } from './links/debugLink';

// Get GraphQL endpoint
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql';

/**
 * Create the Apollo Client instance
 * Using customHttpLink that handles auth internally
 * 
 * NOTE: This is a working solution that replaces the problematic
 * auth link chain. The customHttpLink handles authentication
 * directly in the fetch request, which we've verified works.
 */
export const createApolloClient = () => {
  console.log('🏭 Creating Apollo Client with customHttpLink that handles auth internally');
  
  // Create the custom HTTP link that handles auth
  const customHttpLink = createCustomHttpLink(GRAPHQL_URL);
  
  // Add debug link in development
  const link = import.meta.env.DEV 
    ? ApolloLink.from([createDebugLink(), customHttpLink])
    : customHttpLink;

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
// This is created once at module load time
export const apolloClient = createApolloClient();

// Export a function to get the current client (for future use if needed)
export const getApolloClient = () => apolloClient;
