import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
  Skeleton,
  IconButton,
  useTheme,
} from '@mui/material'
import {
  PersonAdd,
  Payment,
  Edit,
  FamilyRestroom,
  Refresh,
  ArrowForward,
  RemoveCircle,
  Receipt,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { RecentActivity as RecentActivityType, ActivityType } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { es, fr, enUS } from 'date-fns/locale'

interface RecentActivityProps {
  activities: RecentActivityType[]
  loading?: boolean
  onRefresh?: () => void
  onViewAll?: () => void
}

export default function RecentActivity({
  activities,
  loading = false,
  onRefresh,
  onViewAll,
}: RecentActivityProps) {
  const theme = useTheme()
  const { t, i18n } = useTranslation('dashboard')

  const getActivityIcon = (type: ActivityType) => {
    const iconMap: Record<ActivityType, JSX.Element> = {
      MEMBER_REGISTERED: <PersonAdd />,
      PAYMENT_RECEIVED: <Payment />,
      FAMILY_CREATED: <FamilyRestroom />,
      MEMBER_DEACTIVATED: <RemoveCircle />,
      TRANSACTION_RECORDED: <Receipt />,
    }
    return iconMap[type] || <Edit />
  }

  const getActivityColor = (type: ActivityType) => {
    const colorMap: Record<ActivityType, string> = {
      MEMBER_REGISTERED: theme.palette.success.main,
      PAYMENT_RECEIVED: theme.palette.primary.main,
      FAMILY_CREATED: theme.palette.secondary.main,
      MEMBER_DEACTIVATED: theme.palette.error.main,
      TRANSACTION_RECORDED: theme.palette.info.main,
    }
    return colorMap[type] || theme.palette.grey[500]
  }

  const getActivityLabel = (type: ActivityType) => {
    const labelMap: Record<ActivityType, string> = {
      MEMBER_REGISTERED: t('recentActivity.newMember'),
      PAYMENT_RECEIVED: t('recentActivity.paymentReceived'),
      FAMILY_CREATED: t('recentActivity.familyAdded'),
      MEMBER_DEACTIVATED: t('recentActivity.memberUpdated'),
      TRANSACTION_RECORDED: t('recentActivity.paymentReceived'),
    }
    return labelMap[type] || t('recentActivity.title')
  }

  const formatTime = (timestamp: string) => {
    try {
      // Mapear idioma a locale de date-fns
      const localeMap = {
        es: es,
        fr: fr,
        wo: fr, // Usar francés para wolof
      }
      const locale = localeMap[i18n.language as keyof typeof localeMap] || enUS
      
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale,
      })
    } catch {
      return timestamp
    }
  }

  const formatDescription = (activity: RecentActivityType) => {
    // Construir descripción traducida basada en el tipo de actividad
    const memberName = activity.relatedMember
      ? `${activity.relatedMember.nombre} ${activity.relatedMember.apellidos}`
      : null

    const familyName = activity.relatedFamily
      ? `${activity.relatedFamily.esposo_nombre} ${t('recentActivity.and')} ${activity.relatedFamily.esposa_nombre}`
      : null

    // Generar descripción según el tipo de actividad
    switch (activity.type) {
      case 'MEMBER_REGISTERED':
        return memberName
          ? t('recentActivity.memberRegisteredWith', { name: memberName })
          : t('recentActivity.newMember')

      case 'PAYMENT_RECEIVED':
        return memberName
          ? t('recentActivity.paymentReceivedFrom', { name: memberName })
          : t('recentActivity.paymentReceived')

      case 'FAMILY_CREATED':
        return familyName
          ? t('recentActivity.familyCreatedWith', { family: familyName })
          : t('recentActivity.familyAdded')

      case 'MEMBER_DEACTIVATED':
        return memberName
          ? t('recentActivity.memberDeactivatedWith', { name: memberName })
          : t('recentActivity.memberUpdated')

      case 'TRANSACTION_RECORDED':
        return t('recentActivity.transactionRecorded')

      default:
        return activity.description
    }
  }

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{ borderRadius: 2, border: 1, borderColor: 'divider', height: '100%' }}
      >
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <List>
            {[1, 2, 3, 4, 5].map((index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="60%" />}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {t('recentActivity.title')}
          </Typography>
          <Box>
            {onRefresh && (
              <IconButton size="small" onClick={onRefresh} sx={{ mr: 1 }} title="Actualizar">
                <Refresh fontSize="small" />
              </IconButton>
            )}
            {onViewAll && (
              <IconButton size="small" onClick={onViewAll} title="Ver todo">
                <ArrowForward fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {activities.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              flex: 1,
              minHeight: 200,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">{t('recentActivity.viewAll')}</Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {activities.slice(0, 6).map((activity) => (
              <ListItem
                key={activity.id}
                sx={{
                  px: 0,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getActivityColor(activity.type)}15`,
                      color: getActivityColor(activity.type),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" component="span">
                        {formatDescription(activity)}
                      </Typography>
                      {activity.amount && (
                        <Chip
                          label={`€${activity.amount.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : i18n.language === 'wo' ? 'fr-SN' : 'es-ES')}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      <Chip
                        label={getActivityLabel(activity.type)}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          backgroundColor: `${getActivityColor(activity.type)}15`,
                          color: getActivityColor(activity.type),
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(activity.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
