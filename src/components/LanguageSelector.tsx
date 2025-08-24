import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
  Avatar,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { languages } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'icon' | 'chip' | 'menu';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'chip',
  size = 'medium',
  showLabel = true,
}) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('asam-language', langCode);
    handleClose();
  };

  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.es;

  const renderTrigger = () => {
    switch (variant) {
      case 'icon':
        return (
          <Tooltip title={currentLanguage.name}>
            <IconButton onClick={handleClick} size={size}>
              <Avatar sx={{ width: 32, height: 32, fontSize: '1.2rem' }}>
                {currentLanguage.flag}
              </Avatar>
            </IconButton>
          </Tooltip>
        );
      
      case 'chip':
        return (
          <Chip
            icon={<LanguageIcon />}
            label={showLabel ? `${currentLanguage.flag} ${currentLanguage.name}` : currentLanguage.flag}
            onClick={handleClick}
            variant="outlined"
            size={size === 'large' ? 'medium' : size}
          />
        );
      
      case 'menu':
      default:
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
        );
    }
  };

  return (
    <>
      {renderTrigger()}
      <Menu
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
        {Object.values(languages).map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === i18n.language}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
            </ListItemIcon>
            <ListItemText>
              {lang.name}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
