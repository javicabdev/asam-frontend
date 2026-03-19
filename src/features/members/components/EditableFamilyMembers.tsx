import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { FamilyMemberForm } from './FamilyMemberForm'
import { useFamilyData } from '../hooks'
import { MembershipType, FamilyMember, DocumentType } from '../types'
import {
  useAddFamilyMemberMutation,
  useUpdateFamilyMemberMutation,
  useRemoveFamilyMemberMutation,
  GetFamilyByOriginMemberDocument,
} from '@/graphql/generated/operations'

interface EditableFamilyMembersProps {
  memberId: string
  membershipType: MembershipType
}

export function EditableFamilyMembers({ memberId, membershipType }: EditableFamilyMembersProps) {
  const { t } = useTranslation('members')
  const { family, familiares, loading, error } = useFamilyData(memberId, membershipType)

  const [formOpen, setFormOpen] = React.useState(false)
  const [editingFamiliar, setEditingFamiliar] = React.useState<typeof familiares[number] | null>(null)
  const [operationError, setOperationError] = React.useState<string | null>(null)
  const [operationLoading, setOperationLoading] = React.useState(false)

  const refetchQueries = [
    { query: GetFamilyByOriginMemberDocument, variables: { memberId } },
  ]

  const [addFamilyMember] = useAddFamilyMemberMutation({ refetchQueries })
  const [updateFamilyMember] = useUpdateFamilyMemberMutation({ refetchQueries })
  const [removeFamilyMember] = useRemoveFamilyMemberMutation({ refetchQueries })

  if (membershipType !== MembershipType.FAMILY) return null

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !family) {
    return (
      <Alert severity="error">
        {t('editMemberPage.familySection.loadError')}
      </Alert>
    )
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch {
      return ''
    }
  }

  const formatDateToRFC3339 = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null
    // Si ya viene en RFC3339 (contiene 'T'), devolver tal cual
    if (dateString.includes('T')) return dateString
    // Convertir yyyy-MM-dd a RFC3339
    return `${dateString}T00:00:00Z`
  }

  const buildFamiliarInput = (member: FamilyMember) => ({
    nombre: member.nombre,
    apellidos: member.apellidos,
    fecha_nacimiento: formatDateToRFC3339(member.fecha_nacimiento),
    dni_nie: member.dni_nie || null,
    document_type: (member.tipo_documento as any) || null,
    correo_electronico: member.correo_electronico || null,
    parentesco: member.parentesco || 'Hijo/a',
  })

  const handleAdd = () => {
    setEditingFamiliar(null)
    setFormOpen(true)
  }

  const handleEdit = (familiar: typeof familiares[number]) => {
    setEditingFamiliar(familiar)
    setFormOpen(true)
  }

  const handleSave = async (member: FamilyMember) => {
    setOperationError(null)
    setOperationLoading(true)
    try {
      if (editingFamiliar?.id) {
        // Editar: usar updateFamilyMember
        await updateFamilyMember({
          variables: {
            familiarId: editingFamiliar.id,
            familiar: buildFamiliarInput(member),
          },
        })
      } else {
        // Añadir nuevo
        await addFamilyMember({
          variables: {
            family_id: family.id,
            familiar: buildFamiliarInput(member),
          },
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('editMemberPage.familySection.operationError')
      setOperationError(msg)
    } finally {
      setOperationLoading(false)
    }
  }

  const handleRemove = async (familiarId: string) => {
    setOperationError(null)
    setOperationLoading(true)
    try {
      const result = await removeFamilyMember({
        variables: { familiar_id: familiarId },
      })
      if (result.data?.removeFamilyMember?.error) {
        setOperationError(result.data.removeFamilyMember.error)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('editMemberPage.familySection.operationError')
      setOperationError(msg)
    } finally {
      setOperationLoading(false)
    }
  }

  const getParentescoLabel = (parentesco?: string | null) => {
    if (!parentesco) return ''
    const key = `familyMemberForm.relationship.${parentesco}`
    const translated = t(key)
    return translated === key ? parentesco : translated
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          {t('editMemberPage.familySection.title')}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="small"
          disabled={operationLoading}
        >
          {t('familyMembersList.addButton')}
        </Button>
      </Box>

      {operationError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setOperationError(null)}>
          {operationError}
        </Alert>
      )}

      {operationLoading && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      {familiares.length === 0 ? (
        <Box
          sx={{
            py: 4,
            textAlign: 'center',
            color: 'text.secondary',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <PersonIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body1">{t('familyMembersList.empty')}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {t('familyMembersList.emptyHint')}
          </Typography>
        </Box>
      ) : (
        <List>
          {familiares.map((familiar) => (
            <ListItem key={familiar.id} divider>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">
                      {familiar.nombre} {familiar.apellidos}
                    </Typography>
                    {familiar.parentesco && (
                      <Chip
                        label={getParentescoLabel(familiar.parentesco)}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    {familiar.fecha_nacimiento && (
                      <Typography variant="body2" component="span">
                        {t('familyMembersList.birthDate')}: {formatDate(familiar.fecha_nacimiento)}
                      </Typography>
                    )}
                    {familiar.dni_nie && (
                      <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                        {t('familyMembersList.dni')}: {familiar.dni_nie}
                      </Typography>
                    )}
                    {familiar.correo_electronico && (
                      <Typography variant="body2" component="div">
                        {t('familyMembersList.email')}: {familiar.correo_electronico}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label={t('familyMembersList.editButton')}
                  onClick={() => handleEdit(familiar)}
                  sx={{ mr: 1 }}
                  disabled={operationLoading}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label={t('familyMembersList.deleteButton')}
                  onClick={() => void handleRemove(familiar.id)}
                  color="error"
                  disabled={operationLoading}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <FamilyMemberForm
        open={formOpen}
        member={editingFamiliar ? {
          id: editingFamiliar.id,
          nombre: editingFamiliar.nombre,
          apellidos: editingFamiliar.apellidos,
          fecha_nacimiento: editingFamiliar.fecha_nacimiento || undefined,
          tipo_documento: (editingFamiliar.document_type as DocumentType) || undefined,
          dni_nie: editingFamiliar.dni_nie || undefined,
          correo_electronico: editingFamiliar.correo_electronico || undefined,
          parentesco: editingFamiliar.parentesco || undefined,
        } : undefined}
        onClose={() => setFormOpen(false)}
        onSave={(m) => void handleSave(m)}
      />
    </Box>
  )
}
