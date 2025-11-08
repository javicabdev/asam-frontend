import React, { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { FeeGenerationDialog } from '@/features/fees/components'

export const AnnualFeesPage: React.FC = () => {
  const { t } = useTranslation('fees')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {t('page.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="large"
          >
            {t('page.generateButton')}
          </Button>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">
              {t('page.about.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('page.about.description')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('page.about.howItWorks')}
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      <FeeGenerationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Container>
  )
}
