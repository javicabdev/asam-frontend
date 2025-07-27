import { createTheme, ThemeOptions } from '@mui/material/styles';
import { esES, frFR, enUS } from '@mui/material/locale';

// Color palette inspired by Senegal and Spain flags
const senegalColors = {
  green: '#00853F', // Senegal flag green
  yellow: '#FDEF42', // Senegal flag yellow
  red: '#E31E24', // Senegal flag red
};

const spainColors = {
  red: '#AA151B', // Spain flag red
  yellow: '#F1BF00', // Spain flag yellow
};

// Common colors for the association
const asamColors = {
  primary: '#1565c0', // Deep blue
  secondary: '#00853F', // Senegal green
  accent: '#F1BF00', // Golden yellow
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
};

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: asamColors.primary,
            light: '#5e92f3',
            dark: '#003c8f',
            contrastText: '#ffffff',
          },
          secondary: {
            main: asamColors.secondary,
            light: '#52c77a',
            dark: '#005214',
            contrastText: '#ffffff',
          },
          background: {
            default: '#fafafa',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
          accent: {
            main: asamColors.accent,
            light: '#ffef64',
            dark: '#bc9100',
            contrastText: 'rgba(0, 0, 0, 0.87)',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#5e92f3',
            light: '#8bb4f7',
            dark: '#1565c0',
            contrastText: '#000000',
          },
          secondary: {
            main: '#52c77a',
            light: '#82f9a9',
            dark: '#00853F',
            contrastText: '#000000',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
          accent: {
            main: '#ffef64',
            light: '#ffff96',
            dark: '#c9bc1f',
            contrastText: '#000000',
          },
        }),
    error: {
      main: asamColors.error,
    },
    warning: {
      main: asamColors.warning,
    },
    info: {
      main: asamColors.info,
    },
    success: {
      main: asamColors.success,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: mode === 'light'
    ? [
        'none',
        '0px 2px 4px rgba(0,0,0,0.05)',
        '0px 4px 8px rgba(0,0,0,0.08)',
        '0px 8px 16px rgba(0,0,0,0.1)',
        '0px 12px 24px rgba(0,0,0,0.12)',
        '0px 16px 32px rgba(0,0,0,0.14)',
        '0px 20px 40px rgba(0,0,0,0.16)',
        '0px 24px 48px rgba(0,0,0,0.18)',
        '0px 28px 56px rgba(0,0,0,0.2)',
        '0px 32px 64px rgba(0,0,0,0.22)',
        '0px 36px 72px rgba(0,0,0,0.24)',
        '0px 40px 80px rgba(0,0,0,0.26)',
        '0px 44px 88px rgba(0,0,0,0.28)',
        '0px 48px 96px rgba(0,0,0,0.3)',
        '0px 52px 104px rgba(0,0,0,0.32)',
        '0px 56px 112px rgba(0,0,0,0.34)',
        '0px 60px 120px rgba(0,0,0,0.36)',
        '0px 64px 128px rgba(0,0,0,0.38)',
        '0px 68px 136px rgba(0,0,0,0.4)',
        '0px 72px 144px rgba(0,0,0,0.42)',
        '0px 76px 152px rgba(0,0,0,0.44)',
        '0px 80px 160px rgba(0,0,0,0.46)',
        '0px 84px 168px rgba(0,0,0,0.48)',
        '0px 88px 176px rgba(0,0,0,0.5)',
        '0px 92px 184px rgba(0,0,0,0.52)',
      ]
    : [
        'none',
        '0px 2px 4px rgba(0,0,0,0.2)',
        '0px 4px 8px rgba(0,0,0,0.25)',
        '0px 8px 16px rgba(0,0,0,0.3)',
        '0px 12px 24px rgba(0,0,0,0.35)',
        '0px 16px 32px rgba(0,0,0,0.4)',
        '0px 20px 40px rgba(0,0,0,0.45)',
        '0px 24px 48px rgba(0,0,0,0.5)',
        '0px 28px 56px rgba(0,0,0,0.55)',
        '0px 32px 64px rgba(0,0,0,0.6)',
        '0px 36px 72px rgba(0,0,0,0.65)',
        '0px 40px 80px rgba(0,0,0,0.7)',
        '0px 44px 88px rgba(0,0,0,0.75)',
        '0px 48px 96px rgba(0,0,0,0.8)',
        '0px 52px 104px rgba(0,0,0,0.85)',
        '0px 56px 112px rgba(0,0,0,0.9)',
        '0px 60px 120px rgba(0,0,0,0.95)',
        '0px 64px 128px rgba(0,0,0,1)',
        '0px 68px 136px rgba(0,0,0,1)',
        '0px 72px 144px rgba(0,0,0,1)',
        '0px 76px 152px rgba(0,0,0,1)',
        '0px 80px 160px rgba(0,0,0,1)',
        '0px 84px 168px rgba(0,0,0,1)',
        '0px 88px 176px rgba(0,0,0,1)',
        '0px 92px 184px rgba(0,0,0,1)',
      ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: mode === 'light' ? '#d3d3d3 #f5f5f5' : '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 12,
            height: 12,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: mode === 'light' ? '#d3d3d3' : '#6b6b6b',
            border: '3px solid',
            borderColor: mode === 'light' ? '#f5f5f5' : '#2b2b2b',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2b2b2b',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0,0,0,0.08)' 
            : '0 2px 8px rgba(0,0,0,0.3)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 4px 16px rgba(0,0,0,0.12)'
              : '0 4px 16px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? '0 1px 3px rgba(0,0,0,0.12)'
            : '0 1px 3px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light'
            ? 'rgba(255,255,255,0.9)'
            : 'rgba(30,30,30,0.9)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: mode === 'light' ? asamColors.primary : '#5e92f3',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Language-specific theme options
const localeMap = {
  es: esES,
  fr: frFR,
  wo: enUS, // Wolof uses English locale as base
};

export const createAppTheme = (mode: 'light' | 'dark', language: 'es' | 'fr' | 'wo' = 'es') => {
  const designTokens = getDesignTokens(mode);
  const locale = localeMap[language] || esES;
  
  return createTheme(designTokens, locale);
};

// Export default light theme in Spanish
export const theme = createAppTheme('light', 'es');

// Export color constants for use in components
export { senegalColors, spainColors, asamColors };

// Declare module to add custom palette colors
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

// Update the Chip's color prop options
declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    accent: true;
  }
}
