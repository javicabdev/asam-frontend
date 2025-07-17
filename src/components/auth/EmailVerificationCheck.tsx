import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';

/**
 * Component that checks email verification status and handles automatic
 * email sending for unverified users after login
 */
export const EmailVerificationCheck: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const checkEmailVerification = async () => {
      console.log('EmailVerificationCheck - Starting check:', {
        isAuthenticated,
        user: user?.username,
        emailVerified: user?.emailVerified,
      });

      // If not authenticated, redirect to login
      if (!isAuthenticated || !user) {
        navigate('/login');
        return;
      }

      // If email is already verified, go to dashboard
      if (user.emailVerified) {
        navigate('/dashboard');
        return;
      }

      // Email not verified - navigate to pending page
      // The pending page will handle sending the verification email
      console.log('Email not verified, navigating to pending page');
      navigate('/email-verification-pending');
    };

    // Small delay to ensure state is stable
    const timer = setTimeout(() => {
      checkEmailVerification();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigate]);

  // Show loading while checking
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
};
