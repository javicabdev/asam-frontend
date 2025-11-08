import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { lazyWithPreload, preloadOnIdle } from '@/utils/lazyWithPreload'
import { useAuth } from '@/hooks/useAuth'

// Lazy load pages with preload capability
const LoginPage = lazyWithPreload(() => import('@/pages/auth/LoginPage'), 'LoginPage')

const ForgotPasswordPage = lazyWithPreload(
  () => import('@/pages/auth/ForgotPasswordPage'),
  'ForgotPasswordPage'
)

const RequestPasswordResetPage = lazyWithPreload(
  () => import('@/pages/auth/RequestPasswordResetPage'),
  'RequestPasswordResetPage'
)

const ResetPasswordPage = lazyWithPreload(
  () => import('@/pages/auth/ResetPasswordPage'),
  'ResetPasswordPage'
)

const EmailVerificationPendingPage = lazyWithPreload(
  () => import('@/pages/auth/EmailVerificationPendingPage'),
  'EmailVerificationPendingPage'
)

const VerifyEmailPage = lazyWithPreload(
  () => import('@/pages/auth/VerifyEmailPage'),
  'VerifyEmailPage'
)

const EmailVerificationCheck = lazyWithPreload(
  () => import('@/components/auth/EmailVerificationCheck'),
  'EmailVerificationCheck'
)

const UnauthorizedPage = lazyWithPreload(
  () => import('@/pages/error/UnauthorizedPage'),
  'UnauthorizedPage'
)

const DashboardPage = lazyWithPreload(() => import('@/pages/DashboardPage'))

const MembersPage = lazyWithPreload(() => import('@/pages/MembersPage'))

const NewMemberPage = lazyWithPreload(
  () => import('@/pages/members/NewMemberPage'),
  'NewMemberPage'
)

const MemberDetailsPage = lazyWithPreload(
  () => import('@/pages/members/MemberDetailsPage'),
  'MemberDetailsPage'
)

const EditMemberPage = lazyWithPreload(
  () => import('@/pages/members/EditMemberPage'),
  'EditMemberPage'
)

const PaymentsPage = lazyWithPreload(() => import('@/pages/PaymentsPage'))

const InitialPaymentPage = lazyWithPreload(
  () => import('@/pages/payments/InitialPaymentPage'),
  'InitialPaymentPage'
)

const UsersPage = lazyWithPreload(() => import('@/pages/UsersPage'))

const CashFlowPage = lazyWithPreload(() => import('@/pages/CashFlowPage'))

const ProfilePage = lazyWithPreload(() => import('@/pages/profile/ProfilePage'), 'ProfilePage')

const ReportsPage = lazyWithPreload(() => import('@/pages/ReportsPage'))

// Layout components
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'

// Auth guard components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'

// Loading component
const LoadingScreen = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
)

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  return <Navigate to={isAdmin ? '/dashboard' : '/members'} replace />
}

// Preload strategy hook
const usePreloadStrategy = () => {
  useEffect(() => {
    // Preload critical pages when browser is idle
    const criticalPages = [DashboardPage, MembersPage]

    // Preload after initial render
    const timer = setTimeout(() => {
      criticalPages.forEach((page) => preloadOnIdle(page))
    }, 1000)

    // Also preload based on current route
    const currentPath = window.location.pathname

    // If on login page, preload dashboard
    if (currentPath === '/login') {
      preloadOnIdle(DashboardPage)
    }

    // If on dashboard, preload commonly accessed pages
    if (currentPath === '/dashboard') {
      preloadOnIdle(MembersPage)
      preloadOnIdle(PaymentsPage)
    }

    // If on members page, preload detail and new member pages
    if (currentPath === '/members') {
      preloadOnIdle(MemberDetailsPage)
      preloadOnIdle(NewMemberPage)
    }

    // If on new member page, preload initial payment page
    if (currentPath === '/members/new') {
      preloadOnIdle(InitialPaymentPage)
    }

    return () => clearTimeout(timer)
  }, [])
}

export const AppRoutes = () => {
  // Apply preload strategy
  usePreloadStrategy()

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
          <Route element={<MainLayout />}>
            <Route path="/" element={<RoleBasedRedirect />} />
            
            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/cash-flow" element={<CashFlowPage />} />
            </Route>

            {/* Routes accessible to all authenticated users */}
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/new" element={<NewMemberPage />} />
            <Route path="/members/:id" element={<MemberDetailsPage />} />
            <Route path="/members/:id/edit" element={<EditMemberPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/initial/:memberId" element={<InitialPaymentPage />} />
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
