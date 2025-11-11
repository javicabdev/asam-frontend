import React from 'react'
import { Box, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'

/**
 * SkipLink component for accessibility
 * Allows keyboard users to skip navigation and go directly to main content
 *
 * WCAG 2.1 Level A compliance: Bypass Blocks (2.4.1)
 *
 * Usage:
 * - Place at the very beginning of the app (before navigation)
 * - The link is visually hidden until focused
 * - When activated, focus jumps to main content
 */
export const SkipLink: React.FC = () => {
  const { t } = useTranslation('common')

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Box
      component={Link}
      href="#main-content"
      onClick={handleSkip}
      sx={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '0.5rem 1rem',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        textDecoration: 'none',
        borderRadius: '0 0 4px 0',
        fontWeight: 600,
        fontSize: '1rem',
        '&:focus': {
          left: 0,
          top: 0,
          outline: '3px solid',
          outlineColor: 'warning.main',
          outlineOffset: '2px',
        },
      }}
    >
      {t('accessibility.skipToContent')}
    </Box>
  )
}
