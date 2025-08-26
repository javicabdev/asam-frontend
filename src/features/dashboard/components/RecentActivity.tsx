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
import { RecentActivity as RecentActivityType, ActivityType } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

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
      MEMBER_REGISTERED: 'Nuevo Miembro',
      PAYMENT_RECEIVED: 'Pago Recibido',
      FAMILY_CREATED: 'Nueva Familia',
      MEMBER_DEACTIVATED: 'Baja',
      TRANSACTION_RECORDED: 'Transacción',
    }
    return labelMap[type] || 'Actividad'
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: es,
      })
    } catch {
      return timestamp
    }
  }

  const formatDescription = (activity: RecentActivityType) => {
    let description = activity.description

    // Añadir información adicional si está disponible
    if (activity.relatedMember) {
      const memberName = `${activity.relatedMember.nombre} ${activity.relatedMember.apellidos}`
      if (!description.includes(memberName)) {
        description = `${description} - ${memberName}`
      }
    }

    if (activity.relatedFamily) {
      const familyName = `Familia ${activity.relatedFamily.esposo_nombre} y ${activity.relatedFamily.esposa_nombre}`
      if (!description.includes(familyName)) {
        description = `${description} - ${familyName}`
      }
    }

    return description
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
            Actividad Reciente
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
            <Typography variant="body2">No hay actividad reciente</Typography>
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
                          label={`€${activity.amount.toLocaleString('es-ES')}`}
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
