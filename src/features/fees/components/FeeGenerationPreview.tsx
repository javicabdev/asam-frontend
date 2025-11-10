import React from 'react'
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  Paper,
  Grid,
  Divider,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { FeeGenerationPreview } from '../types'

interface FeeGenerationPreviewProps {
  preview: FeeGenerationPreview
  onConfirm: () => void
  onBack: () => void
  loading?: boolean
}

export const FeeGenerationPreviewComponent: React.FC<FeeGenerationPreviewProps> = ({
  preview,
  onConfirm,
  onBack,
  loading = false,
}) => {
  const { t } = useTranslation('fees')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h6">
          {t('generation.preview.title', { year: preview.year })}
        </Typography>

        {preview.feeExists && (
          <Alert severity="warning">
            {t('generation.preview.alreadyExistsWarning')}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('generation.preview.amountConfig')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.preview.baseFeeAmount')}
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(preview.baseFeeAmount)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.preview.familyFeeExtra')}
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(preview.familyFeeExtra)}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              {t('generation.preview.paymentsEstimate')}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.preview.individualMembers')}
                </Typography>
                <Typography variant="h6">
                  {preview.estimatedIndividualMembers}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.preview.familyMembers')}
                </Typography>
                <Typography variant="h6">
                  {preview.estimatedFamilyMembers}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.preview.totalMembers')}
                </Typography>
                <Typography variant="h6">
                  {preview.estimatedTotalMembers}
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('generation.preview.totalExpected')}
              </Typography>
              <Typography variant="h4" color="primary">
                {formatCurrency(preview.estimatedTotalAmount)}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Alert severity="info">
          {t('generation.preview.confirmMessage')}
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onBack} disabled={loading}>
            {t('common.back')}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            size="large"
          >
            {t('generation.preview.confirm')}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
