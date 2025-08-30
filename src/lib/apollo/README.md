# Apollo Client Configuration

## Architecture

The Apollo Client uses a chain of links following the Single Responsibility Principle. Each link has a single, well-defined responsibility.

### Link Chain Order
```
Request Flow:
  ↓ debugLink (dev only) - Logs operations for debugging
  ↓ authRefreshLink     - Handles token refresh on 401 errors
  ↓ authLink           - Adds authentication headers
  ↓ httpLink          - Makes the actual HTTP request
  ↓
Server
```

### Links Description

- **debugLink** (`links/debugLink.ts`): Development-only link that logs all GraphQL operations and responses
- **authRefreshLink** (`links/authRefreshLink.ts`): Intercepts 401 errors and attempts to refresh the access token using the refresh token
- **authLink** (`links/authLink.ts`): Adds authentication headers to requests (except public operations)
- **httpLink** (`links/httpLink.ts`): Standard HTTP transport link for making requests to the GraphQL server

### Key Files

- `client.ts` - Main Apollo Client configuration and initialization
- `apolloClientInstance.ts` - Singleton instance management
- `tokenManager.ts` - Token storage and refresh logic
- `links/` - Directory containing all Apollo Link implementations

### Public Operations

The following operations don't require authentication and will not have auth headers added:

- `VerifyEmail`
- `ResendVerificationEmail`
- `RequestPasswordReset`
- `ResetPasswordWithToken`
- `Login`
- `Register`

### Token Management

Tokens are managed by the `tokenManager.ts` which handles:
- Access token storage in memory
- Refresh token storage in localStorage
- Token expiration checks
- Automatic token refresh when needed
- Token clearing on logout

### How Authentication Works

1. **Request Initiated**: A GraphQL operation is initiated
2. **Debug Logging** (dev only): The operation is logged
3. **Token Refresh Check**: If a 401 error occurs, `authRefreshLink` attempts to refresh the token
4. **Add Auth Headers**: `authLink` adds the Authorization header if:
   - The operation is not public
   - A valid access token exists
   - The operation doesn't have `skipAuthLink` context
5. **HTTP Request**: `httpLink` makes the actual HTTP request to the server

### Context Options

You can pass context options to skip authentication:

```typescript
const { data } = await apolloClient.query({
  query: MY_QUERY,
  context: {
    skipAuthLink: true  // Skip adding auth headers
  }
})
```

### Debugging

Enable debug logging by running in development mode. The `debugLink` will log:
- Operation names
- Variables
- Response data
- Errors
- Timing information

### Testing

- `links/testAuthLink.ts` - Simplified auth link for testing purposes

### Migration Notes

Previously, the implementation used a `customHttpLink` that combined both authentication and HTTP transport responsibilities. This has been refactored into separate links for better maintainability and testability.

### Cache Configuration

The cache is configured with:
- Type policies for pagination handling
- Custom merge functions for paginated queries
- Support for `listMembers` and `listPayments` pagination
