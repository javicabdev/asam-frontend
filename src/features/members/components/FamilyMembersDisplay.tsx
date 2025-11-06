import {
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Stack,
  Chip,
} from '@mui/material'
import {
  People as PeopleIcon,
  PersonOutline as PersonOutlineIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { useFamilyData } from '../hooks'
import { MembershipType } from '../types'

interface FamilyMembersDisplayProps {
  memberId: string
  membershipType: MembershipType
}

/**
 * Display component for showing family members (familiares)
 * Only visible for FAMILY membership type
 * Shows spouse information and additional family members in a read-only table
 */
export function FamilyMembersDisplay({ memberId, membershipType }: FamilyMembersDisplayProps) {
  const { t } = useTranslation('members')
  const { family, familiares, loading, error } = useFamilyData(memberId, membershipType)

  // Don't render anything if not a family membership
  if (membershipType !== MembershipType.FAMILY) {
    return null
  }

  // Loading state
  if (loading) {
    return (
      <Box>
        <Stack spacing={1}>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" icon={<InfoIcon />}>
        <Typography variant="body2">
          {t('familyMembersDisplay.errorMessage')}: {error.message}
        </Typography>
      </Alert>
    )
  }

  // No family data found
  if (!family) {
    return (
      <Alert severity="info" icon={<InfoIcon />}>
        <Typography variant="body2">
          {t('familyMembersDisplay.noFamilyData')}
        </Typography>
      </Alert>
    )
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es })
    } catch {
      return '-'
    }
  }

  const hasFamiliares = familiares && familiares.length > 0

  return (
    <Box>
      {/* Spouse Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('familyMembersDisplay.spousesTitle')}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Chip
            icon={<PersonOutlineIcon />}
            label={`${family.esposo_nombre} ${family.esposo_apellidos}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<PersonOutlineIcon />}
            label={`${family.esposa_nombre} ${family.esposa_apellidos}`}
            color="secondary"
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Additional Family Members Table */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PeopleIcon color="action" />
          <Typography variant="subtitle2" color="text.secondary">
            {t('familyMembersDisplay.additionalMembersTitle')}
          </Typography>
          {hasFamiliares && (
            <Chip label={familiares.length} size="small" color="primary" variant="outlined" />
          )}
        </Box>

        {!hasFamiliares ? (
          <Alert severity="info" icon={<InfoIcon />}>
            <Typography variant="body2">
              {t('familyMembersDisplay.noAdditionalMembers')}
            </Typography>
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>{t('familyMembersDisplay.fullName')}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t('familyMembersDisplay.birthDate')}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t('familyMembersDisplay.dni')}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{t('familyMembersDisplay.email')}</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familiares.map((familiar) => (
                  <TableRow key={familiar.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {familiar.nombre} {familiar.apellidos}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(familiar.fecha_nacimiento)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {familiar.dni_nie || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {familiar.correo_electronico || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  )
}
