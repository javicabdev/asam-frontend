import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Typography,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  BrightnessAuto as AutoModeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, ThemeMode } from '@/stores/settingsStore';

export const ThemeToggle: React.FC = () => {
  const { t } = useTranslation('common');
  const { themeMode, setThemeMode } = useSettingsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    handleClose();
  };

  const getIcon = () => {
    switch (themeMode) {
      case 'dark':
        return <DarkModeIcon />;
      case 'light':
        return <LightModeIcon />;
      case 'system':
      default:
        return <AutoModeIcon />;
    }
  };

  const getTooltipText = () => {
    switch (themeMode) {
      case 'dark':
        return t('theme.dark');
      case 'light':
        return t('theme.light');
      case 'system':
      default:
        return t('theme.system');
    }
  };

  const menuItems: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'light', icon: <LightModeIcon />, label: t('theme.light') },
    { mode: 'dark', icon: <DarkModeIcon />, label: t('theme.dark') },
    { mode: 'system', icon: <AutoModeIcon />, label: t('theme.system') },
  ];

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="select theme mode"
          aria-controls="theme-menu"
          aria-haspopup="true"
        >
          {getIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
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
            {t('theme.select', { defaultValue: 'Seleccionar tema' })}
          </Typography>
        </MenuItem>
        <Divider />
        
        {menuItems.map((item) => (
          <MenuItem
            key={item.mode}
            onClick={() => handleThemeChange(item.mode)}
            selected={themeMode === item.mode}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ThemeToggle;
