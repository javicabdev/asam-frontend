import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { lazyWithPreload, preloadOnIdle } from '@/utils/lazyWithPreload'

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

const PaymentsPage = lazyWithPreload(() => import('@/pages/PaymentsPage'))

const CashFlowPage = lazyWithPreload(() => import('@/pages/CashFlowPage'))

const ProfilePage = lazyWithPreload(() => import('@/pages/profile/ProfilePage'), 'ProfilePage')

const ReportsPage = lazyWithPreload(() => import('@/pages/ReportsPage'))

// Layout components
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'

// Auth guard component
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Loading component
const LoadingScreen = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
)

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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/new" element={<NewMemberPage />} />
            <Route path="/members/:id" element={<MemberDetailsPage />} />
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
