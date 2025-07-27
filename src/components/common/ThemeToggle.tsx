import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/stores/settingsStore';

interface ThemeToggleProps {
  currentMode: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentMode, onToggle }) => {
  const { t } = useTranslation();
  const isLight = currentMode === 'light';

  return (
    <Tooltip title={t(`theme.${isLight ? 'dark' : 'light'}`)}>
      <IconButton
        color="inherit"
        onClick={onToggle}
        aria-label="toggle theme"
      >
        {isLight ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
