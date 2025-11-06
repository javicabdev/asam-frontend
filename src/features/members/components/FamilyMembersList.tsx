import React from 'react'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { FamilyMember } from '../types'
import { FamilyMemberForm } from './FamilyMemberForm'

interface FamilyMembersListProps {
  members: FamilyMember[]
  onAdd: (member: FamilyMember) => void
  onEdit: (index: number, member: FamilyMember) => void
  onRemove: (index: number) => void
}

export const FamilyMembersList: React.FC<FamilyMembersListProps> = ({
  members,
  onAdd,
  onEdit,
  onRemove,
}) => {
  const { t } = useTranslation('members')
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)

  const handleAdd = () => {
    setEditingIndex(null)
    setFormOpen(true)
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setFormOpen(true)
  }

  const handleSave = (member: FamilyMember) => {
    if (editingIndex !== null) {
      onEdit(editingIndex, member)
    } else {
      onAdd(member)
    }
    setFormOpen(false)
    setEditingIndex(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {t('familyMembersList.title')}
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd} size="small">
            {t('familyMembersList.addButton')}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {members.length === 0 ? (
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
            {members.map((member, index) => (
              <ListItem key={index} divider={index < members.length - 1}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {member.nombre} {member.apellidos}
                      </Typography>
                      {member.parentesco && (
                        <Chip label={member.parentesco} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      {member.fecha_nacimiento && (
                        <Typography variant="body2" component="span">
                          {t('familyMembersList.birthDate')}: {formatDate(member.fecha_nacimiento)}
                        </Typography>
                      )}
                      {member.dni_nie && (
                        <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                          {t('familyMembersList.dni')}: {member.dni_nie}
                        </Typography>
                      )}
                      {member.correo_electronico && (
                        <Typography variant="body2" component="div">
                          {t('familyMembersList.email')}: {member.correo_electronico}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label={t('familyMembersList.editButton')}
                    onClick={() => handleEdit(index)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label={t('familyMembersList.deleteButton')}
                    onClick={() => onRemove(index)}
                    color="error"
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
          member={editingIndex !== null ? members[editingIndex] : undefined}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}
