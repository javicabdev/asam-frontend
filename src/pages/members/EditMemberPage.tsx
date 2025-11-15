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
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'

import { MemberForm } from '@/features/members/components/MemberForm'
import { FamilyMembersDisplay } from '@/features/members/components'
import { UPDATE_MEMBER_MUTATION } from '@/features/members/api/mutations'
import { useGetMemberQuery } from '@/graphql/generated/operations'
import { MembershipType } from '@/features/members/types'
import { useFamilyData } from '@/features/members/hooks'
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
  telefonos?: Array<{ numero_telefono: string }> // ⭐ NUEVO CAMPO
}

export const EditMemberPage: React.FC = () => {
  const { t } = useTranslation('members')
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

  // Load family data if member is FAMILY type
  const { family, familiares, loading: loadingFamily } = useFamilyData(
    member?.miembro_id || '',
    member?.tipo_membresia || MembershipType.INDIVIDUAL
  )

  // Combine member data with family data for the form
  const memberWithFamily = React.useMemo(() => {
    if (!member) return null
    if (member.tipo_membresia !== MembershipType.FAMILY || !family) return member

    return {
      ...member,
      esposa_nombre: family.esposa_nombre,
      esposa_apellidos: family.esposa_apellidos,
      esposa_fecha_nacimiento: family.esposa_fecha_nacimiento,
      esposa_documento_identidad: family.esposa_documento_identidad,
      esposa_correo_electronico: family.esposa_correo_electronico,
      familyMembers: familiares || []
    }
  }, [member, family, familiares])

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
      setError(t('editMemberPage.errors.invalidId'))
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
        telefonos: data.telefonos || [], // ⭐ NUEVO CAMPO
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

        const errorMessage = graphQLError.message || t('editMemberPage.errors.updateError')
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
      const errorMessage = err instanceof Error ? err.message : t('editMemberPage.errors.updateError')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check permissions
  React.useEffect(() => {
    if (!isAuthenticated) {
      setError(t('editMemberPage.errors.notAuthenticated'))
    } else if (user?.role !== 'admin') {
      setError(t('editMemberPage.errors.noAdminPermission'))
    }
  }, [isAuthenticated, user, t])

  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{t('editMemberPage.errors.invalidId')}</Alert>
      </Container>
    )
  }

  if (loadingMember || loadingFamily) {
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
          {t('editMemberPage.errors.loadError')}
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
            {t('editMemberPage.breadcrumbs.dashboard')}
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
            {t('editMemberPage.breadcrumbs.members')}
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
          <Typography color="text.primary">{t('editMemberPage.breadcrumbs.edit')}</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        {t('editMemberPage.title')}
      </Typography>

      {user?.role === 'admin' ? (
        <>
          <MemberForm
            mode="edit"
            initialData={memberWithFamily}
            onCancel={handleCancel}
            onSubmit={(data) => void handleSubmit(data)}
            externalErrors={fieldErrors}
            disabledFields={[]}
          />

          {/* Family Members Section - Only for FAMILY membership type */}
          {member.tipo_membresia === MembershipType.FAMILY && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                {t('editMemberPage.familySection.title')}
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('editMemberPage.familySection.readOnlyMessage')}
              </Alert>
              <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <FamilyMembersDisplay
                  memberId={member.miembro_id}
                  membershipType={member.tipo_membresia}
                />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {!isAuthenticated
            ? t('editMemberPage.errors.mustLogin')
            : t('editMemberPage.errors.noPermissionMessage')}
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
          {t('editMemberPage.success.updateMessage')}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EditMemberPage
