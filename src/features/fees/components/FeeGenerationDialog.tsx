import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Box,
  IconButton,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useFeeGeneration } from '../hooks/useFeeGeneration'
import { FeeGenerationForm } from './FeeGenerationForm'
import { FeeGenerationPreviewComponent } from './FeeGenerationPreview'
import { FeeGenerationResult } from './FeeGenerationResult'

interface FeeGenerationDialogProps {
  open: boolean
  onClose: () => void
}

export const FeeGenerationDialog: React.FC<FeeGenerationDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation('fees')
  const {
    state,
    generating,
    validateAndPreview,
    confirmGeneration,
    reset,
    goBack,
  } = useFeeGeneration()

  const handleClose = () => {
    reset()
    onClose()
  }

  const steps = [
    t('generation.steps.configure'),
    t('generation.steps.preview'),
    t('generation.steps.generate'),
  ]

  const getActiveStep = () => {
    switch (state.step) {
      case 'form':
        return 0
      case 'preview':
        return 1
      case 'generating':
      case 'result':
      case 'error':
        return 2
      default:
        return 0
    }
  }

  const canClose = state.step !== 'generating'

  return (
    <Dialog
      open={open}
      onClose={canClose ? handleClose : undefined}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={!canClose}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {t('generation.dialog.title')}
          </Typography>
          {canClose && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={4}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>
            {state.step === 'form' && (
              <FeeGenerationForm
                onSubmit={validateAndPreview}
                disabled={generating}
              />
            )}

            {state.step === 'preview' && state.preview && (
              <FeeGenerationPreviewComponent
                preview={state.preview}
                onConfirm={confirmGeneration}
                onBack={goBack}
                loading={generating}
              />
            )}

            {state.step === 'generating' && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 300,
                  gap: 3,
                }}
              >
                <CircularProgress size={64} />
                <Typography variant="h6" color="text.secondary">
                  {t('generation.generating.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('generation.generating.message')}
                </Typography>
              </Box>
            )}

            {(state.step === 'result' || state.step === 'error') && (
              <FeeGenerationResult
                result={state.result}
                error={state.error}
                onClose={handleClose}
              />
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
