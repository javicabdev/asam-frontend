import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

import { MemberForm } from '@/features/members/components/MemberForm';

export const NewMemberPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/members');
  };

  const handleSubmit = (data: any) => {
    // TODO: Process form data in future commits
    console.log('Form submitted:', data);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              Dashboard
            </Link>
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/members');
              }}
            >
              Socios
            </Link>
            <Typography color="text.primary">Nuevo Socio</Typography>
          </Breadcrumbs>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Registrar Nuevo Socio
        </Typography>
        
        <Card sx={{ mb: 3, bgcolor: 'info.lighter' }}>
          <CardContent>
            <Typography variant="body1">
              <strong>Importante:</strong> Después de completar el registro, 
              deberá realizar el pago de la cuota inicial para activar la membresía.
            </Typography>
          </CardContent>
        </Card>

        <MemberForm 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
    </Container>
  );
};
