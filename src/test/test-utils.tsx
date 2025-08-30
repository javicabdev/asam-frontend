 
import React from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import es from 'date-fns/locale/es'
import { theme } from '@/lib/theme'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps
}

/**
 * Custom render function that includes all providers
 */
export function render(ui: React.ReactElement, options?: CustomRenderOptions) {
  const { routerProps, ...renderOptions } = options || {}

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter {...routerProps}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </MemoryRouter>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export specific utilities from @testing-library/react
export {
  screen,
  fireEvent,
  waitFor,
  within,
  cleanup,
  act,
  renderHook,
  waitForElementToBeRemoved,
} from '@testing-library/react'

// Re-export types
export type {
  RenderResult,
  RenderOptions,
  Queries,
  queries,
  BoundFunctions,
} from '@testing-library/react'
