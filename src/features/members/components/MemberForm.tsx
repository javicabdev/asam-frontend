import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';

interface MemberFormProps {
  onCancel?: () => void;
  onSubmit?: (data: any) => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  onCancel,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    onSubmit?.({});
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Datos del Nuevo Socio
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete el formulario para registrar un nuevo socio. Los campos marcados con * son obligatorios.
        </Typography>
        
        {/* TODO: Form fields will be added in next commits */}
        <Box sx={{ p: 4, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Los campos del formulario se añadirán en los siguientes commits
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
