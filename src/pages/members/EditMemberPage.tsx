import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Chip,
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'

import { MemberForm } from '@/features/members/components/MemberForm'
import { UPDATE_MEMBER_MUTATION } from '@/features/members/api/mutations'
import { useGetMemberQuery } from '@/graphql/generated/operations'
import type {
  UpdateMemberMutation,
  UpdateMemberMutationVariables,
} from '@/graphql/generated/operations'

interface MemberFormSubmitData {
  numero_socio: string
  tipo_membresia: string
  nombre: string
  apellidos: string
  calle_numero_piso: string
  codigo_postal: string
  poblacion: string
  provincia: string
  pais: string
  fecha_nacimiento: string | null
  documento_identidad: string
  correo_electronico: string
  profesion: string | null | undefined
  nacionalidad: string | null | undefined
  observaciones: string | null | undefined
}

export const EditMemberPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Array<{field: string, message: string}>>([])

  const { user, isAuthenticated } = useAuthStore()

  // Load member data
  const { 
    data: memberData, 
    loading: loadingMember, 
    error: memberError 
  } = useGetMemberQuery({
    variables: { id: id || '' },
    skip: !id,
  })

  const member = memberData?.getMember

  // Helper to extract field errors
  const extractFieldErrors = (graphQLError: any): Array<{field: string, message: string}> => {
    if (graphQLError.extensions?.fields) {
      const fields = graphQLError.extensions.fields as Record<string, string>
      return Object.entries(fields).map(([field, message]) => ({
        field,
        message,
      }))
    }
    return []
  }

  const [updateMember] = useMutation<
    UpdateMemberMutation,
    UpdateMemberMutationVariables
  >(UPDATE_MEMBER_MUTATION)

  const handleCancel = () => {
    navigate(`/members/${id}`)
  }

  const handleSubmit = async (data: MemberFormSubmitData) => {
    if (!id) {
      setError('ID de socio no válido')
      return
    }

    setLoading(true)
    setError(null)
    setFieldErrors([])

    try {
      // Helper to format date to RFC3339
      const formatDateToRFC3339 = (dateString: string | null | undefined): string | null => {
        if (!dateString) return null
        return `${dateString}T00:00:00Z`
      }

      const memberInput = {
        miembro_id: id,
        // Campos editables permitidos por el backend
        nombre: data.nombre,
        apellidos: data.apellidos,
        fecha_nacimiento: formatDateToRFC3339(data.fecha_nacimiento),
        nacionalidad: data.nacionalidad || null,
        calle_numero_piso: data.calle_numero_piso,
        codigo_postal: data.codigo_postal,
        poblacion: data.poblacion,
        provincia: data.provincia,
        pais: data.pais || 'España',
        correo_electronico: data.correo_electronico || null,
        documento_identidad: data.documento_identidad || null,
        profesion: data.profesion || null,
        observaciones: data.observaciones || null,
      }

      console.log('Updating member with input:', memberInput)

      const result = await updateMember({
        variables: { input: memberInput },
      })

      console.log('Member update result:', result)

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        const graphQLError = result.errors[0]
        
        const extractedFieldErrors = extractFieldErrors(graphQLError)
        setFieldErrors(extractedFieldErrors)
        
        const errorMessage = graphQLError.message || 'Error al actualizar el socio'
        if (graphQLError.extensions?.fields) {
          const fields = graphQLError.extensions.fields as Record<string, string>
          const fieldErrorsText = Object.entries(fields)
            .map(([_field, msg]) => msg)
            .join('. ')
          setError(fieldErrorsText || errorMessage)
        } else {
          setError(errorMessage)
        }
        
        setLoading(false)
        return
      }

      // Success
      setSuccess(true)
      
      // Navigate back to details after 1 second
      setTimeout(() => {
        navigate(`/members/${id}`)
      }, 1000)

    } catch (err) {
      console.error('Error updating member:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el socio'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check permissions
  React.useEffect(() => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para editar un socio')
    } else if (user?.role !== 'admin') {
      setError('No tienes permisos de administrador para editar socios')
    }
  }, [isAuthenticated, user])

  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">ID de socio no válido</Alert>
      </Container>
    )
  }

  if (loadingMember) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (memberError || !member) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          No se pudo cargar la información del socio. Por favor, verifica que el ID sea correcto.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              navigate('/dashboard')
            }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              navigate('/members')
            }}
          >
            Socios
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              navigate(`/members/${id}`)
            }}
          >
            {member.nombre} {member.apellidos}
          </Link>
          <Typography color="text.primary">Editar</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h4" component="h1">
          Editar Socio
        </Typography>
        {import.meta.env.DEV && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={isAuthenticated ? 'Autenticado' : 'No autenticado'}
              color={isAuthenticated ? 'success' : 'error'}
              size="small"
            />
            <Chip label={`Usuario: ${user?.username || 'N/A'}`} color="info" size="small" />
            <Chip
              label={`Rol: ${user?.role || 'N/A'}`}
              color={user?.role === 'admin' ? 'success' : 'warning'}
              size="small"
            />
          </Box>
        )}
      </Box>

      {user?.role === 'admin' ? (
        <MemberForm
          mode="edit"
          initialData={member}
          onCancel={handleCancel}
          onSubmit={(data) => void handleSubmit(data)}
          externalErrors={fieldErrors}
          disabledFields={[]}
        />
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {!isAuthenticated
            ? 'Debes iniciar sesión para acceder a esta página'
            : 'No tienes permisos de administrador para editar socios. Contacta con un administrador.'}
        </Alert>
      )}

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Socio actualizado correctamente
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EditMemberPage
