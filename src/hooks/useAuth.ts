import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { apolloClient } from '@/lib/apollo-client';
import {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordWithTokenMutation,
  useChangePasswordMutation,
} from '@/graphql/generated/operations';

export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    login: setAuthData,
    logout: clearAuthData,
    setUser,
    setLoading,
  } = useAuthStore();

  // GraphQL mutations
  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [resetPasswordWithToken] = useResetPasswordWithTokenMutation();
  const [changePassword] = useChangePasswordMutation();

  // Get current user query (skip if not authenticated)
  const { refetch: refetchUser } = useGetCurrentUserQuery({
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data.getCurrentUser) {
        setUser(data.getCurrentUser);
      }
    },
    onError: () => {
      // If we can't get the current user, logout
      clearAuthData();
    },
  });

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const { data } = await loginMutation({
          variables: {
            input: { username, password },
          },
        });

        if (data?.login) {
          const { user, accessToken, refreshToken, expiresAt } = data.login;
          
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
        
        if (data?.verifyEmail?.success) {
          // Refetch user to update email verification status
          await refetchUser();
        }
        
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
    [verifyEmail, refetchUser]
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

  // Change password (for authenticated users)
  const changePasswordHandler = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        const { data } = await changePassword({
          variables: {
            input: { currentPassword, newPassword },
          },
        });
        
        return {
          success: data?.changePassword?.success || false,
          message: data?.changePassword?.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || 'Failed to change password',
        };
      }
    },
    [changePassword]
  );

  // Check authentication on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      refetchUser();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, refetchUser, setLoading]);

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
    changePassword: changePasswordHandler,
    refetchUser,
  };
};
