import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'

import { CHANGE_MEMBER_STATUS_MUTATION } from '../api/mutations'
import { LIST_MEMBERS_QUERY } from '../api/queries'
import type { Member, MemberStatus } from '../types'

interface ConfirmDeactivateDialogProps {
  open: boolean
  member: Member | null
  onClose: () => void
  onSuccess?: () => void
}

export const ConfirmDeactivateDialog: React.FC<ConfirmDeactivateDialogProps> = ({
  open,
  member,
  onClose,
  onSuccess,
}) => {
  const { enqueueSnackbar } = useSnackbar()

  const [changeMemberStatus, { loading, error }] = useMutation(
    CHANGE_MEMBER_STATUS_MUTATION,
    {
      refetchQueries: [{ query: LIST_MEMBERS_QUERY }],
      onCompleted: () => {
        enqueueSnackbar('Socio dado de baja correctamente', { variant: 'success' })
        onSuccess?.()
        onClose()
      },
      onError: (err) => {
        enqueueSnackbar(`Error al dar de baja el socio: ${err.message}`, { variant: 'error' })
      },
    }
  )

  const handleConfirm = () => {
    if (!member) return

    void changeMemberStatus({
      variables: {
        id: member.miembro_id,
        status: 'INACTIVE' as MemberStatus,
      },
    })
  }

  if (!member) return null

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Confirmar Baja de Socio
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro de que desea dar de baja al siguiente socio?
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Número de Socio:
          </Typography>
          <Typography variant="h6" gutterBottom>
            {member.numero_socio}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
            Nombre Completo:
          </Typography>
          <Typography variant="h6">
            {member.nombre} {member.apellidos}
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Esta acción cambiará el estado del socio a <strong>INACTIVO</strong>. 
            El socio no será eliminado del sistema.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Procesando...' : 'Dar de baja'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
