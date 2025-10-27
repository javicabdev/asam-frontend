import {
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Divider,
  Paper,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Cake as CakeIcon,
  Work as WorkIcon,
  Public as PublicIcon,
  Badge as BadgeIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { useMemberDetails } from '@/features/members/hooks/useMemberDetails'
import { MemberDetailsSkeleton } from '@/features/members/components'
import { MemberPaymentHistory } from '@/features/payments/components'
import { MemberStatus, MembershipType } from '@/features/members/types'
import { useAuthStore } from '@/stores/authStore'

export function MemberDetailsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const { member, loading, error } = useMemberDetails()

  if (loading) {
    return <MemberDetailsSkeleton />
  }

  if (error) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} sx={{ mb: 2 }}>
          Volver a la lista
        </Button>
        <Alert severity="error">Error al cargar los detalles del socio: {error.message}</Alert>
      </Box>
    )
  }

  if (!member) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/members')} sx={{ mb: 2 }}>
          Volver a la lista
        </Button>
        <Alert severity="warning">No se encontró el socio solicitado.</Alert>
      </Box>
    )
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return format(new Date(date), 'dd/MM/yyyy', { locale: es })
  }

  const getFullAddress = () => {
    const parts = [
      member.calle_numero_piso,
      member.codigo_postal,
      member.poblacion,
      member.provincia,
      member.pais,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'No especificada'
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Detalles del Socio
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" color="text.secondary">
              {member.nombre} {member.apellidos}
            </Typography>
            <Chip
              label={member.estado === MemberStatus.ACTIVE ? 'Activo' : 'Inactivo'}
              color={member.estado === MemberStatus.ACTIVE ? 'success' : 'default'}
              size="small"
              variant={member.estado === MemberStatus.ACTIVE ? 'filled' : 'outlined'}
            />
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/members')}
          >
            Volver
          </Button>
          <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}>
            Imprimir
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/members/${member.miembro_id}/edit`)}
            >
              Editar
            </Button>
          )}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Información Básica
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Número de Socio
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {member.numero_socio}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tipo de Membresía
                  </Typography>
                  <Box>
                    <Chip
                      label={
                        member.tipo_membresia === MembershipType.INDIVIDUAL
                          ? 'Individual'
                          : 'Familiar'
                      }
                      color={
                        member.tipo_membresia === MembershipType.INDIVIDUAL
                          ? 'primary'
                          : 'secondary'
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <BadgeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Documento de Identidad
                  </Typography>
                  <Typography variant="body1">
                    {member.documento_identidad || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <CakeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Fecha de Nacimiento
                  </Typography>
                  <Typography variant="body1">{formatDate(member.fecha_nacimiento)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Fecha de Alta
                  </Typography>
                  <Typography variant="body1">{formatDate(member.fecha_alta)}</Typography>
                </Box>

                {member.fecha_baja && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      Fecha de Baja
                    </Typography>
                    <Typography variant="body1" color="error">
                      {formatDate(member.fecha_baja)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Información de Contacto
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <EmailIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1">
                    {member.correo_electronico ? (
                      <a href={`mailto:${member.correo_electronico}`}>
                        {member.correo_electronico}
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <HomeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Dirección Completa
                  </Typography>
                  <Typography variant="body1">{getFullAddress()}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <WorkIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Profesión
                  </Typography>
                  <Typography variant="body1">{member.profesion || 'No especificada'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    <PublicIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Nacionalidad
                  </Typography>
                  <Typography variant="body1">
                    {member.nacionalidad || 'No especificada'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information Card */}
        {member.observaciones && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Observaciones
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {member.observaciones}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Payment History Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <MemberPaymentHistory 
              memberId={member.miembro_id} 
              membershipType={member.tipo_membresia}
              maxRows={5} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
