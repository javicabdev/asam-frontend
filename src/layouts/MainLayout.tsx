import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FamilyRestroom as FamilyIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  EmailOutlined as EmailIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { PageTransition, LanguageSelector, ThemeToggle } from '@/components/common';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  {
    text: 'menu.dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'menu.members',
    icon: <PeopleIcon />,
    path: '/members',
  },
  {
    text: 'menu.families',
    icon: <FamilyIcon />,
    path: '/families',
  },
  {
    text: 'menu.payments',
    icon: <PaymentIcon />,
    path: '/payments',
  },
  {
    text: 'menu.cashFlow',
    icon: <AccountBalanceIcon />,
    path: '/cash-flow',
  },
  {
    text: 'menu.reports',
    icon: <AssessmentIcon />,
    path: '/reports',
  },
];

export const MainLayout: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { t } = useTranslation('navigation');

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.username) return '?';
    return user.username.substring(0, 2).toUpperCase();
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          ASAM
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path
                      ? 'primary.main'
                      : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(item.text)}
                sx={{
                  '& .MuiListItemText-primary': {
                    color:
                      location.pathname === item.path
                        ? 'primary.main'
                        : 'inherit',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('app.title', { ns: 'common' })}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Theme Toggle - Ahora sin props */}
            <ThemeToggle />
            {/* Email verification badge */}
            {user && !user.emailVerified && (
              <Tooltip title="Email no verificado">
                <Badge badgeContent="!" color="warning">
                  <EmailIcon />
                </Badge>
              </Tooltip>
            )}

            {/* User info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
              onClick={handleMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {getUserInitials()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2">{user?.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
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
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={user?.username}
                  secondary={user?.role}
                />
              </MenuItem>
              
              {user && !user.emailVerified && (
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/email-verification-check');
                }}>
                  <ListItemIcon>
                    <VerifiedIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={t('auth:emailVerification.pending.title')} />
                </MenuItem>
              )}
              
              <Divider />
              
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t('menu.profile')} />
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t('auth:logout.title')} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <PageTransition type="fade" duration={300}>
          <Box key={location.pathname}>
            <Outlet />
          </Box>
        </PageTransition>
      </Box>
    </Box>
  );
};

export default MainLayout;
