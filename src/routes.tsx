import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load pages for better performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })))
const RequestPasswordResetPage = lazy(() => import('@/pages/auth/RequestPasswordResetPage').then(module => ({ default: module.RequestPasswordResetPage })))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })))
const EmailVerificationPendingPage = lazy(() => import('@/pages/auth/EmailVerificationPendingPage').then(module => ({ default: module.EmailVerificationPendingPage })))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then(module => ({ default: module.VerifyEmailPage })))
const EmailVerificationCheck = lazy(() => import('@/components/auth/EmailVerificationCheck').then(module => ({ default: module.EmailVerificationCheck })))
const UnauthorizedPage = lazy(() => import('@/pages/error/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const MembersPage = lazy(() => import('@/pages/MembersPage'))
const NewMemberPage = lazy(() => import('@/pages/members/NewMemberPage').then(module => ({ default: module.NewMemberPage })))
const MemberDetailsPage = lazy(() => import('@/pages/members/MemberDetailsPage').then(module => ({ default: module.MemberDetailsPage })))
const FamiliesPage = lazy(() => import('@/pages/FamiliesPage'))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'))
const CashFlowPage = lazy(() => import('@/pages/CashFlowPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })))
const ReportsPage = lazy(() => import('@/pages/ReportsPage'))

// Layout components
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'

// Auth guard component
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Loading component
const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
)

export const AppRoutes = ({ onThemeToggle, currentTheme }: { onThemeToggle?: () => void; currentTheme?: 'light' | 'dark' }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Semi-protected route - authenticated but email not verified */}
        <Route element={<AuthLayout />}>
          <Route path="/email-verification-check" element={<EmailVerificationCheck />} />
          <Route path="/email-verification-pending" element={<EmailVerificationPendingPage />} />
        </Route>

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout onThemeToggle={onThemeToggle} currentTheme={currentTheme} />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/new" element={<NewMemberPage />} />
            <Route path="/members/:id" element={<MemberDetailsPage />} />
            <Route path="/families" element={<FamiliesPage />} />
            <Route path="/families/:id" element={<FamiliesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/cash-flow" element={<CashFlowPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
