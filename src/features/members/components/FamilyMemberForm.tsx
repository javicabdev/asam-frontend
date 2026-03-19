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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { FamilyMember, DocumentType, Parentesco, PARENTESCO_I18N_KEY } from '../types'
import { isValidEmail, normalizeDocument } from '@/utils/validation'
import { useDocumentValidation } from '../hooks'

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
  const {
    isValidating: isValidatingDocument,
    validationResult: documentValidation,
    validateDocument,
    clearValidation: clearDocumentValidation,
  } = useDocumentValidation()

  const PARENTESCO_OPTIONS = Object.values(Parentesco).map((value) => ({
    value,
    label: t(`familyMemberForm.relationship.${PARENTESCO_I18N_KEY[value]}`),
  }))

  const [formData, setFormData] = React.useState<FamilyMember>({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    tipo_documento: DocumentType.OTHER,
    dni_nie: '',
    correo_electronico: '',
    parentesco: Parentesco.HIJO,
  })

  const [fechaNacimiento, setFechaNacimiento] = React.useState<Date | null>(null)
  const [emailError, setEmailError] = React.useState<string>('')
  const [dateError, setDateError] = React.useState<string>('')
  const [documentError, setDocumentError] = React.useState<string>('')

  React.useEffect(() => {
    if (member) {
      setFormData(member)
      if (member.fecha_nacimiento) {
        setFechaNacimiento(new Date(member.fecha_nacimiento))
      }
      // Validar email si existe
      if (member.correo_electronico && !isValidEmail(member.correo_electronico)) {
        setEmailError(t('familyMemberForm.validation.invalidEmail'))
      } else {
        setEmailError('')
      }
      setDateError('')
      setDocumentError('')
    } else {
      setFormData({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        tipo_documento: DocumentType.OTHER,
        dni_nie: '',
        correo_electronico: '',
        parentesco: Parentesco.HIJO,
      })
      setFechaNacimiento(null)
      setEmailError('')
      setDateError('')
      setDocumentError('')
    }
  }, [member, open, t])

  // Sync backend validation result with local error state
  React.useEffect(() => {
    if (documentValidation && !documentValidation.isValid) {
      setDocumentError(documentValidation.errorMessage || t('familyMemberForm.validation.invalidDocument'))
    } else if (documentValidation && documentValidation.isValid) {
      setDocumentError('')
    }
  }, [documentValidation, t])

  // Clear document validation when document type changes
  React.useEffect(() => {
    clearDocumentValidation()
    setDocumentError('')
  }, [formData.tipo_documento, clearDocumentValidation])

  const handleChange =
    (field: keyof FamilyMember) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  const handleDateChange = (newValue: Date | null) => {
    setFechaNacimiento(newValue)
    // No formateamos aquí — se formatea solo al hacer submit.
    // Mientras el usuario teclea, newValue puede ser un Date inválido.
    if (newValue === null) {
      setDateError('')
    } else if (isNaN(newValue.getTime())) {
      setDateError(t('familyMemberForm.validation.invalidDate'))
    } else {
      setDateError('')
    }
  }

  const handleDniChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const normalized = normalizeDocument(value)
    setFormData((prev) => ({
      ...prev,
      dni_nie: normalized,
    }))
    setDocumentError('')
  }

  const handleDniBlur = () => {
    // Only validate if not type OTHER
    if (formData.dni_nie && formData.tipo_documento && formData.tipo_documento !== DocumentType.OTHER) {
      void validateDocument(formData.dni_nie)
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

    // Validar fecha si se introdujo algo
    if (fechaNacimiento !== null && isNaN(fechaNacimiento.getTime())) {
      setDateError(t('familyMemberForm.validation.invalidDate'))
      return
    }

    // Check document validation result if provided and not type OTHER
    if (
      formData.dni_nie &&
      formData.tipo_documento &&
      formData.tipo_documento !== DocumentType.OTHER &&
      documentValidation &&
      !documentValidation.isValid
    ) {
      setDocumentError(documentValidation.errorMessage || t('familyMemberForm.validation.invalidDocument'))
      return
    }

    // Validar email si se proporcionó
    if (formData.correo_electronico && !isValidEmail(formData.correo_electronico)) {
      setEmailError(t('familyMemberForm.validation.invalidEmail'))
      return
    }

    // Formatear la fecha solo al guardar (mismo patrón que MemberForm)
    const dataToSave: FamilyMember = {
      ...formData,
      fecha_nacimiento: fechaNacimiento && !isNaN(fechaNacimiento.getTime())
        ? format(fechaNacimiento, 'yyyy-MM-dd')
        : '',
    }

    onSave(dataToSave)
    onClose()
  }

  // Determinar si el botón de guardar debe estar deshabilitado
  const isSubmitDisabled =
    !formData.nombre ||
    !formData.apellidos ||
    !formData.parentesco ||
    // Si hay errores de validación
    !!dateError ||
    !!emailError ||
    !!documentError

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
                    error: !!dateError,
                    helperText: dateError,
                  },
                }}
                maxDate={new Date()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tipo-documento-familiar-label">{t('familyMemberForm.fields.documentType')}</InputLabel>
                <Select
                  labelId="tipo-documento-familiar-label"
                  label={t('familyMemberForm.fields.documentType')}
                  value={formData.tipo_documento || DocumentType.DNI_NIE}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      tipo_documento: e.target.value as DocumentType,
                    }))
                    setDocumentError('')
                  }}
                >
                  <MenuItem value={DocumentType.DNI_NIE}>{t('memberForm.documentTypes.dniNie')}</MenuItem>
                  <MenuItem value={DocumentType.PASSPORT_SENEGAL}>{t('memberForm.documentTypes.passportSenegal')}</MenuItem>
                  <MenuItem value={DocumentType.OTHER}>{t('memberForm.documentTypes.other')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('familyMemberForm.fields.dni')}
                value={formData.dni_nie || ''}
                onChange={handleDniChange}
                onBlur={handleDniBlur}
                error={!!documentError}
                helperText={
                  documentError ||
                  (isValidatingDocument && t('memberForm.helpers.validating')) ||
                  (formData.tipo_documento === DocumentType.DNI_NIE && t('memberForm.helpers.documentHelperDniNie')) ||
                  (formData.tipo_documento === DocumentType.PASSPORT_SENEGAL && t('memberForm.helpers.documentHelperPassportSenegal')) ||
                  (formData.tipo_documento === DocumentType.OTHER && t('memberForm.helpers.documentHelperOther')) ||
                  t('familyMemberForm.fields.dniPlaceholder')
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
