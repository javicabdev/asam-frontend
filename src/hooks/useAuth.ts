import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { apolloClient } from '@/lib/apollo-client';
import { tokenManager } from '@/lib/apollo/tokenManager';
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

          // Debug: Log user data
          console.log('[Login Debug] User data:', {
            username: user.username,
            emailVerified: user.emailVerified,
            email: user.email,
            fullUser: user
          });

          // Check if email is verified before navigating
          if (!user.emailVerified) {
            console.log('[Login Debug] Email NOT verified, redirecting to verification check');
            navigate('/email-verification-check');
          } else {
            console.log('[Login Debug] Email verified, redirecting to dashboard');
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

  // Send verification email with improved error handling
  const sendVerificationEmailHandler = useCallback(async () => {
    const maxRetries = 3;
    
    console.log('[useAuth] Starting email verification send process');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const currentState = useAuthStore.getState();
        
        // Validate prerequisites
        if (!currentState.isAuthenticated || !currentState.accessToken) {
          console.error('[useAuth] Not authenticated for email verification');
          return {
            success: false,
            message: 'Debes iniciar sesión para verificar tu email',
          };
        }
        
        // If user email is already verified, no need to send
        if (currentState.user?.emailVerified) {
          console.log('[useAuth] Email already verified');
          return {
            success: false,
            message: 'Tu email ya está verificado',
          };
        }
        
        console.log(`[useAuth] Email verification attempt ${attempt}/${maxRetries}`);
        
        // For retry attempts, wait and ensure token is fresh
        if (attempt > 1) {
          const delay = 1000 * Math.pow(2, attempt - 2); // Exponential backoff
          console.log(`[useAuth] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Ensure we have a valid token before retrying
          const validToken = await tokenManager.getValidAccessToken();
          if (!validToken) {
            console.error('[useAuth] Failed to get valid token for retry');
            return {
              success: false,
              message: 'Error de autenticación. Por favor, vuelve a iniciar sesión.',
            };
          }
          
          // Force Apollo Client to use the new token
          await apolloClient.resetStore();
        } else {
          // On first attempt, just ensure store is synced
          await apolloClient.resetStore();
          // Small delay to ensure token propagation
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const { data, errors } = await sendVerificationEmail({
          context: {
            // Add a timestamp to prevent caching
            fetchOptions: {
              headers: {
                'X-Request-ID': `verify-email-${Date.now()}`,
              },
            },
          },
        });
        
        // Check for GraphQL errors
        if (errors && errors.length > 0) {
          const authError = errors.find(e => 
            e.extensions?.code === 'UNAUTHENTICATED' ||
            e.message.includes('UNAUTHORIZED')
          );
          
          if (authError && attempt < maxRetries) {
            console.log('[useAuth] Auth error detected, will retry');
            continue;
          }
        }
        
        // If successful, return immediately
        if (data?.sendVerificationEmail?.success) {
          console.log('[useAuth] Email verification sent successfully');
          return {
            success: true,
            message: data.sendVerificationEmail.message || 'Email de verificación enviado',
          };
        }
        
        // If not successful but not an auth error, return the error
        const errorMessage = data?.sendVerificationEmail?.message || data?.sendVerificationEmail?.error;
        if (errorMessage && !errorMessage.includes('UNAUTHORIZED') && !errorMessage.includes('401')) {
          console.log('[useAuth] Non-auth error:', errorMessage);
          return {
            success: false,
            message: errorMessage,
          };
        }
        
        // If it's an auth error and we have retries left, continue
        console.log('[useAuth] Auth error, will retry if attempts remain');
        
      } catch (error: any) {
        console.error(`[useAuth] Exception on attempt ${attempt}:`, error);
        
        // Check if it's an auth error
        const isAuthError = 
          error.message?.includes('UNAUTHORIZED') || 
          error.message?.includes('401') ||
          error.graphQLErrors?.some((e: any) => 
            e.extensions?.code === 'UNAUTHENTICATED'
          );
        
        // If it's not an auth error or we're out of retries, return the error
        if (!isAuthError || attempt === maxRetries) {
          return {
            success: false,
            message: error.message || 'Error al enviar el email de verificación',
          };
        }
      }
    }
    
    // If we get here, all retries failed
    console.error('[useAuth] All email verification attempts failed');
    return {
      success: false,
      message: 'Error al enviar el email de verificación. Por favor, contacta con soporte.',
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