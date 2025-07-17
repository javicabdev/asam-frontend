import { renderHook, act, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { 
  SendVerificationEmailDocument,
  SendVerificationEmailMutation 
} from '@/graphql/generated/operations';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Email Verification Flow', () => {
  beforeEach(() => {
    // Clear store before each test
    useAuthStore.getState().logout();
    mockNavigate.mockClear();
  });

  it('should send verification email successfully when authenticated', async () => {
    // Set up authenticated state
    useAuthStore.getState().login({
      user: {
        id: '1',
        username: 'test@example.com',
        role: 'user',
        isActive: true,
        emailVerified: false,
      },
      accessToken: 'valid-jwt-token.with.three.parts',
      refreshToken: 'refresh-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    });

    const mocks = [
      {
        request: {
          query: SendVerificationEmailDocument,
        },
        result: {
          data: {
            sendVerificationEmail: {
              success: true,
              message: 'Verification email sent successfully',
              error: null,
            },
          } as SendVerificationEmailMutation,
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.sendVerificationEmail();
    });

    await waitFor(() => {
      expect(response).toEqual({
        success: true,
        message: 'Verification email sent successfully',
      });
    });
  });

  it('should handle unauthenticated state gracefully', async () => {
    // Ensure user is not authenticated
    useAuthStore.getState().logout();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[]} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.sendVerificationEmail();
    });

    expect(response).toEqual({
      success: false,
      message: 'Debes iniciar sesión para verificar tu email',
    });
  });

  it('should handle already verified email', async () => {
    // Set up authenticated state with verified email
    useAuthStore.getState().login({
      user: {
        id: '1',
        username: 'test@example.com',
        role: 'user',
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      },
      accessToken: 'valid-jwt-token.with.three.parts',
      refreshToken: 'refresh-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={[]} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.sendVerificationEmail();
    });

    expect(response).toEqual({
      success: false,
      message: 'Tu email ya está verificado',
    });
  });

  it('should retry on auth errors', async () => {
    // Set up authenticated state
    useAuthStore.getState().login({
      user: {
        id: '1',
        username: 'test@example.com',
        role: 'user',
        isActive: true,
        emailVerified: false,
      },
      accessToken: 'valid-jwt-token.with.three.parts',
      refreshToken: 'refresh-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    });

    let callCount = 0;
    const mocks = [
      {
        request: {
          query: SendVerificationEmailDocument,
        },
        result: () => {
          callCount++;
          if (callCount === 1) {
            // First call fails with auth error
            return {
              errors: [{
                message: 'UNAUTHORIZED: Token expired',
                extensions: { code: 'UNAUTHENTICATED' },
              }],
            };
          } else {
            // Second call succeeds
            return {
              data: {
                sendVerificationEmail: {
                  success: true,
                  message: 'Email sent after retry',
                  error: null,
                },
              } as SendVerificationEmailMutation,
            };
          }
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.sendVerificationEmail();
    });

    await waitFor(() => {
      expect(callCount).toBe(2); // Should have retried
      expect(response).toEqual({
        success: true,
        message: 'Email sent after retry',
      });
    });
  });
});
