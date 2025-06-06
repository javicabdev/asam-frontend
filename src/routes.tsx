import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { CircularProgress, Box } from '@mui/material'

// Lazy load pages for better performance
const LoginPage = lazy(() => import('@/pages/LoginPage'))
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
import { PrivateRoute } from '@/components/PrivateRoute'

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

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Private routes */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<MembersPage />} />
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/families/:id" element={<FamiliesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/cash-flow" element={<CashFlowPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
