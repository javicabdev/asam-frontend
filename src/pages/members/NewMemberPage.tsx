import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Chip,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';

import { MemberForm } from '@/features/members/components/MemberForm';
import { CREATE_MEMBER_MUTATION } from '@/features/members/api/queries';
import { CREATE_FAMILY_MUTATION, ADD_FAMILY_MEMBER_MUTATION } from '@/features/members/api/mutations';
import { MembershipType } from '@/features/members/types';

export const NewMemberPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  // Get auth state for debugging
  const { user, isAuthenticated, accessToken } = useAuthStore();

  const [createMember] = useMutation(CREATE_MEMBER_MUTATION);
  const [createFamily] = useMutation(CREATE_FAMILY_MUTATION);
  const [addFamilyMember] = useMutation(ADD_FAMILY_MEMBER_MUTATION);

  const handleCancel = () => {
    navigate('/members');
  };
  
  // Check if user has admin permissions
  React.useEffect(() => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para crear un socio');
    } else if (user?.role !== 'admin') {
      setError('No tienes permisos de administrador para crear socios');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      // Helper function to format date to RFC3339
      const formatDateToRFC3339 = (dateString: string | null | undefined): string | null => {
        if (!dateString) return null;
        // Assuming dateString is in format YYYY-MM-DD from the date picker
        // Convert to RFC3339 format with UTC timezone as expected by the backend
        // Example: "1970-10-10" -> "1970-10-10T00:00:00Z"
        return `${dateString}T00:00:00Z`;
      };

      // Step 1: Create the main member
      const memberInput = {
        numero_socio: data.numero_socio, // Use the number from the form
        tipo_membresia: data.tipo_membresia,
        nombre: data.nombre,
        apellidos: data.apellidos,
        calle_numero_piso: data.calle_numero_piso,
        codigo_postal: data.codigo_postal,
        poblacion: data.poblacion,
        provincia: data.provincia,
        pais: data.pais || 'España',
        fecha_nacimiento: formatDateToRFC3339(data.fecha_nacimiento),
        documento_identidad: data.documento_identidad,
        correo_electronico: data.correo_electronico,
        profesion: data.profesion || null,
        nacionalidad: data.nacionalidad || null,
        observaciones: data.observaciones || null,
      };

      console.log('Creating member with input:', memberInput);

      const memberResult = await createMember({
        variables: { input: memberInput },
      });

      console.log('Member creation result:', memberResult);

      // Validate response
      if (!memberResult.data || !memberResult.data.createMember) {
        throw new Error('No se recibió una respuesta válida del servidor');
      }

      const newMemberId = memberResult.data.createMember.miembro_id;

      // Step 2: If it's a family membership, create the family
      if (data.tipo_membresia === MembershipType.FAMILY) {
        const familyInput = {
          numero_socio: data.numero_socio, // Use the same number as the main member
          miembro_origen_id: newMemberId,
          esposo_nombre: data.esposo_nombre || '',
          esposo_apellidos: data.esposo_apellidos || '',
          esposo_fecha_nacimiento: formatDateToRFC3339(data.esposo_fecha_nacimiento),
          esposo_documento_identidad: data.esposo_documento_identidad || null,
          esposo_correo_electronico: data.esposo_correo_electronico || null,
          esposa_nombre: data.esposa_nombre || '',
          esposa_apellidos: data.esposa_apellidos || '',
          esposa_fecha_nacimiento: formatDateToRFC3339(data.esposa_fecha_nacimiento),
          esposa_documento_identidad: data.esposa_documento_identidad || null,
          esposa_correo_electronico: data.esposa_correo_electronico || null,
        };

        console.log('Creating family with input:', familyInput);

        const familyResult = await createFamily({
          variables: { input: familyInput },
        });

        console.log('Family creation result:', familyResult);

        if (!familyResult.data || !familyResult.data.createFamily) {
          throw new Error('No se pudo crear la familia');
        }

        const familyId = familyResult.data.createFamily.id;

        // Step 3: Add family members
        for (const familyMember of data.familyMembers || []) {
          console.log('Adding family member:', familyMember);
          
          const addMemberResult = await addFamilyMember({
            variables: {
              family_id: familyId,
              familiar: {
                nombre: familyMember.nombre,
                apellidos: familyMember.apellidos,
                fecha_nacimiento: formatDateToRFC3339(familyMember.fecha_nacimiento),
                dni_nie: familyMember.dni_nie || null,
                correo_electronico: familyMember.correo_electronico || null,
                parentesco: familyMember.parentesco || 'Otro',
              },
            },
          });
          
          console.log('Add family member result:', addMemberResult);
        }
      }

      // Navigate to payment page with member ID
      console.log('Member created successfully, navigating to payment page');
      navigate(`/payments/initial/${newMemberId}`);
    } catch (err: any) {
      console.error('Error creating member:', err);
      
      // Better error handling
      let errorMessage = 'Ha ocurrido un error al crear el socio';
      
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        errorMessage = err.graphQLErrors[0].message;
      } else if (err.networkError) {
        errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h4" component="h1">
          Registrar Nuevo Socio
        </Typography>
        {import.meta.env.DEV && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={isAuthenticated ? 'Autenticado' : 'No autenticado'} 
              color={isAuthenticated ? 'success' : 'error'}
              size="small"
            />
            <Chip 
              label={`Usuario: ${user?.username || 'N/A'}`} 
              color="info"
              size="small"
            />
            <Chip 
              label={`Rol: ${user?.role || 'N/A'}`} 
              color={user?.role === 'admin' ? 'success' : 'warning'}
              size="small"
            />
            <Chip 
              label={accessToken ? 'Token presente' : 'Sin token'} 
              color={accessToken ? 'success' : 'error'}
              size="small"
            />
          </Box>
        )}
      </Box>
      
      <Card sx={{ mb: 3, bgcolor: 'info.lighter' }}>
        <CardContent>
          <Typography variant="body1">
            <strong>Importante:</strong> Después de completar el registro, 
            deberá realizar el pago de la cuota inicial para activar la membresía.
          </Typography>
        </CardContent>
      </Card>

      {user?.role === 'admin' ? (
        <MemberForm 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {!isAuthenticated 
            ? 'Debes iniciar sesión para acceder a esta página' 
            : 'No tienes permisos de administrador para crear socios. Contacta con un administrador si necesitas crear un nuevo socio.'}
        </Alert>
      )}

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};
