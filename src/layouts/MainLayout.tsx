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
  AdminPanelSettings as UsersIcon,
  Payment as PaymentIcon,
  PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  EmailOutlined as EmailIcon,
  VerifiedUser as VerifiedIcon,
  CalendarMonth as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { PageTransition, LanguageSelector, ThemeToggle, SkipLink } from '@/components/common'
import { InstallPrompt } from '@/components/common/InstallPrompt'
import { OfflineIndicator } from '@/components/common/OfflineIndicator'
import { useTranslation } from 'react-i18next'

const drawerWidth = 240
const drawerCollapsedWidth = 64

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
    icon: <PointOfSaleIcon />,
    path: '/cash-flow',
    roles: ['admin'],
  },
  {
    text: 'menu.reports',
    icon: <AssessmentIcon />,
    path: '/reports',
    roles: ['admin'],
  },
  {
    text: 'menu.users',
    icon: <UsersIcon />,
    path: '/users',
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

  // Drawer collapsed state with localStorage persistence
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('drawer-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  // Persist collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('drawer-collapsed', JSON.stringify(collapsed))
  }, [collapsed])

  // Close menu and mobile drawer when location changes (including browser back/forward navigation)
  useEffect(() => {
    handleMenuClose()
    setMobileOpen(false)
  }, [location.pathname])

  const handleDrawerCollapse = () => {
    setCollapsed(!collapsed)
  }

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

  const handleMenuNavigate = (path: string) => {
    // 1. Inicia la animación de cierre del menú
    handleMenuClose()

    // 2. Serializa: Espera a que el menú se cierre completamente y el DOM se actualice
    //    antes de iniciar la navegación y su transición de página.
    //    Esto previene la condición de carrera entre animaciones.
    setTimeout(() => {
      // 3. Ahora que el menú ya no está en el DOM, navega de forma segura
      navigate(path, { replace: true })
    }, 250) // Valor seguro que garantiza que el menú está completamente cerrado
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2, minHeight: 64 }}>
        <Tooltip title={t('menu.goToDashboard', { ns: 'navigation', defaultValue: 'Ir al Dashboard' })}>
          <Box
            onClick={() => handleNavigate('/dashboard')}
            sx={{
              cursor: 'pointer',
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            {collapsed ? (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                A
              </Typography>
            ) : (
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
            )}
          </Box>
        </Tooltip>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {visibleNavigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <Tooltip
              title={collapsed ? t(item.text) : ''}
              placement="right"
            >
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: collapsed ? 0 : 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    minWidth: collapsed ? 'auto' : 56,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={t(item.text)}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: location.pathname === item.path ? 'primary.main' : 'inherit',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Collapse/Expand Button */}
      <Box sx={{ p: 1 }}>
        <Tooltip title={collapsed ? 'Expandir menú' : 'Contraer menú'}>
          <IconButton
            onClick={handleDrawerCollapse}
            sx={{
              width: '100%',
              borderRadius: 1,
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )

  // Calculate current drawer width
  const currentDrawerWidth = collapsed ? drawerCollapsedWidth : drawerWidth

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <SkipLink />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
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
          <MenuItem onClick={() => handleMenuNavigate('/email-verification-check')}>
            <ListItemIcon>
              <VerifiedIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText primary={t('auth:emailVerification.pending.title')} />
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={() => handleMenuNavigate('/profile')}>
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

      <Box component="nav" sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          disableScrollLock={true}
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
              width: currentDrawerWidth,
              zIndex: 1200, // Ensure drawer is above content
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        id="main-content"
        component="main"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          position: 'relative', // Ensure proper stacking context
          zIndex: 1, // Below drawer
          overflow: 'hidden',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '&:focus': {
            outline: 'none', // Skip link handles focus, no outline needed
          },
        }}
      >
        <Toolbar />
        <PageTransition type="fade" duration={300}>
          <Box
            key={location.pathname}
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Box>
        </PageTransition>
      </Box>

      {/* PWA components */}
      <OfflineIndicator />
      <InstallPrompt />
    </Box>
  )
}
