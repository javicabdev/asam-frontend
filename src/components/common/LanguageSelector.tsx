import React, { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider,
  useTheme,
  Chip,
} from '@mui/material'
import { Language as LanguageIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/stores/settingsStore'
import { languages } from '@/lib/i18n'

interface LanguageSelectorProps {
  variant?: 'icon' | 'chip' | 'text'
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  inAppBar?: boolean // New prop to indicate if it's in an AppBar
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'icon',
  size = 'medium',
  showLabel = true,
  inAppBar = false,
}) => {
  const { i18n } = useTranslation()
  const theme = useTheme()
  const { language, setLanguage } = useSettingsStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = async (lang: 'es' | 'fr' | 'wo') => {
    try {
      // Change language in i18next
      await i18n.changeLanguage(lang)

      // Save to store and localStorage
      setLanguage(lang)
      localStorage.setItem('asam-language', lang)

      // Close menu
      handleClose()
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const currentLanguage = Object.prototype.hasOwnProperty.call(languages, language) ? languages[language] : languages.es

  // Determine icon color based on theme mode and context
  const getIconColor = (): 'primary' | 'inherit' => {
    if (inAppBar && theme.palette.mode === 'light') {
      return 'primary'
    }
    return 'inherit'
  }

  const getChipColor = (): 'primary' | 'default' => {
    if (inAppBar && theme.palette.mode === 'light') {
      return 'primary'
    }
    return 'default'
  }

  const renderTrigger = () => {
    switch (variant) {
      case 'chip':
        return (
          <Chip
            icon={<LanguageIcon />}
            label={
              showLabel ? `${currentLanguage.flag} ${currentLanguage.name}` : currentLanguage.flag
            }
            onClick={handleClick}
            variant="outlined"
            size={size === 'large' ? 'medium' : size}
            color={getChipColor()}
            sx={{
              ...(inAppBar &&
                theme.palette.mode === 'light' && {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '& .MuiChip-icon': {
                    color: theme.palette.primary.main,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '20',
                  },
                }),
            }}
          />
        )

      case 'text':
        return (
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 1,
              color:
                inAppBar && theme.palette.mode === 'light' ? theme.palette.primary.main : 'inherit',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <LanguageIcon fontSize={size} />
            {showLabel && (
              <>
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
              </>
            )}
          </Box>
        )

      case 'icon':
      default:
        return (
          <Tooltip title={i18n.t('language.select')}>
            <IconButton
              color={getIconColor()}
              onClick={handleClick}
              aria-label="select language"
              aria-controls="language-menu"
              aria-haspopup="true"
              size={size}
              sx={{
                ...(inAppBar &&
                  theme.palette.mode === 'light' && {
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light + '20',
                    },
                  }),
              }}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <LanguageIcon />
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 'bold',
                  }}
                >
                  {currentLanguage.code.toUpperCase()}
                </Typography>
              </Box>
            </IconButton>
          </Tooltip>
        )
    }
  }

  return (
    <>
      {renderTrigger()}
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            {i18n.t('language.current')}
          </Typography>
        </MenuItem>
        <Divider />

        {Object.entries(languages).map(([code, lang]) => (
          <MenuItem
            key={code}
            onClick={() => void handleLanguageChange(code as 'es' | 'fr' | 'wo')}
            selected={language === code}
          >
            <ListItemIcon>
              <Box
                component="span"
                sx={{
                  fontSize: '1.5rem',
                  width: 32,
                  textAlign: 'center',
                }}
              >
                {lang.flag}
              </Box>
            </ListItemIcon>
            <ListItemText primary={lang.name} secondary={code.toUpperCase()} />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSelector
