import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { apolloClient } from '@/lib/apollo-client';
import {
  useLoginMutation,
  useLogoutMutation,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordWithTokenMutation,
  useChangePasswordMutation,
} from '@/graphql/generated/operations';

/**
 * A lightweight version of useAuth for public pages (login, register, etc.)
 * that doesn't attempt to fetch the current user
 */
export const useAuthPublic = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    login: setAuthData,
    logout: clearAuthData,
  } = useAuthStore();

  // GraphQL mutations
  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [resetPasswordWithToken] = useResetPasswordWithTokenMutation();

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        console.log('Starting login for:', username);
        
        const { data } = await loginMutation({
          variables: {
            input: { username, password },
          },
        });

        if (data?.login) {
          const { user, accessToken, refreshToken, expiresAt } = data.login;
          
          console.log('Login successful:', {
            user: user.username,
            expiresAt,
            expiresAtDate: new Date(expiresAt).toISOString(),
            currentTime: new Date().toISOString(),
          });
          
          // Store auth data
          setAuthData({
            user,
            accessToken,
            refreshToken,
            expiresAt,
          });

          // Navigate to dashboard
          navigate('/dashboard');
          
          return { success: true };
        }

        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      } catch (error: any) {
        console.error('Login error:', error);
        return { 
          success: false, 
          error: error.message || 'Login failed' 
        };
      }
    },
    [loginMutation, setAuthData, navigate]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout mutation
      await logoutMutation();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless
      clearAuthData();
      
      // Clear Apollo cache
      await apolloClient.clearStore();
      
      // Navigate to login
      navigate('/login');
    }
  }, [logoutMutation, clearAuthData, navigate]);

  // Send verification email
  const sendVerificationEmailHandler = useCallback(async () => {
    try {
      const { data } = await sendVerificationEmail();
      return {
        success: data?.sendVerificationEmail?.success || false,
        message: data?.sendVerificationEmail?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send verification email',
      };
    }
  }, [sendVerificationEmail]);

  // Verify email with token
  const verifyEmailHandler = useCallback(
    async (token: string) => {
      try {
        const { data } = await verifyEmail({
          variables: { token },
        });
        
        return {
          success: data?.verifyEmail?.success || false,
          message: data?.verifyEmail?.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to verify email',
        };
      }
    },
    [verifyEmail]
  );

  // Request password reset
  const requestPasswordResetHandler = useCallback(
    async (email: string) => {
      try {
        const { data } = await requestPasswordReset({
          variables: { email },
        });
        
        return {
          success: data?.requestPasswordReset?.success || false,
          message: data?.requestPasswordReset?.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to request password reset',
        };
      }
    },
    [requestPasswordReset]
  );

  // Reset password with token
  const resetPasswordWithTokenHandler = useCallback(
    async (token: string, newPassword: string) => {
      try {
        const { data } = await resetPasswordWithToken({
          variables: { token, newPassword },
        });
        
        return {
          success: data?.resetPasswordWithToken?.success || false,
          message: data?.resetPasswordWithToken?.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to reset password',
        };
      }
    },
    [resetPasswordWithToken]
  );

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginLoading || logoutLoading,
    
    // Actions
    login,
    logout,
    sendVerificationEmail: sendVerificationEmailHandler,
    verifyEmail: verifyEmailHandler,
    requestPasswordReset: requestPasswordResetHandler,
    resetPasswordWithToken: resetPasswordWithTokenHandler,
  };
};
