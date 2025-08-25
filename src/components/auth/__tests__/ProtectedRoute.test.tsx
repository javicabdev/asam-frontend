import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
// Import types needed for mocking
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Navigate, Outlet } from 'react-router-dom'
import { render } from '@/test/test-utils'
import { ProtectedRoute } from '../ProtectedRoute'
import * as useAuthModule from '@/hooks/useAuth'

// Mock the useAuth hook
vi.mock('@/hooks/useAuth')

// Mock react-router-dom components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate">Navigate to {to}</div>),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet Component</div>),
    useLocation: vi.fn(() => ({ pathname: '/test-path' })),
  }
})

describe('ProtectedRoute', () => {
  const mockUseAuth = vi.mocked(useAuthModule.useAuth)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner when authentication is being checked', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Authentication', () => {
    it('should redirect to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute />)

      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByText('Navigate to /login')).toBeInTheDocument()
    })

    it('should redirect to custom path when specified', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute redirectTo="/custom-login" />)

      expect(screen.getByText('Navigate to /custom-login')).toBeInTheDocument()
    })

    it('should render Outlet when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute />)

      expect(screen.getByTestId('outlet')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
    })

    it('should render children when provided instead of Outlet', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(
        <ProtectedRoute>
          <div data-testid="custom-child">Custom Child Component</div>
        </ProtectedRoute>
      )

      expect(screen.getByTestId('custom-child')).toBeInTheDocument()
      expect(screen.queryByTestId('outlet')).not.toBeInTheDocument()
    })
  })

  describe('Email Verification', () => {
    it('should allow access when email verification is not required', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute />)

      expect(screen.getByTestId('outlet')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
    })

    it('should redirect to email verification when required and user email is not verified', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute requireEmailVerification />)

      expect(screen.getByTestId('navigate')).toBeInTheDocument()
      expect(screen.getByText('Navigate to /email-verification-check')).toBeInTheDocument()
    })

    it('should allow access when email verification is required and user email is verified', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute requireEmailVerification />)

      expect(screen.getByTestId('outlet')).toBeInTheDocument()
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user gracefully', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      render(<ProtectedRoute requireEmailVerification />)

      // Should render outlet since user is authenticated but null
      expect(screen.getByTestId('outlet')).toBeInTheDocument()
    })

    it('should update when authentication state changes', async () => {
      const { rerender } = render(<ProtectedRoute />)

      // Initially not authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      rerender(<ProtectedRoute />)
      expect(screen.getByTestId('navigate')).toBeInTheDocument()

      // Change to authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn(),
      })

      rerender(<ProtectedRoute />)
      
      await waitFor(() => {
        expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
        expect(screen.getByTestId('outlet')).toBeInTheDocument()
      })
    })
  })
})
