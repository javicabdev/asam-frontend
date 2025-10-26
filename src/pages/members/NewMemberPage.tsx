import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, ApolloError, FetchResult } from '@apollo/client'
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
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'

import { MemberForm } from '@/features/members/components/MemberForm'
import { CREATE_MEMBER_MUTATION } from '@/features/members/api/queries'
import {
  CREATE_FAMILY_MUTATION,
  ADD_FAMILY_MEMBER_MUTATION,
} from '@/features/members/api/mutations'
import { MembershipType } from '@/features/members/types'
import type {
  CreateMemberMutation,
  CreateMemberMutationVariables,
  CreateFamilyMutation,
  CreateFamilyMutationVariables,
  AddFamilyMemberMutation,
  AddFamilyMemberMutationVariables,
  MembershipType as GraphQLMembershipType,
} from '@/graphql/generated/operations'

// Import the form data type from MemberForm
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
  esposo_nombre: string | null | undefined
  esposo_apellidos: string | null | undefined
  esposo_fecha_nacimiento: string | null
  esposo_documento_identidad: string | null | undefined
  esposo_correo_electronico: string | null | undefined
  esposa_nombre: string | null | undefined
  esposa_apellidos: string | null | undefined
  esposa_fecha_nacimiento: string | null
  esposa_documento_identidad: string | null | undefined
  esposa_correo_electronico: string | null | undefined
  familyMembers: Array<{
    nombre: string
    apellidos: string
    fecha_nacimiento?: string | null
    dni_nie?: string
    correo_electronico?: string
    parentesco?: string
  }>
}

export const NewMemberPage: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [fieldErrors, setFieldErrors] = React.useState<Array<{field: string, message: string}>>([])

  // Get auth state for debugging
  const { user, isAuthenticated, accessToken } = useAuthStore()

  // Helper function to extract field errors from GraphQL error
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

  const [createMember] = useMutation<
    CreateMemberMutation,
    CreateMemberMutationVariables
  >(CREATE_MEMBER_MUTATION)
  
  const [createFamily] = useMutation<
    CreateFamilyMutation,
    CreateFamilyMutationVariables
  >(CREATE_FAMILY_MUTATION)
  
  const [addFamilyMember] = useMutation<
    AddFamilyMemberMutation,
    AddFamilyMemberMutationVariables
  >(ADD_FAMILY_MEMBER_MUTATION)

  const handleCancel = () => {
    navigate('/members')
  }

  // Check if user has admin permissions
  React.useEffect(() => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para crear un socio')
    } else if (user?.role !== 'admin') {
      setError('No tienes permisos de administrador para crear socios')
    }
  }, [isAuthenticated, user])

  const handleSubmit = async (data: MemberFormSubmitData) => {
    setLoading(true)
    setError(null)
    setFieldErrors([]) // Clear field errors from previous submit

    try {
      // Helper function to format date to RFC3339
      const formatDateToRFC3339 = (dateString: string | null | undefined): string | null => {
        if (!dateString) return null
        // Assuming dateString is in format YYYY-MM-DD from the date picker
        // Convert to RFC3339 format with UTC timezone as expected by the backend
        // Example: "1970-10-10" -> "1970-10-10T00:00:00Z"
        return `${dateString}T00:00:00Z`
      }

      // Step 1: Create the main member
      const memberInput = {
        numero_socio: data.numero_socio, // Use the number from the form
        tipo_membresia: data.tipo_membresia as GraphQLMembershipType,
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
      }

      console.log('Creating member with input:', memberInput)

      const memberResult: FetchResult<CreateMemberMutation> = await createMember({
        variables: { input: memberInput },
      })

      console.log('Member creation result:', memberResult)

      // Check for GraphQL errors first
      if (memberResult.errors && memberResult.errors.length > 0) {
        const graphQLError = memberResult.errors[0]
        
        // Extract field-specific errors
        const extractedFieldErrors = extractFieldErrors(graphQLError)
        setFieldErrors(extractedFieldErrors)
        
        // Set general error message
        const errorMessage = graphQLError.message || 'Error al crear el socio'
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

      // Validate response data
      if (!memberResult.data?.createMember?.miembro_id) {
        setError('No se recibió una respuesta válida del servidor')
        setLoading(false)
        return
      }

      const newMemberId = memberResult.data.createMember.miembro_id

      // Step 2: If it's a family membership, create the family
      if (data.tipo_membresia === MembershipType.FAMILY) {
        // Validate required fields for family creation
        if (!data.esposo_nombre || !data.esposo_apellidos) {
          setError('Para crear una familia, los campos "Nombre del Esposo" y "Apellidos del Esposo" son obligatorios')
          setLoading(false)
          return
        }

        const familyInput = {
          numero_socio: data.numero_socio, // Use the same number as the main member
          miembro_origen_id: newMemberId,
          esposo_nombre: data.esposo_nombre,
          esposo_apellidos: data.esposo_apellidos,
          esposo_fecha_nacimiento: formatDateToRFC3339(data.esposo_fecha_nacimiento),
          esposo_documento_identidad: data.esposo_documento_identidad || undefined,
          esposo_correo_electronico: data.esposo_correo_electronico || undefined,
          esposa_nombre: data.esposa_nombre || undefined,
          esposa_apellidos: data.esposa_apellidos || undefined,
          esposa_fecha_nacimiento: formatDateToRFC3339(data.esposa_fecha_nacimiento),
          esposa_documento_identidad: data.esposa_documento_identidad || undefined,
          esposa_correo_electronico: data.esposa_correo_electronico || undefined,
        }

        console.log('Creating family with input:', familyInput)

        const familyResult: FetchResult<CreateFamilyMutation> = await createFamily({
          variables: { input: familyInput },
        })

        console.log('Family creation result:', familyResult)

        // Check for GraphQL errors first
        if (familyResult.errors && familyResult.errors.length > 0) {
          const graphQLError = familyResult.errors[0]
          
          // Extract field-specific errors
          const extractedFieldErrors = extractFieldErrors(graphQLError)
          setFieldErrors(extractedFieldErrors)
          
          // Set general error message
          const errorMessage = graphQLError.message || 'Error al crear la familia'
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

        // Validate response data
        if (!familyResult.data?.createFamily?.id) {
          setError('No se pudo crear la familia')
          setLoading(false)
          return
        }

        const familyId = familyResult.data.createFamily.id

        // Step 3: Add family members
        for (const familyMember of data.familyMembers || []) {
          console.log('Adding family member:', familyMember)

          const addMemberResult: FetchResult<AddFamilyMemberMutation> = await addFamilyMember({
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
          })

          console.log('Add family member result:', addMemberResult)

          // Check for GraphQL errors
          if (addMemberResult.errors && addMemberResult.errors.length > 0) {
            const graphQLError = addMemberResult.errors[0]
            
            // Note: Family member errors don't map to main form fields,
            // so we only show them in the general Snackbar error
            
            // Set general error message
            const errorMessage = graphQLError.message || `Error al añadir familiar: ${familyMember.nombre} ${familyMember.apellidos}`
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

          // Validate response data
          if (!addMemberResult.data?.addFamilyMember) {
            setError(`No se pudo añadir el familiar: ${familyMember.nombre} ${familyMember.apellidos}`)
            setLoading(false)
            return
          }
        }
      }

      // Navigate to payment page with member ID
      console.log('Member created successfully, navigating to payment page')
      navigate(`/payments/initial/${newMemberId}`)
    } catch (err) {
      console.error('Error creating member:', err)

      // Better error handling with specific messages
      let errorMessage = 'Ha ocurrido un error al crear el socio'

      if (err instanceof ApolloError) {
        // Check for specific error types
        const graphQLError = err.graphQLErrors && err.graphQLErrors.length > 0 
          ? err.graphQLErrors[0].message 
          : ''
        
        // Detect duplicate number error
        if (graphQLError.toLowerCase().includes('duplicate') || 
            graphQLError.toLowerCase().includes('duplicado') ||
            graphQLError.toLowerCase().includes('already exists')) {
          errorMessage = `El número de socio "${data.numero_socio}" ya existe. Por favor, genera un nuevo número o verifica en la base de datos.`
        } else if (graphQLError) {
          errorMessage = graphQLError
        } else if (err.networkError) {
          errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.'
        } else if (err.message.toLowerCase().includes('internal server error')) {
          errorMessage = `Error del servidor. El socio puede haber sido creado parcialmente. Verifica en la lista de socios antes de intentar de nuevo.`
        } else if (err.message) {
          errorMessage = err.message
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
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
            <Chip label={`Usuario: ${user?.username || 'N/A'}`} color="info" size="small" />
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
            <strong>Importante:</strong> Después de completar el registro, deberá realizar el pago
            de la cuota inicial para activar la membresía.
          </Typography>
        </CardContent>
      </Card>

      {user?.role === 'admin' ? (
        <MemberForm 
          onCancel={handleCancel} 
          onSubmit={(data) => void handleSubmit(data)}
          externalErrors={fieldErrors}
        />
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {!isAuthenticated
            ? 'Debes iniciar sesión para acceder a esta página'
            : 'No tienes permisos de administrador para crear socios. Contacta con un administrador si necesitas crear un nuevo socio.'}
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
    </Container>
  )
}
