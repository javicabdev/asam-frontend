import React from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from '@mui/material'
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import type { GenerateAnnualFeesResponse } from '../types'

interface FeeGenerationResultProps {
  result: GenerateAnnualFeesResponse | null
  error: string | null
  onClose: () => void
}

export const FeeGenerationResult: React.FC<FeeGenerationResultProps> = ({
  result,
  error,
  onClose,
}) => {
  const { t } = useTranslation('fees')
  const [showDetails, setShowDetails] = React.useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Stack spacing={3} alignItems="center">
          <ErrorIcon color="error" sx={{ fontSize: 64 }} />
          <Typography variant="h5">{t('generation.result.error')}</Typography>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={onClose} size="large">
            {t('generation.result.close')}
          </Button>
        </Stack>
      </Box>
    )
  }

  // Success state
  if (!result) return null

  const errorCount = result.details.filter((d) => d.error).length

  return (
    <Box>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <SuccessIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('generation.result.success')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('generation.result.year')} {result.year}
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('generation.result.summary')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.result.totalMembers')}
                </Typography>
                <Typography variant="h6">{result.total_members}</Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.result.paymentsCreated')}
                </Typography>
                <Typography variant="h6" color="success.main">
                  {result.payments_generated}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.result.paymentsExisting')}
                </Typography>
                <Typography variant="h6" color="info.main">
                  {result.payments_existing}
                </Typography>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.result.totalExpectedAmount')}
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(result.total_expected_amount)}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {errorCount > 0 && (
          <Alert severity="warning">
            {t('generation.result.errorsWarning', { count: errorCount })}
          </Alert>
        )}

        {result.details.length > 0 && (
          <Box>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowDetails(!showDetails)}
              endIcon={
                <ExpandIcon
                  sx={{
                    transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              }
            >
              {showDetails ? t('generation.result.hideDetails') : t('generation.result.showDetails')} ({result.details.length})
            </Button>

            <Collapse in={showDetails}>
              <Paper variant="outlined" sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                <List dense>
                  {result.details.map((detail, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        detail.was_created ? (
                          <Chip label={t('generation.result.statusCreated')} color="success" size="small" />
                        ) : detail.error ? (
                          <Chip label={t('generation.result.statusError')} color="error" size="small" />
                        ) : (
                          <Chip label={t('generation.result.statusExisting')} color="info" size="small" />
                        )
                      }
                    >
                      <ListItemText
                        primary={`${detail.member_number} - ${detail.member_name}`}
                        secondary={
                          detail.error ? detail.error : formatCurrency(detail.amount)
                        }
                        secondaryTypographyProps={{
                          color: detail.error ? 'error' : 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Collapse>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={onClose} size="large">
            {t('generation.result.close')}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
