import React, { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  FormHelperText,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { MembershipType, DocumentType } from '../types'
import { FamilyMembersList } from './FamilyMembersList'
import { TelephoneInput } from './TelephoneInput'
import { EMAIL_REGEX, normalizeDocument } from '@/utils/validation'
import {
  useFamilyForm,
  useNextMemberNumber,
  useMemberNumberValidation,
  useDocumentValidation,
} from '../hooks'
import { formatMemberNumber } from '../utils'

// Tipo para los miembros de familia
interface FamilyMember {
  nombre: string
  apellidos: string
  fecha_nacimiento?: string | null
  dni_nie?: string
  correo_electronico?: string
  parentesco?: string
}

// Tipo para los datos del formulario
interface MemberFormData {
  numero_socio: string
  tipo_membresia: string
  nombre: string
  apellidos: string
  calle_numero_piso: string
  codigo_postal: string
  poblacion: string
  provincia: string
  pais: string
  fecha_alta: Date | null | undefined // ⭐ NUEVO - Fecha de alta histórica
  fecha_nacimiento: Date | null | undefined
  tipo_documento: string
  documento_identidad: string
  correo_electronico: string | null | undefined
  profesion: string | null | undefined
  nacionalidad: string | null | undefined
  observaciones: string | null | undefined
  // Campos de esposa (opcionales)
  esposa_nombre: string | null | undefined
  esposa_apellidos: string | null | undefined
  esposa_fecha_nacimiento: Date | null | undefined
  esposa_tipo_documento: string | null | undefined
  esposa_documento_identidad: string | null | undefined
  esposa_correo_electronico: string | null | undefined
}

// Tipo extendido con campos adicionales que se añaden en el submit
interface MemberFormSubmitData extends Omit<MemberFormData, 'fecha_alta' | 'fecha_nacimiento' | 'esposa_fecha_nacimiento'> {
  fecha_alta: string | null // ⭐ Convertido a string ISO
  fecha_nacimiento: string | null
  // Campos generados en submit para el backend
  esposo_nombre: string
  esposo_apellidos: string
  esposo_fecha_nacimiento: string | null
  esposo_tipo_documento: string | null
  esposo_documento_identidad: string | null
  esposo_correo_electronico: string | null
  esposa_fecha_nacimiento: string | null
  esposa_tipo_documento: string | null
  familyMembers: FamilyMember[]
}

interface FieldError {
  field: string
  message: string
}

interface MemberFormProps {
  mode?: 'create' | 'edit'
  initialData?: any
  onCancel?: () => void
  onSubmit?: (data: MemberFormSubmitData) => void | Promise<void>
  externalErrors?: FieldError[]
  disabledFields?: string[] // Campos que deben estar deshabilitados
}

const getValidationSchema = (t: any) => Yup.object({
  numero_socio: Yup.string()
    .required(t('memberForm.validation.numeroSocioRequired'))
    .matches(/^[AB]\d{5}$/, t('memberForm.validation.numeroSocioFormat')),
  tipo_membresia: Yup.string().required(t('memberForm.validation.tipoMembresiaRequired')),
  nombre: Yup.string().required(t('memberForm.validation.nombreRequired')),
  apellidos: Yup.string().required(t('memberForm.validation.apellidosRequired')),
  calle_numero_piso: Yup.string().required(t('memberForm.validation.direccionRequired')),
  codigo_postal: Yup.string().required(t('memberForm.validation.codigoPostalRequired')),
  poblacion: Yup.string().required(t('memberForm.validation.poblacionRequired')),
  provincia: Yup.string().required(t('memberForm.validation.provinciaRequired')),
  pais: Yup.string().required(t('memberForm.validation.paisRequired')),
  documento_identidad: Yup.string().required(t('memberForm.validation.documentoIdentidadRequired')),
  correo_electronico: Yup.string()
    .nullable()
    .test('email-format', t('memberForm.validation.emailInvalid'), (value) => {
      if (!value) return true // Email es opcional
      return EMAIL_REGEX.test(value)
    }),
  // Campos opcionales
  fecha_alta: Yup.date()
    .nullable()
    .max(new Date(), t('memberForm.validation.fechaAltaFuture')),
  fecha_nacimiento: Yup.date().nullable(),
  profesion: Yup.string().nullable(),
  nacionalidad: Yup.string().nullable(),
  observaciones: Yup.string().nullable(),
})

const getFamilyValidationSchema = (t: any) => getValidationSchema(t).shape({
  // Esposa: campos opcionales
  esposa_nombre: Yup.string().nullable(),
  esposa_apellidos: Yup.string().nullable(),
  esposa_fecha_nacimiento: Yup.date().nullable(),
  esposa_documento_identidad: Yup.string().nullable(),
  esposa_correo_electronico: Yup.string()
    .nullable()
    .test('email-format', t('memberForm.validation.emailInvalid'), (value) => {
      // Si está vacío o null, es válido (campo opcional)
      if (!value) return true
      // Si tiene valor, debe cumplir el formato
      return EMAIL_REGEX.test(value)
    }),
})

export const MemberForm: React.FC<MemberFormProps> = ({
  mode = 'create',
  initialData,
  onCancel,
  onSubmit,
  externalErrors,
  disabledFields = []
}) => {
  const { t } = useTranslation('members')
  const { familyMembers, addFamilyMember, editFamilyMember, removeFamilyMember } = useFamilyForm()
  const [memberNumberManuallyEdited, setMemberNumberManuallyEdited] = React.useState(false)
  const { isValidating, isDuplicate, validateMemberNumber, clearValidation } =
    useMemberNumberValidation()

  // Validación de documentos (solo para DNI/NIE y Pasaporte Senegal, no para "Otro")
  const {
    isValidating: isValidatingDocument,
    validationResult: documentValidation,
    validateDocument,
  } = useDocumentValidation()

  const {
    isValidating: isValidatingEsposaDoc,
    validationResult: esposaDocValidation,
    validateDocument: validateEsposaDocument,
  } = useDocumentValidation()

  // Estado para teléfonos
  const [telefonos, setTelefonos] = useState<string[]>([])

  // Inicializar teléfonos desde initialData
  useEffect(() => {
    if (mode === 'edit' && initialData?.telefonos) {
      setTelefonos(initialData.telefonos.map((t: any) => t.numero_telefono))
    }
  }, [mode, initialData])

  // Get default values based on mode
  const getDefaultValues = (): MemberFormData => {
    if (mode === 'edit' && initialData) {
      return {
        numero_socio: initialData.numero_socio || '',
        tipo_membresia: initialData.tipo_membresia || MembershipType.INDIVIDUAL,
        nombre: initialData.nombre || '',
        apellidos: initialData.apellidos || '',
        calle_numero_piso: initialData.calle_numero_piso || '',
        codigo_postal: initialData.codigo_postal || '',
        poblacion: initialData.poblacion || '',
        provincia: initialData.provincia || 'Barcelona',
        pais: initialData.pais || 'España',
        fecha_alta: initialData.fecha_alta ? new Date(initialData.fecha_alta) : null,
        fecha_nacimiento: initialData.fecha_nacimiento ? new Date(initialData.fecha_nacimiento) : null,
        tipo_documento: initialData.tipo_documento || DocumentType.DNI_NIE,
        documento_identidad: initialData.documento_identidad || '',
        correo_electronico: initialData.correo_electronico || '',
        profesion: initialData.profesion || '',
        nacionalidad: initialData.nacionalidad || '',
        observaciones: initialData.observaciones || '',
        esposa_nombre: initialData.esposa_nombre || '',
        esposa_apellidos: initialData.esposa_apellidos || '',
        esposa_fecha_nacimiento: initialData.esposa_fecha_nacimiento ? new Date(initialData.esposa_fecha_nacimiento) : null,
        esposa_tipo_documento: initialData.esposa_tipo_documento || DocumentType.DNI_NIE,
        esposa_documento_identidad: initialData.esposa_documento_identidad || '',
        esposa_correo_electronico: initialData.esposa_correo_electronico || '',
      }
    }

    return {
      numero_socio: '',
      tipo_membresia: MembershipType.INDIVIDUAL,
      nombre: '',
      apellidos: '',
      calle_numero_piso: '',
      codigo_postal: '',
      poblacion: 'Terrassa',
      provincia: 'Barcelona',
      pais: 'España',
      fecha_alta: null,
      fecha_nacimiento: null,
      tipo_documento: DocumentType.OTHER,
      documento_identidad: '',
      correo_electronico: '',
      profesion: '',
      nacionalidad: 'Senegalesa',
      observaciones: '',
      esposa_nombre: '',
      esposa_apellidos: '',
      esposa_fecha_nacimiento: null,
      esposa_tipo_documento: DocumentType.OTHER,
      esposa_documento_identidad: '',
      esposa_correo_electronico: '',
    }
  }

  const form = useForm<MemberFormData>({
    // @ts-expect-error - Schema dinámico de Yup con validación condicional no infiere tipos correctamente
    resolver: yupResolver(getFamilyValidationSchema(t)),
    defaultValues: getDefaultValues(),
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form

  const tipoMembresia = watch('tipo_membresia')
  const isFamily = tipoMembresia === MembershipType.FAMILY
  const numeroSocio = watch('numero_socio')
  const fechaAlta = watch('fecha_alta')

  // Helper: Verificar si es una fecha histórica
  const isHistoricalDate = (date: Date | null | undefined): boolean => {
    if (!date) return false
    const today = new Date()
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    return date < oneYearAgo
  }

  // Helper: Obtener rango de años desde fecha_alta hasta hoy
  const getYearRange = (date: Date | null | undefined): string => {
    if (!date) return ''
    const startYear = date.getFullYear()
    const endYear = new Date().getFullYear()
    if (startYear === endYear) return `${startYear}`
    return `${startYear}-${endYear}`
  }

  // Track whether family members have been initialized
  const familyMembersInitialized = React.useRef(false)

  // Initialize family members from initialData in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && initialData?.familyMembers && !familyMembersInitialized.current) {
      familyMembersInitialized.current = true
      // Load existing family members
      initialData.familyMembers.forEach((familiar: any) => {
        addFamilyMember({
          id: familiar.id,
          nombre: familiar.nombre,
          apellidos: familiar.apellidos,
          fecha_nacimiento: familiar.fecha_nacimiento || undefined,
          dni_nie: familiar.dni_nie || undefined,
          correo_electronico: familiar.correo_electronico || undefined,
          parentesco: familiar.parentesco || undefined
        })
      })
    }
  }, [mode, initialData, addFamilyMember])

  // Use the hook to get the next member number (skip in edit mode)
  const {
    memberNumber,
    loading: loadingMemberNumber,
    error: memberNumberError,
  } = useNextMemberNumber({
    isFamily,
    skip: mode === 'edit',
  })

  // Set initial member number when it's loaded
  React.useEffect(() => {
    if (memberNumber && !numeroSocio && !memberNumberManuallyEdited) {
      setValue('numero_socio', memberNumber)
    }
  }, [memberNumber, numeroSocio, setValue, memberNumberManuallyEdited])

  // Update member number when membership type changes
  React.useEffect(() => {
    // Check if the current number matches the expected pattern
    const currentPrefix = numeroSocio?.charAt(0)
    const oppositePrefix = isFamily ? 'B' : 'A'

    // If the number has the opposite prefix, reset the manual edit flag
    // This allows automatic update when switching membership types
    if (currentPrefix === oppositePrefix && numeroSocio?.match(/^[AB]\d{5}$/)) {
      setMemberNumberManuallyEdited(false)
    }

    // Only update if the user hasn't manually edited the field
    if (!memberNumberManuallyEdited && memberNumber) {
      setValue('numero_socio', memberNumber)
    }
  }, [isFamily, memberNumber, numeroSocio, setValue, memberNumberManuallyEdited])

  // Clear validation when membership type changes
  React.useEffect(() => {
    clearValidation()
    clearErrors('numero_socio')
  }, [isFamily, clearValidation, clearErrors])

  // Apply external errors from parent component (e.g., GraphQL validation errors)
  React.useEffect(() => {
    if (externalErrors && externalErrors.length > 0) {
      externalErrors.forEach(({ field, message }) => {
        setError(field as keyof MemberFormData, {
          type: 'manual',
          message,
        })
      })
    }
  }, [externalErrors, setError])

  // Función interna que maneja el submit
  const handleFormSubmit = React.useCallback(
    async (data: MemberFormData) => {
    // Don't submit if member number is duplicate
    if (isDuplicate === true) {
      setError('numero_socio', {
        type: 'manual',
        message: t('memberForm.errors.numeroSocioDuplicate'),
      })
      return
    }

    // Check document validation results
    if (data.tipo_documento !== DocumentType.OTHER && documentValidation && !documentValidation.isValid) {
      setError('documento_identidad', {
        type: 'manual',
        message: documentValidation.errorMessage || t('memberForm.errors.documentoInvalido'),
      })
      return
    }

    // Check spouse document validation if provided
    if (
      isFamily &&
      data.esposa_documento_identidad &&
      data.esposa_tipo_documento !== DocumentType.OTHER &&
      esposaDocValidation &&
      !esposaDocValidation.isValid
    ) {
      setError('esposa_documento_identidad', {
        type: 'manual',
        message: esposaDocValidation.errorMessage || t('memberForm.errors.documentoInvalido'),
      })
      return
    }

    // Validation is done on blur, so just normalize documents here
    const telefonosFormateados = telefonos.filter(t => t.trim() !== '').map(numero_telefono => ({ numero_telefono }))

    const formattedData: MemberFormSubmitData = {
      ...data,
      // Normalize documents
      documento_identidad: normalizeDocument(data.documento_identidad),

      // ⭐ Convertir fecha_alta a formato ISO (si está presente)
      fecha_alta: data.fecha_alta ? format(data.fecha_alta, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null,

      // Mapear datos del titular a campos esposo_* para el backend
      esposo_nombre: data.nombre,
      esposo_apellidos: data.apellidos,
      esposo_fecha_nacimiento: data.fecha_nacimiento ? format(data.fecha_nacimiento, 'yyyy-MM-dd') : null,
      esposo_tipo_documento: data.tipo_documento,
      esposo_documento_identidad: normalizeDocument(data.documento_identidad),
      esposo_correo_electronico: data.correo_electronico,

      // Campos de esposa
      esposa_tipo_documento: data.esposa_tipo_documento,
      esposa_documento_identidad: data.esposa_documento_identidad ? normalizeDocument(data.esposa_documento_identidad) : null,
      fecha_nacimiento: data.fecha_nacimiento ? format(data.fecha_nacimiento, 'yyyy-MM-dd') : null,
      esposa_fecha_nacimiento: data.esposa_fecha_nacimiento
        ? format(data.esposa_fecha_nacimiento, 'yyyy-MM-dd')
        : null,
      familyMembers: isFamily ? familyMembers : [],
      telefonos: telefonosFormateados,
    } as MemberFormSubmitData

    if (onSubmit) {
      await onSubmit(formattedData)
    }
    },
    [isFamily, familyMembers, isDuplicate, onSubmit, setError, t, telefonos, documentValidation, esposaDocValidation]
  )

  // Wrapper para manejar correctamente el evento del formulario
  const onFormSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // @ts-expect-error - handleSubmit espera tipo genérico pero handleFormSubmit es seguro
      const submitHandler = handleSubmit(handleFormSubmit)
      void submitHandler(e)
    },
    [handleSubmit, handleFormSubmit]
  )

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('memberForm.title')}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box component="form" onSubmit={onFormSubmit}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('memberForm.description')}
          </Typography>

          {/* Tipo de Membresía y Número de Socio */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="tipo_membresia"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.tipo_membresia}>
                    <InputLabel id="tipo-membresia-label">{t('memberForm.fields.tipoMembresia')}</InputLabel>
                    <Select {...field} labelId="tipo-membresia-label" label={t('memberForm.fields.tipoMembresia')} disabled={mode === 'edit'}>
                      <MenuItem value={MembershipType.INDIVIDUAL}>{t('memberForm.membershipTypes.individual')}</MenuItem>
                      <MenuItem value={MembershipType.FAMILY}>{t('memberForm.membershipTypes.family')}</MenuItem>
                    </Select>
                    {errors.tipo_membresia && (
                      <FormHelperText>{errors.tipo_membresia.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="numero_socio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.numeroSocio')}
                    error={!!errors.numero_socio || isDuplicate === true}
                    helperText={
                      errors.numero_socio?.message ||
                      (isDuplicate && t('memberForm.errors.numeroSocioDuplicate')) ||
                      (isValidating && t('memberForm.helpers.validating')) ||
                      (memberNumberError
                        ? t('memberForm.helpers.numeroSocioError')
                        : t('memberForm.helpers.numeroSocioFormat'))
                    }
                    required
                    disabled={mode === 'edit' || loadingMemberNumber}
                    onChange={(e) => {
                      // Mark as manually edited when user types
                      setMemberNumberManuallyEdited(true)
                      field.onChange(e)
                    }}
                    onBlur={(e) => {
                      // Format the number on blur
                      const formatted = formatMemberNumber(e.target.value, isFamily)
                      if (formatted !== e.target.value) {
                        setValue('numero_socio', formatted)
                        // Trigger validation after formatting
                        void validateMemberNumber(formatted).then((isValid) => {
                          if (!isValid) {
                            setError('numero_socio', {
                              type: 'manual',
                              message: t('memberForm.errors.numeroSocioDuplicate'),
                            })
                          }
                        })
                      }
                      field.onBlur()
                    }}
                    InputProps={{
                      placeholder: isFamily ? t('memberForm.placeholders.numeroSocioFamily') : t('memberForm.placeholders.numeroSocioIndividual'),
                    }}
                  />
                )}
              />
            </Grid>

            {/* ⭐ Campo de Fecha de Alta Histórica (opcional) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="fecha_alta"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={t('memberForm.fields.fechaAlta')}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mode === 'edit'}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fecha_alta,
                        helperText: errors.fecha_alta?.message || t('memberForm.helpers.fechaAltaOptional'),
                      },
                    }}
                    maxDate={new Date()}
                  />
                )}
              />
            </Grid>

            {/* Mensaje informativo para fechas históricas */}
            {fechaAlta && isHistoricalDate(fechaAlta) && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {t('memberForm.alerts.historicalDate.title')}
                  </Typography>
                  <Typography variant="body2">
                    {t('memberForm.alerts.historicalDate.description', { years: getYearRange(fechaAlta) })}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Datos Personales del Socio Principal */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {isFamily ? t('memberForm.sections.datosEsposo') : t('memberForm.sections.datosPersonales')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.nombre')}
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message || (disabledFields.includes('nombre') ? t('memberForm.helpers.fieldDisabled') : '')}
                    required
                    disabled={disabledFields.includes('nombre')}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="apellidos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.apellidos')}
                    error={!!errors.apellidos}
                    helperText={errors.apellidos?.message || (disabledFields.includes('apellidos') ? t('memberForm.helpers.fieldDisabled') : '')}
                    required
                    disabled={disabledFields.includes('apellidos')}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="fecha_nacimiento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={t('memberForm.fields.fechaNacimiento')}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabledFields.includes('fecha_nacimiento')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fecha_nacimiento,
                        helperText: errors.fecha_nacimiento?.message || (disabledFields.includes('fecha_nacimiento') ? t('memberForm.helpers.fieldDisabled') : ''),
                      },
                    }}
                    maxDate={new Date()}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="tipo_documento"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required>
                    <InputLabel id="tipo-documento-label">{t('memberForm.fields.tipoDocumento')}</InputLabel>
                    <Select {...field} labelId="tipo-documento-label" label={t('memberForm.fields.tipoDocumento')}>
                      <MenuItem value={DocumentType.DNI_NIE}>{t('memberForm.documentTypes.dniNie')}</MenuItem>
                      <MenuItem value={DocumentType.PASSPORT_SENEGAL}>{t('memberForm.documentTypes.passportSenegal')}</MenuItem>
                      <MenuItem value={DocumentType.OTHER}>{t('memberForm.documentTypes.other')}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="documento_identidad"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.dniNie')}
                    error={
                      !!errors.documento_identidad ||
                      (documentValidation ? !documentValidation.isValid : false)
                    }
                    helperText={
                      errors.documento_identidad?.message ||
                      (documentValidation && !documentValidation.isValid && documentValidation.errorMessage) ||
                      (isValidatingDocument && t('memberForm.helpers.validating')) ||
                      (watch('tipo_documento') === DocumentType.DNI_NIE && t('memberForm.helpers.documentHelperDniNie')) ||
                      (watch('tipo_documento') === DocumentType.PASSPORT_SENEGAL && t('memberForm.helpers.documentHelperPassportSenegal')) ||
                      (watch('tipo_documento') === DocumentType.OTHER && t('memberForm.helpers.documentHelperOther'))
                    }
                    required
                    onChange={(e) => {
                      clearErrors('documento_identidad')
                      const normalized = normalizeDocument(e.target.value)
                      field.onChange(normalized)
                    }}
                    onBlur={() => {
                      field.onBlur()
                      // Only validate if not type OTHER
                      const tipoDoc = watch('tipo_documento')
                      if (tipoDoc !== DocumentType.OTHER && field.value) {
                        void validateDocument(field.value)
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="correo_electronico"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.correoElectronico')}
                    type="email"
                    error={!!errors.correo_electronico}
                    helperText={errors.correo_electronico?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TelephoneInput telefonos={telefonos} onChange={setTelefonos} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="profesion"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label={t('memberForm.fields.profesion')} />}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                {t('memberForm.sections.direccion')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="calle_numero_piso"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.calleNumeroPiso')}
                    error={!!errors.calle_numero_piso}
                    helperText={errors.calle_numero_piso?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="codigo_postal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.codigoPostal')}
                    error={!!errors.codigo_postal}
                    helperText={errors.codigo_postal?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="poblacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.poblacion')}
                    error={!!errors.poblacion}
                    helperText={errors.poblacion?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="provincia"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.provincia')}
                    error={!!errors.provincia}
                    helperText={errors.provincia?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="pais"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('memberForm.fields.pais')}
                    error={!!errors.pais}
                    helperText={errors.pais?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="nacionalidad"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label={t('memberForm.fields.nacionalidad')} disabled={disabledFields.includes('nacionalidad')} />}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} label={t('memberForm.fields.observaciones')} />
                )}
              />
            </Grid>

            {/* Sección de Familia (solo si tipo_membresia es FAMILY) */}
            {isFamily && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('memberForm.sections.datosFamilia')}
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {t('memberForm.helpers.familyDataOptional')}
                  </Alert>
                </Grid>

                {/* Datos de la Esposa */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {t('memberForm.sections.datosEsposa')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposa_nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('memberForm.fields.esposa.nombre')}
                        error={!!errors.esposa_nombre}
                        helperText={errors.esposa_nombre?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposa_apellidos"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('memberForm.fields.esposa.apellidos')}
                        error={!!errors.esposa_apellidos}
                        helperText={errors.esposa_apellidos?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposa_fecha_nacimiento"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label={t('memberForm.fields.fechaNacimiento')}
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                        maxDate={new Date()}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposa_tipo_documento"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="esposa-tipo-documento-label">{t('memberForm.fields.esposa.tipoDocumento')}</InputLabel>
                        <Select {...field} labelId="esposa-tipo-documento-label" label={t('memberForm.fields.esposa.tipoDocumento')}>
                          <MenuItem value={DocumentType.DNI_NIE}>{t('memberForm.documentTypes.dniNie')}</MenuItem>
                          <MenuItem value={DocumentType.PASSPORT_SENEGAL}>{t('memberForm.documentTypes.passportSenegal')}</MenuItem>
                          <MenuItem value={DocumentType.OTHER}>{t('memberForm.documentTypes.other')}</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposa_documento_identidad"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('memberForm.fields.esposa.dniNie')}
                        error={
                          !!errors.esposa_documento_identidad ||
                          (esposaDocValidation ? !esposaDocValidation.isValid : false)
                        }
                        helperText={
                          errors.esposa_documento_identidad?.message ||
                          (esposaDocValidation && !esposaDocValidation.isValid && esposaDocValidation.errorMessage) ||
                          (isValidatingEsposaDoc && t('memberForm.helpers.validating')) ||
                          (watch('esposa_tipo_documento') === DocumentType.DNI_NIE && t('memberForm.helpers.documentHelperDniNie')) ||
                          (watch('esposa_tipo_documento') === DocumentType.PASSPORT_SENEGAL && t('memberForm.helpers.documentHelperPassportSenegal')) ||
                          (watch('esposa_tipo_documento') === DocumentType.OTHER && t('memberForm.helpers.documentHelperOther'))
                        }
                        onChange={(e) => {
                          clearErrors('esposa_documento_identidad')
                          const normalized = normalizeDocument(e.target.value)
                          field.onChange(normalized)
                        }}
                        onBlur={() => {
                          field.onBlur()
                          // Only validate if not type OTHER
                          const tipoDoc = watch('esposa_tipo_documento')
                          if (tipoDoc !== DocumentType.OTHER && field.value) {
                            void validateEsposaDocument(field.value)
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposa_correo_electronico"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label={t('memberForm.fields.esposa.email')} type="email" />
                    )}
                  />
                </Grid>

                {/* Lista de Familiares */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {t('memberForm.sections.miembrosAdicionales')}
                  </Typography>
                  <FamilyMembersList
                    members={familyMembers}
                    onAdd={addFamilyMember}
                    onEdit={editFamilyMember}
                    onRemove={removeFamilyMember}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={onCancel} size="large">
              {t('memberForm.buttons.cancel')}
            </Button>
            <Button type="submit" variant="contained" size="large">
              {mode === 'edit' ? t('memberForm.buttons.saveChanges') : t('memberForm.buttons.continue')}
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Paper>
  )
}
