# Apollo Client Configuration

## Current Implementation

The Apollo Client is configured using a custom HTTP link (`customHttpLink`) that handles authentication directly within the fetch request. This approach was adopted after encountering issues with the standard Apollo link chain where authentication headers were not being properly propagated to the final HTTP request.

### Why customHttpLink?

The standard Apollo Client setup with separate auth, error, and HTTP links was causing authentication headers to be lost between links. After extensive debugging, we verified that:

1. ✅ Direct fetch requests with auth headers work correctly
2. ✅ The customHttpLink implementation works correctly
3. ❌ The standard Apollo link chain was not propagating headers properly

### Key Files

- `client.ts` - Main Apollo Client configuration
- `links/customHttpLink.ts` - Custom HTTP link that handles auth internally
- `links/debugLink.ts` - Debug link for development logging

### How It Works

1. The `customHttpLink` checks if an operation requires authentication
2. If authentication is needed and a token is available, it adds the Authorization header
3. The request is made using standard fetch API
4. Authentication errors (401) are handled by clearing auth state and redirecting to login

### Public Operations

The following operations do not require authentication:

- VerifyEmail
- ResendVerificationEmail
- RequestPasswordReset
- ResetPasswordWithToken
- Login
- Register

### Future Improvements

Once the root cause of the header propagation issue is identified and fixed, we can consider reverting to the standard Apollo link chain for better separation of concerns. The problematic files are preserved in the `links/` directory for reference:

- `authLink.ts` - Standard auth link (not currently used)
- `errorLink.ts` - Standard error handling link (not currently used)

### Debugging

Enable debug logging by running in development mode. The `debugLink` will log all GraphQL operations and their results.
