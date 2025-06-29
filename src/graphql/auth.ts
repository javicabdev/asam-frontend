// Re-export from generated files
export * from '../generated/operations';

// Mantener compatibilidad con imports antiguos
export {
  LoginDocument as LOGIN_MUTATION,
  LogoutDocument as LOGOUT_MUTATION,  
  RefreshTokenDocument as REFRESH_TOKEN_MUTATION,
  ChangePasswordDocument as CHANGE_PASSWORD_MUTATION,
  SendVerificationEmailDocument as SEND_VERIFICATION_EMAIL_MUTATION,
  VerifyEmailDocument as VERIFY_EMAIL_MUTATION,
  RequestPasswordResetDocument as REQUEST_PASSWORD_RESET_MUTATION,
  ResetPasswordWithTokenDocument as RESET_PASSWORD_WITH_TOKEN_MUTATION,
  GetCurrentUserDocument as GET_CURRENT_USER_QUERY
} from '../generated/operations';
