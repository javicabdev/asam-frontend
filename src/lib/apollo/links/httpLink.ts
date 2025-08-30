import { HttpLink } from '@apollo/client'

/**
 * Creates a standard HTTP link for GraphQL requests
 * This link is responsible ONLY for HTTP transport, not authentication
 * 
 * Authentication is handled by the authLink in the chain
 */
export const createHttpLink = (uri: string): HttpLink => {
  return new HttpLink({
    uri,
    // Use 'include' to send cookies with requests (for refresh tokens)
    credentials: 'include',
    // Standard fetch options
    fetchOptions: {
      mode: 'cors',
    },
    // Headers will be added by authLink, not here
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
