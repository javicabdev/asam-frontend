import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { FamilyMember } from '../types'
import { useDocumentValidation } from '../hooks'
import { isValidEmail } from '@/utils/validation'

interface FamilyMemberFormProps {
  open: boolean
  member?: FamilyMember
  onClose: () => void
  onSave: (member: FamilyMember) => void
}

export const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  open,
  member,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation('members')

  const PARENTESCO_OPTIONS = [
    { value: 'child', label: t('familyMemberForm.relationship.child') },
    { value: 'father', label: t('familyMemberForm.relationship.father') },
    { value: 'mother', label: t('familyMemberForm.relationship.mother') },
    { value: 'sibling', label: t('familyMemberForm.relationship.sibling') },
    { value: 'grandparent', label: t('familyMemberForm.relationship.grandparent') },
    { value: 'grandchild', label: t('familyMemberForm.relationship.grandchild') },
    { value: 'uncle_aunt', label: t('familyMemberForm.relationship.uncle_aunt') },
    { value: 'nephew_niece', label: t('familyMemberForm.relationship.nephew_niece') },
    { value: 'cousin', label: t('familyMemberForm.relationship.cousin') },
    { value: 'other', label: t('familyMemberForm.relationship.other') },
  ]

  const [formData, setFormData] = React.useState<FamilyMember>({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    dni_nie: '',
    correo_electronico: '',
    parentesco: 'child',
  })

  const [fechaNacimiento, setFechaNacimiento] = React.useState<Date | null>(null)
  const [emailError, setEmailError] = React.useState<string>('')

  // Validación de DNI
  const {
    isValidating: isValidatingDocument,
    validationResult: documentValidation,
    validateDocument,
    clearValidation,
  } = useDocumentValidation()

  React.useEffect(() => {
    if (member) {
      setFormData(member)
      if (member.fecha_nacimiento) {
        setFechaNacimiento(new Date(member.fecha_nacimiento))
      }
      // Validar DNI si existe
      if (member.dni_nie) {
        void validateDocument(member.dni_nie)
      }
      // Validar email si existe
      if (member.correo_electronico && !isValidEmail(member.correo_electronico)) {
        setEmailError(t('familyMemberForm.validation.invalidEmail'))
      } else {
        setEmailError('')
      }
    } else {
      setFormData({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        dni_nie: '',
        correo_electronico: '',
        parentesco: 'child',
      })
      setFechaNacimiento(null)
      clearValidation()
      setEmailError('')
    }
  }, [member, open, validateDocument, clearValidation, t])

  const handleChange =
    (field: keyof FamilyMember) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  const handleDateChange = (newValue: Date | null) => {
    setFechaNacimiento(newValue)
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: newValue ? format(newValue, 'yyyy-MM-dd') : '',
    }))
  }

  const handleDniChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      dni_nie: value,
    }))

    // Validar DNI cuando tiene al menos 8 caracteres
    if (value.length >= 8) {
      void validateDocument(value)
    } else {
      clearValidation()
    }
  }

  const handleDniBlur = () => {
    if (formData.dni_nie) {
      void validateDocument(formData.dni_nie).then((result) => {
        // Si hay normalización, actualizar el valor
        if (result && result.normalizedValue && result.normalizedValue !== formData.dni_nie) {
          setFormData((prev) => ({
            ...prev,
            dni_nie: result.normalizedValue,
          }))
        }
      })
    }
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      correo_electronico: value,
    }))

    // Validar email si no está vacío
    if (value && !isValidEmail(value)) {
      setEmailError(t('familyMemberForm.validation.invalidEmail'))
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.apellidos || !formData.parentesco) {
      return
    }

    // Si hay DNI, debe ser válido
    if (formData.dni_nie && documentValidation && !documentValidation.isValid) {
      return
    }

    // Usar el DNI normalizado si está disponible
    const dataToSave = {
      ...formData,
      dni_nie: documentValidation?.normalizedValue || formData.dni_nie,
    }

    onSave(dataToSave)
    onClose()
  }

  // Determinar si el botón de guardar debe estar deshabilitado
  const isSubmitDisabled =
    !formData.nombre ||
    !formData.apellidos ||
    !formData.parentesco ||
    // Si hay DNI, debe ser válido
    (formData.dni_nie !== '' && documentValidation !== null && !documentValidation.isValid) ||
    // Si hay email, debe ser válido
    !!emailError ||
    // Si está validando, deshabilitar
    isValidatingDocument

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {member ? t('familyMemberForm.editTitle') : t('familyMemberForm.addTitle')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('familyMemberForm.fields.firstName')}
                value={formData.nombre}
                onChange={handleChange('nombre')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('familyMemberForm.fields.lastName')}
                value={formData.apellidos}
                onChange={handleChange('apellidos')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label={t('familyMemberForm.fields.birthDate')}
                value={fechaNacimiento}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                maxDate={new Date()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('familyMemberForm.fields.dni')}
                value={formData.dni_nie || ''}
                onChange={handleDniChange}
                onBlur={handleDniBlur}
                error={
                  formData.dni_nie !== '' &&
                  documentValidation !== null &&
                  !documentValidation.isValid
                }
                helperText={
                  formData.dni_nie !== '' && documentValidation && !documentValidation.isValid
                    ? documentValidation.errorMessage
                    : isValidatingDocument
                      ? t('familyMemberForm.validation.validating')
                      : t('familyMemberForm.fields.dniPlaceholder')
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('familyMemberForm.fields.email')}
                type="email"
                value={formData.correo_electronico || ''}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError || t('familyMemberForm.fields.emailPlaceholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label={t('familyMemberForm.fields.relationship')}
                value={formData.parentesco || ''}
                onChange={handleChange('parentesco')}
                required
              >
                {PARENTESCO_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('familyMemberForm.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitDisabled}>
            {member ? t('familyMemberForm.update') : t('familyMemberForm.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
