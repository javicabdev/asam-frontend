import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useLazyQuery, ApolloError, FetchResult } from '@apollo/client'
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
import { CREATE_MEMBER_MUTATION, SEARCH_MEMBERS_QUERY } from '@/features/members/api/queries'
import { CREATE_FAMILY_MUTATION } from '@/features/members/api/mutations'
import { MembershipType } from '@/features/members/types'
import type {
  CreateMemberMutation,
  CreateMemberMutationVariables,
  CreateFamilyMutation,
  CreateFamilyMutationVariables,
  SearchMembersQuery,
  SearchMembersQueryVariables,
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
  
  const [searchMembers] = useLazyQuery<
    SearchMembersQuery,
    SearchMembersQueryVariables
  >(SEARCH_MEMBERS_QUERY)

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

      // ✅ IF NOT FAMILY: Use existing flow with createMember
      if (data.tipo_membresia !== MembershipType.FAMILY) {
        const memberInput = {
          numero_socio: data.numero_socio,
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

        console.log('Creating individual member with input:', memberInput)

        const memberResult: FetchResult<CreateMemberMutation> = await createMember({
          variables: { input: memberInput },
        })

        console.log('Individual member creation result:', memberResult)

        // Check for GraphQL errors
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
        console.log('Individual member created successfully, navigating to payment page')
        navigate(`/payments/initial/${newMemberId}`)
        return
      }

      // ✅ IF FAMILY: Use ONE ATOMIC call to createFamily
      const familyInput = {
        numero_socio: data.numero_socio,
        // DO NOT pass miembro_origen_id - let backend create it automatically
        
        // Husband data (using main form fields)
        esposo_nombre: data.nombre,
        esposo_apellidos: data.apellidos,
        esposo_fecha_nacimiento: formatDateToRFC3339(data.fecha_nacimiento),
        esposo_documento_identidad: data.documento_identidad || undefined,
        esposo_correo_electronico: data.correo_electronico || undefined,
        
        // Wife data (optional)
        esposa_nombre: data.esposa_nombre || undefined,
        esposa_apellidos: data.esposa_apellidos || undefined,
        esposa_fecha_nacimiento: formatDateToRFC3339(data.esposa_fecha_nacimiento),
        esposa_documento_identidad: data.esposa_documento_identidad || undefined,
        esposa_correo_electronico: data.esposa_correo_electronico || undefined,
        
        // 🔑 ARRAY OF CHILDREN - ALL IN ONE CALL
        familiares: (data.familyMembers || []).map(fm => ({
          nombre: fm.nombre,
          apellidos: fm.apellidos,
          fecha_nacimiento: formatDateToRFC3339(fm.fecha_nacimiento),
          dni_nie: fm.dni_nie || null,
          correo_electronico: fm.correo_electronico || null,
          parentesco: fm.parentesco || 'Hijo/a', // Required field
        })),
        
        // Address data to create member automatically
        direccion: data.calle_numero_piso,
        codigo_postal: data.codigo_postal,
        poblacion: data.poblacion,
        provincia: data.provincia || 'Barcelona',
        pais: data.pais || 'España',
      }

      console.log('Creating family atomically with input:', familyInput)

      // 🎯 ONE ATOMIC CALL
      const familyResult: FetchResult<CreateFamilyMutation> = await createFamily({
        variables: { input: familyInput },
      })

      console.log('Family creation result:', familyResult)

      // Check for GraphQL errors
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
        setError('No se recibió una respuesta válida del servidor')
        setLoading(false)
        return
      }

      // Success - miembro_origen is already created within the family
      const newFamily = familyResult.data.createFamily
      
      console.log('Family created successfully:', {
        familyId: newFamily.id,
        numeroSocio: newFamily.numero_socio,
        miembroOrigen: newFamily.miembro_origen,
        hasMiembroOrigen: !!newFamily.miembro_origen,
        miembroOrigenId: newFamily.miembro_origen?.miembro_id
      })
      
      let newMemberId = newFamily.miembro_origen?.miembro_id
      
      if (!newMemberId) {
        // Backend created the family but didn't return miembro_origen populated
        // FALLBACK: Search for the member by numero_socio
        console.warn('Backend did not return miembro_origen, searching by numero_socio...')
        
        try {
          const searchResult = await searchMembers({
            variables: { criteria: newFamily.numero_socio }
          })
          
          const foundMembers = searchResult.data?.searchMembers || []
          const matchingMember = foundMembers.find(
            m => m.numero_socio === newFamily.numero_socio
          )
          
          if (matchingMember) {
            console.log('Found member via search fallback:', matchingMember.miembro_id)
            newMemberId = matchingMember.miembro_id
          } else {
            console.error('Could not find member after search fallback')
            setError(
              `La familia se creó correctamente (Número: ${newFamily.numero_socio}), ` +
              'pero no se pudo localizar el socio. Por favor, búscalo manualmente en la lista de socios.'
            )
            setLoading(false)
            return
          }
        } catch (searchError) {
          console.error('Error searching for member:', searchError)
          setError(
            `La familia se creó correctamente (Número: ${newFamily.numero_socio}), ` +
            'pero hubo un error al buscar el socio. Por favor, búscalo manualmente.'
          )
          setLoading(false)
          return
        }
      }

      console.log('Family created successfully, navigating to payment page')
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
            <strong>Importante:</strong> Después de completar el registro, podrá confirmar
            el pago de la cuota inicial en efectivo.
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
