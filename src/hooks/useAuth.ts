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
        clearAuthData();
      }
      
      setLoading(false);
      fetchingUserRef.current = false;
    },
  });

  // Función para obtener el usuario actual de forma segura
  const fetchCurrentUser = useCallback(async () => {
    if (!isAuthenticated || !accessToken || fetchingUserRef.current) {
      return;
    }

    fetchingUserRef.current = true;
    
    // Pequeño delay para asegurar que el token esté en Apollo Client
    await new Promise(resolve => setTimeout(resolve, 100));
    
    getCurrentUser();
  }, [isAuthenticated, accessToken, getCurrentUser]);

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

          // Esperar un poco más para asegurar que el store se actualice
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Force Apollo Client to update its auth link with the new token
          await apolloClient.resetStore();

          // Check if email is verified before navigating
          if (!user.emailVerified) {
            navigate('/email-verification-check');
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

  // Send verification email with retry logic
  const sendVerificationEmailHandler = useCallback(async () => {
    const maxRetries = 2;
    let lastError: any = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const currentState = useAuthStore.getState();
        
        // Validate prerequisites
        if (!currentState.isAuthenticated || !currentState.accessToken) {
          return {
            success: false,
            message: 'Debes iniciar sesión para verificar tu email',
          };
        }
        
        // If user email is already verified, no need to send
        if (currentState.user?.emailVerified) {
          return {
            success: false,
            message: 'Tu email ya está verificado',
          };
        }
        
        // Add a small delay on retries to allow token to propagate
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
        
        const { data, errors } = await sendVerificationEmail();
        
        // If successful, return immediately
        if (data?.sendVerificationEmail?.success) {
          return {
            success: true,
            message: data.sendVerificationEmail.message || 'Email de verificación enviado',
          };
        }
        
        // If not successful but not an auth error, return the error
        const errorMessage = data?.sendVerificationEmail?.message || data?.sendVerificationEmail?.error;
        if (errorMessage && !errorMessage.includes('UNAUTHORIZED') && !errorMessage.includes('401')) {
          return {
            success: false,
            message: errorMessage,
          };
        }
        
        // If it's an auth error and we have retries left, continue
        lastError = new Error(errorMessage || 'Failed to send verification email');
        
      } catch (error: any) {
        lastError = error;
        
        // If it's not an auth error or we're out of retries, return the error
        if (attempt === maxRetries || 
            (!error.message?.includes('UNAUTHORIZED') && !error.message?.includes('401'))) {
          return {
            success: false,
            message: error.message || 'Error al enviar el email de verificación',
          };
        }
      }
    }
    
    // If we get here, all retries failed
    return {
      success: false,
      message: lastError?.message || 'Error al enviar el email de verificación después de varios intentos',
    };
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
    // Solo intentar obtener el usuario si:
    // 1. Está autenticado
    // 2. No tiene usuario cargado
    // 3. Tiene un token de acceso
    // 4. No está cargando actualmente
    if (isAuthenticated && !user && accessToken && !userLoading && !fetchingUserRef.current) {
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