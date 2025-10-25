import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import es from 'date-fns/locale/es'
import fr from 'date-fns/locale/fr'
import { I18nextProvider } from 'react-i18next'
import { useState, useEffect, useMemo } from 'react'
import { SnackbarProvider } from 'notistack'

import { apolloClient } from '@/lib/apollo-client'
import { createAppTheme } from '@/lib/theme'
import i18n from '@/lib/i18n'
import { AppRoutes } from './routes'
import { InstallPrompt } from '@/components/pwa'
import { ErrorBoundary, LoadingOverlay } from '@/components/common'
import { AppContent } from '@/components/app'
import { useSettingsStore } from '@/stores/settingsStore'

function App() {
  const { language, themeMode } = useSettingsStore()
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  // Determine actual theme based on system preference if set to 'system'
  useEffect(() => {
    const determineTheme = () => {
      if (themeMode === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setCurrentTheme(themeMode === 'dark' ? 'dark' : 'light')
      }
    }

    determineTheme()

    // Listen for system theme changes when in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [themeMode])

  // Sync i18n with language from store
  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language)
    }
  }, [language])

  // Create theme based on current settings
  const theme = useMemo(() => createAppTheme(currentTheme, language), [currentTheme, language])

  // Get date-fns locale based on current language
  const dateLocale = useMemo(() => {
    switch (language) {
      case 'fr':
        return fr
      case 'wo':
        // Wolof uses Spanish locale as fallback since date-fns doesn't have Wolof
        return es
      case 'es':
      default:
        return es
    }
  }, [language])

  return (
    <ApolloProvider client={apolloClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              autoHideDuration={5000}
              preventDuplicate
            >
              <ErrorBoundary>
                <BrowserRouter>
                  <AppContent>
                    <AppRoutes />
                    <InstallPrompt />
                    <LoadingOverlay />
                  </AppContent>
                </BrowserRouter>
              </ErrorBoundary>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ApolloProvider>
  )
}

export default App
