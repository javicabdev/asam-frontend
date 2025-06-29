import React from 'react';
import { Navigate } from 'react-router-dom';

// This page now redirects to RequestPasswordResetPage
// Kept for backward compatibility with existing routes
export const ForgotPasswordPage: React.FC = () => {
  return <Navigate to="/request-password-reset" replace />;
};
