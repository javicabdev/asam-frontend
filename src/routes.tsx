import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load pages for better performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })))
const RequestPasswordResetPage = lazy(() => import('@/pages/auth/RequestPasswordResetPage').then(module => ({ default: module.RequestPasswordResetPage })))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })))
const UnauthorizedPage = lazy(() => import('@/pages/error/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const MembersPage = lazy(() => import('@/pages/MembersPage'))
const FamiliesPage = lazy(() => import('@/pages/FamiliesPage'))
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'))
const CashFlowPage = lazy(() => import('@/pages/CashFlowPage'))
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

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/request-password-reset" element={<RequestPasswordResetPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/:id" element={<MembersPage />} />
            <Route path="/families" element={<FamiliesPage />} />
            <Route path="/families/:id" element={<FamiliesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/cash-flow" element={<CashFlowPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
