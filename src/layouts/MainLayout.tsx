import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
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
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SupervisedUserCircle as UsersIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  EmailOutlined as EmailIcon,
  VerifiedUser as VerifiedIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { PageTransition, LanguageSelector, ThemeToggle } from '@/components/common'
import { useTranslation } from 'react-i18next'

const drawerWidth = 240

interface NavItem {
  text: string
  icon: React.ReactNode
  path: string
  roles?: string[]
}

const navigationItems: NavItem[] = [
  {
    text: 'menu.dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin'],
  },
  {
    text: 'menu.members',
    icon: <PeopleIcon />,
    path: '/members',
  },
  {
    text: 'menu.users',
    icon: <UsersIcon />,
    path: '/users',
    roles: ['admin'],
  },
  {
    text: 'menu.payments',
    icon: <PaymentIcon />,
    path: '/payments',
  },
  {
    text: 'menu.annualFees',
    icon: <CalendarIcon />,
    path: '/annual-fees',
    roles: ['admin'],
  },
  {
    text: 'menu.cashFlow',
    icon: <AccountBalanceIcon />,
    path: '/cash-flow',
    roles: ['admin'],
  },
  {
    text: 'menu.reports',
    icon: <AssessmentIcon />,
    path: '/reports',
    roles: ['admin'],
  },
]

export const MainLayout: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuth()
  const { t } = useTranslation('navigation')

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Close menu when location changes
  useEffect(() => {
    setAnchorEl(null)
  }, [location.pathname])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
  }

  const handleNavigate = (path: string) => {
    console.log('🔍 Navigating to:', path, 'from:', location.pathname)
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const getUserInitials = () => {
    if (!user?.username) return '?'
    return user.username.substring(0, 2).toUpperCase()
  }

  // Filter navigation items based on user role
  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  )

  const drawer = (
    <Box>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Box
          component="img"
          src="/icons/original-logo.png"
          alt="ASAM"
          sx={{
            height: 48,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Toolbar>
      <Divider />
      <List>
        {visibleNavigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={t(item.text)}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

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
            sx={{
              mr: 2,
              display: { md: 'none' },
              ...(theme.palette.mode === 'light' && {
                color: theme.palette.primary.main,
              }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'inherit',
            }}
          >
            {t('app.title', { ns: 'common' })}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Selector - with inAppBar prop */}
            <LanguageSelector inAppBar={true} />

            {/* Theme Toggle - with inAppBar prop */}
            <ThemeToggle inAppBar={true} />

            {/* Email verification badge */}
            {user && !user.emailVerified && (
              <Tooltip title="Email no verificado">
                <Badge badgeContent="!" color="warning">
                  <IconButton
                    size="small"
                    sx={{
                      color:
                        theme.palette.mode === 'light' ? theme.palette.warning.main : 'inherit',
                    }}
                  >
                    <EmailIcon />
                  </IconButton>
                </Badge>
              </Tooltip>
            )}

            {/* User name - decorative, not clickable */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-end',
                mr: 0.5,
                color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'inherit',
              }}
            >
              <Typography variant="body2">{user?.username}</Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    theme.palette.mode === 'light'
                      ? theme.palette.text.secondary
                      : 'text.secondary',
                }}
              >
                {user?.role}
              </Typography>
            </Box>

            {/* Avatar button - clickable anchor for menu */}
            <Tooltip title={t('menu.profile', { ns: 'navigation' })}>
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 0.5 }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor:
                      theme.palette.mode === 'light'
                        ? theme.palette.primary.main
                        : theme.palette.primary.dark,
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={user?.username} secondary={user?.role} />
        </MenuItem>

        {user && !user.emailVerified && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
              navigate('/email-verification-check')
            }}
          >
            <ListItemIcon>
              <VerifiedIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText primary={t('auth:emailVerification.pending.title')} />
          </MenuItem>
        )}

        <Divider />

        <MenuItem
          onClick={() => {
            handleMenuClose()
            navigate('/profile')
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('menu.profile', { ns: 'navigation' })} />
        </MenuItem>

        <MenuItem onClick={() => void handleLogout()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('auth:logout.title')} />
        </MenuItem>
      </Menu>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
              zIndex: 1200, // Ensure drawer is above content
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
          position: 'relative', // Ensure proper stacking context
          zIndex: 1, // Below drawer
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
  )
}
