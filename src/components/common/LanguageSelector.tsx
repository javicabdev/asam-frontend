import React, { useState } from 'react';
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
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';
import { languages } from '@/lib/i18n';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (lang: 'es' | 'fr' | 'wo') => {
    try {
      // Change language in i18next
      await i18n.changeLanguage(lang);
      
      // Save to store and localStorage
      setLanguage(lang);
      localStorage.setItem('asam-language', lang);
      
      // Close menu
      handleClose();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = languages[language] || languages.es;

  return (
    <>
      <Tooltip title={i18n.t('language.select')}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="select language"
          aria-controls="language-menu"
          aria-haspopup="true"
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <LanguageIcon />
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {currentLanguage.code.toUpperCase()}
            </Typography>
          </Box>
        </IconButton>
      </Tooltip>

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
            onClick={() => handleLanguageChange(code as 'es' | 'fr' | 'wo')}
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
            <ListItemText
              primary={lang.name}
              secondary={code.toUpperCase()}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
