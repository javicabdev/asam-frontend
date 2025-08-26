import React from 'react'
import { Card, CardContent, Typography, Box, Button, Grid, useTheme, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  PersonAdd,
  Payment,
  Assessment,
  Group,
  Receipt,
  Description,
  ArrowForward,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  path: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
}

export default function QuickActions() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { t } = useTranslation('dashboard')

  const actions: QuickAction[] = [
    {
      title: t('quickActions.newMember'),
      description: t('recentActivity.newMember'),
      icon: <PersonAdd />,
      path: '/members/new',
      color: 'success',
    },
    {
      title: t('quickActions.registerPayment'),
      description: t('recentActivity.paymentReceived'),
      icon: <Payment />,
      path: '/payments/new',
      color: 'primary',
    },
    {
      title: t('quickActions.viewReports'),
      description: t('charts.memberGrowth'),
      icon: <Assessment />,
      path: '/reports',
      color: 'info',
    },
    {
      title: t('quickActions.manageFamily'),
      description: t('recentActivity.familyAdded'),
      icon: <Group />,
      path: '/families',
      color: 'secondary',
    },
    {
      title: t('quickActions.registerPayment'),
      description: t('recentActivity.paymentReceived'),
      icon: <Receipt />,
      path: '/receipts/new',
      color: 'warning',
    },
    {
      title: t('quickActions.viewReports'),
      description: t('charts.monthlyPayments'),
      icon: <Description />,
      path: '/documents',
      color: 'primary',
    },
  ]

  const getColorValue = (color: QuickAction['color']) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      info: theme.palette.info.main,
    }
    return colorMap[color]
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 3,
          }}
        >
          {t('quickActions.title')}
        </Typography>

        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(action.path)}
                sx={{
                  p: 2,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: getColorValue(action.color),
                    backgroundColor: alpha(getColorValue(action.color), 0.05),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${alpha(getColorValue(action.color), 0.2)}`,
                  },
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(getColorValue(action.color), 0.1),
                      color: getColorValue(action.color),
                      mr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.5,
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        lineHeight: 1.2,
                      }}
                    >
                      {action.description}
                    </Typography>
                  </Box>
                  <ArrowForward
                    fontSize="small"
                    sx={{
                      color: 'text.disabled',
                      ml: 1,
                    }}
                  />
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
