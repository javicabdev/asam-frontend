import { useAuthStore } from '@/stores/authStore';

/**
 * Función helper para debugging del sistema de autenticación
 * Usar en la consola del navegador
 */
export const debugAuth = () => {
  const state = useAuthStore.getState();
  
  console.group('🔍 Auth Debug Info');
  console.log('State:', {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    accessToken: state.accessToken ? 'Present' : 'Missing',
    refreshToken: state.refreshToken ? 'Present' : 'Missing',
    expiresAt: state.expiresAt,
    isExpired: state.isTokenExpired(),
  });
  console.log('Local Storage:', localStorage.getItem('auth-storage'));
  console.groupEnd();
  
  return state;
};

// Exponer globalmente para debugging
if (import.meta.env.DEV) {
  (window as any).debugAuth = debugAuth;
}
