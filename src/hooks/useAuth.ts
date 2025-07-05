import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { apolloClient } from '@/lib/apollo-client';
import {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserLazyQuery,
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
    accessToken,
    login: setAuthData,
    logout: clearAuthData,
    setUser,
    setLoading,
  } = useAuthStore();

  // Ref para evitar llamadas múltiples
  const fetchingUserRef = useRef(false);

  // GraphQL mutations
  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [logoutMutation, { loading: logoutLoading }] = useLogoutMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [requestPasswordReset] = useRequestPasswordResetMutation();
  const [resetPasswordWithToken] = useResetPasswordWithTokenMutation();
  const [changePassword] = useChangePasswordMutation();

  // Lazy query para control manual
  const [getCurrentUser, { loading: userLoading }] = useGetCurrentUserLazyQuery({
    fetchPolicy: 'network-only', // Siempre obtener datos frescos
    onCompleted: (data) => {
      console.log('GetCurrentUser completed:', data);
      if (data.getCurrentUser) {
        setUser(data.getCurrentUser);
      }
      setLoading(false);
      fetchingUserRef.current = false;
    },
    onError: (error) => {
      console.error('GetCurrentUser error:', error);
      
      // Verificar si es un error de autenticación real
      const isAuthError = error.graphQLErrors?.some(e => 
        e.extensions?.code === 'UNAUTHENTICATED' || 
        e.message.includes('UNAUTHORIZED')
      );
      
      if (isAuthError) {
        console.log('Authentication error detected, clearing auth state');
        clearAuthData();
      }
      
      setLoading(false);
      fetchingUserRef.current = false;
    },
  });

  // Función para obtener el usuario actual de forma segura
  const fetchCurrentUser = useCallback(async () => {
    if (!isAuthenticated || !accessToken || fetchingUserRef.current) {
      console.log('Skipping fetchCurrentUser:', {
        isAuthenticated,
        hasToken: !!accessToken,
        isFetching: fetchingUserRef.current
      });
      return;
    }

    fetchingUserRef.current = true;
    
    // Pequeño delay para asegurar que el token esté en Apollo Client
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Fetching current user with token:', {
      tokenPreview: accessToken.substring(0, 20) + '...'
    });
    
    getCurrentUser();
  }, [isAuthenticated, accessToken, getCurrentUser]);

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

          // Esperar un poco más para asegurar que el store se actualice
          await new Promise(resolve => setTimeout(resolve, 200));

          // Check if email is verified before navigating
          if (!user.emailVerified) {
            navigate('/email-verification-pending');
          } else {
            navigate('/dashboard');
          }
          
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
      const currentState = useAuthStore.getState();
      console.log('sendVerificationEmail - Current auth state:', {
        isAuthenticated: currentState.isAuthenticated,
        hasAccessToken: !!currentState.accessToken,
        accessTokenPreview: currentState.accessToken ? currentState.accessToken.substring(0, 20) + '...' : 'null',
        hasUser: !!currentState.user,
        expiresAt: currentState.expiresAt,
        isExpired: currentState.isTokenExpired(),
      });
      
      const { data, errors } = await sendVerificationEmail();
      
      console.log('sendVerificationEmail response:', {
        data,
        errors,
        success: data?.sendVerificationEmail?.success,
        message: data?.sendVerificationEmail?.message,
      });
      
      return {
        success: data?.sendVerificationEmail?.success || false,
        message: data?.sendVerificationEmail?.message || data?.sendVerificationEmail?.error,
      };
    } catch (error: any) {
      console.error('sendVerificationEmail error:', error);
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
          await fetchCurrentUser();
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
    [verifyEmail, fetchCurrentUser]
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
    console.log('useAuth - Auth state change:', {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      userEmail: user?.username,
      hasAccessToken: !!accessToken,
    });
    
    // Solo intentar obtener el usuario si:
    // 1. Está autenticado
    // 2. No tiene usuario cargado
    // 3. Tiene un token de acceso
    // 4. No está cargando actualmente
    if (isAuthenticated && !user && accessToken && !userLoading && !fetchingUserRef.current) {
      console.log('Need to fetch user data');
      fetchCurrentUser();
    } else if (!isAuthenticated || !accessToken) {
      setLoading(false);
    }
  }, [isAuthenticated, user, accessToken, userLoading, fetchCurrentUser, setLoading]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginLoading || logoutLoading || userLoading,
    
    // Actions
    login,
    logout,
    sendVerificationEmail: sendVerificationEmailHandler,
    verifyEmail: verifyEmailHandler,
    requestPasswordReset: requestPasswordResetHandler,
    resetPasswordWithToken: resetPasswordWithTokenHandler,
    changePassword: changePasswordHandler,
    refetchUser: fetchCurrentUser,
  };
};