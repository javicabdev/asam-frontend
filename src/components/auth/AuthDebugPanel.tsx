import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';

export const AuthDebugPanel: React.FC = () => {
  const state = useAuthStore();
  
  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };
  
  return (
    <Paper sx={{ position: 'fixed', bottom: 20, right: 20, p: 2, maxWidth: 400, zIndex: 9999 }}>
      <Typography variant="h6" gutterBottom>Auth Debug Info</Typography>
      <Box sx={{ fontSize: '12px', fontFamily: 'monospace' }}>
        <div>isAuthenticated: {String(state.isAuthenticated)}</div>
        <div>isLoading: {String(state.isLoading)}</div>
        <div>user: {state.user?.username || 'null'}</div>
        <div>role: {state.user?.role || 'null'}</div>
        <div>emailVerified: {String(state.user?.emailVerified) || 'null'}</div>
        <div>hasAccessToken: {state.accessToken ? 'yes' : 'no'}</div>
        <div>hasRefreshToken: {state.refreshToken ? 'yes' : 'no'}</div>
        <div>expiresAt: {state.expiresAt || 'null'}</div>
        {state.expiresAt && (
          <>
            <div>expiresAtDate: {new Date(state.expiresAt).toLocaleString()}</div>
            <div>currentTime: {new Date().toLocaleString()}</div>
            <div>isExpired: {String(state.isTokenExpired())}</div>
          </>
        )}
      </Box>
      <Button 
        size="small" 
        onClick={clearLocalStorage} 
        sx={{ mt: 1 }}
        variant="outlined"
        color="error"
      >
        Clear Auth & Reload
      </Button>
    </Paper>
  );
};