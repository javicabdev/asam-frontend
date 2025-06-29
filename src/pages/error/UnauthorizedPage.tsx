import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Block as BlockIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              m: 2,
              p: 3,
              bgcolor: 'error.light',
              borderRadius: '50%',
            }}
          >
            <BlockIcon sx={{ fontSize: 48, color: 'error.dark' }} />
          </Box>

          {/* Title */}
          <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
            Acceso No Autorizado
          </Typography>

          {/* Message */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            No tienes permisos para acceder a esta página. Si crees que esto es un error, 
            por favor contacta con el administrador del sistema.
          </Typography>

          {/* Action Button */}
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Volver al Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
