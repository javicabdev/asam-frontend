import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
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
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Recuperar Contraseña
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Para recuperar tu contraseña, ponte en contacto con el administrador del sistema.
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Email: admin@mutuaasam.org
          </Typography>

          <Button
            component={RouterLink}
            to="/login"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            fullWidth
          >
            Volver al inicio de sesión
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};
