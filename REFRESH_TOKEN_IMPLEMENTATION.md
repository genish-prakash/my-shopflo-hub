# Refresh Token Implementation

This document explains the automatic token refresh mechanism implemented for handling 401 and 403 authentication errors.

## Overview

The refresh token interceptor automatically refreshes expired access tokens when API requests receive 401 (Unauthorized) or 403 (Forbidden) responses. This provides a seamless authentication experience without requiring users to log in again.

## Architecture

### Key Components

1. **[refreshTokenInterceptor.ts](src/lib/refreshTokenInterceptor.ts)** - Core interceptor logic
2. **[authApi.ts](src/services/authApi.ts)** - Token refresh API endpoint
3. **[authenticatedApi.ts](src/services/authenticatedApi.ts)** - Mystique API client with interceptor
4. **[api.ts](src/services/api.ts)** - Main API client with interceptor

## How It Works

### Flow Diagram

```
API Request → 401/403 Error → Check if Refreshing
                                      ↓
                          Yes ← Is Refreshing? → No
                           ↓                      ↓
                    Queue Request          Set Refreshing = true
                           ↓                      ↓
                    Wait for Token        Call Refresh API
                           ↓                      ↓
                    Process Queue ← Success? → Redirect to Login
                           ↓              ↓
                    Retry Request    Clear Auth
```

### Key Features

1. **Request Queueing**: When a token refresh is in progress, subsequent failed requests are queued and retried after the new token is obtained.

2. **Retry Mechanism**: Up to 3 retry attempts with automatic reset on successful requests.

3. **Token Storage**: Automatically updates cookies with new access and refresh tokens.

4. **Graceful Fallback**: Redirects to login page if refresh fails after max retries.

5. **Public Endpoints**: Supports marking requests as public to skip token refresh logic.

## Implementation Details

### Token Storage

Tokens are stored in cookies:
- `shopflo_access_token` - 1 hour expiry
- `shopflo_refresh_token` - 30 days expiry

### API Endpoint

**Refresh Token Endpoint**: `POST https://api.shopflo.co/heimdall/api/v1/token/refresh`

**Request Payload**:
```json
{
  "refresh_token": "your-refresh-token",
  "merchant_id": "081418d4-1d30-4e25-bfc0-851fb6df5e13"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "new-access-token",
    "token_type": "Bearer",
    "access_token_expires_at": 1234567890,
    "refresh_token": "new-refresh-token",
    "refresh_token_expires_at": 1234567890
  }
}
```

## Usage

### Automatic Usage

The interceptor is automatically set up for:
- All requests through `authenticatedApiClient` (Mystique APIs)
- All requests through `apiClient` (Main API client)

No additional code is needed in your components or services!

### Marking Public Endpoints

For endpoints that don't require authentication (like login, signup):

```typescript
import { markAsPublicRequest } from '@/lib/refreshTokenInterceptor';

// Option 1: Using axios directly
axios.get('/public-endpoint', {
  ...markAsPublicRequest({} as any)
});

// Option 2: Add _isPublic flag to request config
axios.get('/public-endpoint', {
  _isPublic: true
} as any);
```

## Configuration

### Max Retries

Default: 3 attempts

To modify, update `MAX_RETRIES` in [refreshTokenInterceptor.ts](src/lib/refreshTokenInterceptor.ts:16):

```typescript
const MAX_RETRIES = 3; // Change this value
```

### Token Expiry

Modify token expiry times in [authApi.ts](src/services/authApi.ts:186-187):

```typescript
Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1 / 24, path: "/" }); // 1 hour
Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30, path: "/" }); // 30 days
```

## Error Handling

### Scenarios Handled

1. **401 Unauthorized**: Access token expired → Refresh automatically
2. **403 Forbidden**: Access token invalid → Refresh automatically
3. **Refresh Failed**: Redirect to login page
4. **Max Retries Exceeded**: Redirect to login page
5. **No Refresh Token**: Redirect to login page

### Logging

All refresh attempts and errors are logged to the console:

```typescript
console.error('Failed to refresh access token:', error);
console.error('No refresh token available');
```

## Testing

### Test Scenarios

1. **Expired Token**:
   - Make API request with expired access token
   - Verify token is automatically refreshed
   - Verify original request succeeds

2. **Concurrent Requests**:
   - Make multiple API requests with expired token
   - Verify only one refresh call is made
   - Verify all requests succeed after refresh

3. **Failed Refresh**:
   - Mock refresh API to fail
   - Verify user is redirected to login

4. **Public Endpoints**:
   - Make request to public endpoint with expired token
   - Verify no refresh is attempted

### Manual Testing

1. Clear cookies to simulate expired token
2. Navigate to protected page
3. Check Network tab for refresh token call
4. Verify new tokens are stored in cookies

## Migration Guide

### From Old Interceptor

**Before** (old authenticatedApi.ts):
```typescript
authenticatedApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("shopflo_access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
```

**After** (new authenticatedApi.ts):
```typescript
import { setupRefreshTokenInterceptor } from "@/lib/refreshTokenInterceptor";

setupRefreshTokenInterceptor(authenticatedApiClient);
```

## Security Considerations

1. **Token Storage**: Tokens are stored in HTTP-only cookies (recommended for production)
2. **HTTPS Only**: Ensure your app uses HTTPS in production
3. **Token Rotation**: Refresh tokens are rotated on each refresh for enhanced security
4. **Automatic Cleanup**: Tokens are cleared on logout or refresh failure

## Troubleshooting

### Issue: Infinite Refresh Loop

**Cause**: Refresh endpoint returns 401
**Solution**: Ensure refresh endpoint doesn't trigger the interceptor (it shouldn't as it's a direct axios call)

### Issue: User Not Redirected to Login

**Cause**: Error in redirect logic
**Solution**: Check console for errors and verify `window.location.href` is not blocked

### Issue: Tokens Not Updated

**Cause**: Cookie domain mismatch
**Solution**: Verify cookie path is set to "/" in setAuthToken function

## References

- [Axios Interceptors Documentation](https://axios-http.com/docs/interceptors)
- [JWT Token Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
