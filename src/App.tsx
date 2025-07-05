import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import es from 'date-fns/locale/es'

import { apolloClient } from '@/lib/apollo-client'
import { theme } from '@/lib/theme'
import { AppRoutes } from './routes'
// import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel' // Comentado - usar solo cuando se necesite debug

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
            {/* {isDev && <AuthDebugPanel />} */}
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
