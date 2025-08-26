import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { LanguageSelector, ThemeToggle } from '@/components/common'

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header with language and theme selectors */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          zIndex: 1000,
        }}
      >
        <LanguageSelector />
        <ThemeToggle />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
