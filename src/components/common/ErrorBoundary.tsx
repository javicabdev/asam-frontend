import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Button, Container, Typography, Paper, Alert } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    }
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    // Generate a unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      hasError: true,
      errorId,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    })

    // Here you could send error to a logging service like Sentry
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      // Default error UI
      return (
        <Container maxWidth="md">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
            py={4}
          >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 600 }}>
              <ErrorOutline color="error" sx={{ fontSize: 64, mb: 2 }} />

              <Typography variant="h4" gutterBottom color="error">
                ¡Ups! Algo salió mal
              </Typography>

              <Typography variant="body1" color="text.secondary" paragraph>
                Ha ocurrido un error inesperado. Esto no debería haber pasado.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert severity="error" sx={{ mt: 2, mb: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error ID: {this.state.errorId}
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <details style={{ marginTop: '8px' }}>
                      <summary style={{ cursor: 'pointer' }}>Stack trace</summary>
                      <Typography
                        variant="caption"
                        component="pre"
                        sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    </details>
                  )}
                </Alert>
              )}

              <Box display="flex" gap={2} justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={this.handleReload}
                >
                  Recargar página
                </Button>

                <Button variant="outlined" color="primary" onClick={this.handleReset}>
                  Intentar de nuevo
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
                Si el problema persiste, por favor contacta al soporte técnico
                {this.state.errorId && ` con el ID de error: ${this.state.errorId}`}
              </Typography>
            </Paper>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

// Hook para usar con componentes funcionales
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  const resetError = () => setError(null)
  const captureError = (error: Error) => setError(error)

  return { resetError, captureError }
}

// HOC para envolver componentes con error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
}
