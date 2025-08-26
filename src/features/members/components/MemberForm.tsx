import React from 'react'
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
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { MembershipType } from '../types'
import { FamilyMembersList } from './FamilyMembersList'
import {
  useFamilyForm,
  useNextMemberNumber,
  useMemberNumberValidation,
  useDocumentValidation,
} from '../hooks'
import { formatMemberNumber } from '../utils'

interface MemberFormProps {
  onCancel?: () => void
  onSubmit?: (data: any) => void
}

const validationSchema = Yup.object({
  numero_socio: Yup.string()
    .required('El número de socio es obligatorio')
    .matches(/^[AB]\d{5}$/, 'El formato debe ser A00000 para familias o B00000 para individuales'),
  tipo_membresia: Yup.string().required('El tipo de membresía es obligatorio'),
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellidos: Yup.string().required('Los apellidos son obligatorios'),
  calle_numero_piso: Yup.string().required('La dirección es obligatoria'),
  codigo_postal: Yup.string().required('El código postal es obligatorio'),
  poblacion: Yup.string().required('La población es obligatoria'),
  provincia: Yup.string().required('La provincia es obligatoria'),
  pais: Yup.string().required('El país es obligatorio'),
  documento_identidad: Yup.string().required('El documento de identidad es obligatorio'),
  correo_electronico: Yup.string().email('Email inválido').required('El email es obligatorio'),
  // Campos opcionales
  fecha_nacimiento: Yup.date().nullable(),
  profesion: Yup.string().nullable(),
  nacionalidad: Yup.string().nullable(),
  observaciones: Yup.string().nullable(),
})

const familyValidationSchema = validationSchema.shape({
  esposo_nombre: Yup.string().when('tipo_membresia', {
    is: MembershipType.FAMILY,
    then: (schema) => schema.required('El nombre del esposo es obligatorio'),
    otherwise: (schema) => schema.nullable(),
  }),
  esposo_apellidos: Yup.string().when('tipo_membresia', {
    is: MembershipType.FAMILY,
    then: (schema) => schema.required('Los apellidos del esposo son obligatorios'),
    otherwise: (schema) => schema.nullable(),
  }),
  esposo_fecha_nacimiento: Yup.date().nullable(),
  esposo_documento_identidad: Yup.string().nullable(),
  esposo_correo_electronico: Yup.string().email('Email inválido').nullable(),
  esposa_nombre: Yup.string().when('tipo_membresia', {
    is: MembershipType.FAMILY,
    then: (schema) => schema.required('El nombre de la esposa es obligatorio'),
    otherwise: (schema) => schema.nullable(),
  }),
  esposa_apellidos: Yup.string().when('tipo_membresia', {
    is: MembershipType.FAMILY,
    then: (schema) => schema.required('Los apellidos de la esposa son obligatorios'),
    otherwise: (schema) => schema.nullable(),
  }),
  esposa_fecha_nacimiento: Yup.date().nullable(),
  esposa_documento_identidad: Yup.string().nullable(),
  esposa_correo_electronico: Yup.string().email('Email inválido').nullable(),
})

export const MemberForm: React.FC<MemberFormProps> = ({ onCancel, onSubmit }) => {
  const { familyMembers, addFamilyMember, editFamilyMember, removeFamilyMember } = useFamilyForm()
  const [familyMembersError, setFamilyMembersError] = React.useState<string | null>(null)
  const [memberNumberManuallyEdited, setMemberNumberManuallyEdited] = React.useState(false)
  const { isValidating, isDuplicate, validateMemberNumber, clearValidation } =
    useMemberNumberValidation()
  const {
    isValidating: isValidatingDocument,
    validationResult: documentValidation,
    validateDocument,
  } = useDocumentValidation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(familyValidationSchema),
    defaultValues: {
      numero_socio: '', // Will be set by useNextMemberNumber hook
      tipo_membresia: MembershipType.INDIVIDUAL,
      nombre: '',
      apellidos: '',
      calle_numero_piso: '',
      codigo_postal: '',
      poblacion: '',
      provincia: '',
      pais: 'España',
      fecha_nacimiento: null,
      documento_identidad: '',
      correo_electronico: '',
      profesion: '',
      nacionalidad: 'Española',
      observaciones: '',
      // Campos de familia
      esposo_nombre: '',
      esposo_apellidos: '',
      esposo_fecha_nacimiento: null,
      esposo_documento_identidad: '',
      esposo_correo_electronico: '',
      esposa_nombre: '',
      esposa_apellidos: '',
      esposa_fecha_nacimiento: null,
      esposa_documento_identidad: '',
      esposa_correo_electronico: '',
    },
  })

  const tipoMembresia = watch('tipo_membresia')
  const isFamily = tipoMembresia === MembershipType.FAMILY
  const numeroSocio = watch('numero_socio')

  // Use the hook to get the next member number
  const {
    memberNumber,
    loading: loadingMemberNumber,
    error: memberNumberError,
  } = useNextMemberNumber({
    isFamily,
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

  const onSubmitForm = (data: any) => {
    // Validación adicional para familias
    if (isFamily && familyMembers.length === 0) {
      setFamilyMembersError('Debe añadir al menos un familiar')
      return
    }

    // Don't submit if member number is duplicate
    if (isDuplicate === true) {
      setError('numero_socio', {
        type: 'manual',
        message: 'Este número de socio ya existe',
      })
      return
    }

    // Don't submit if document is invalid
    if (documentValidation && !documentValidation.isValid) {
      setError('documento_identidad', {
        type: 'manual',
        message: documentValidation.errorMessage || 'Documento inválido',
      })
      return
    }

    setFamilyMembersError(null)

    const formattedData = {
      ...data,
      // Use normalized document if available
      documento_identidad: documentValidation?.normalizedValue || data.documento_identidad,
      fecha_nacimiento: data.fecha_nacimiento ? format(data.fecha_nacimiento, 'yyyy-MM-dd') : null,
      esposo_fecha_nacimiento: data.esposo_fecha_nacimiento
        ? format(data.esposo_fecha_nacimiento, 'yyyy-MM-dd')
        : null,
      esposa_fecha_nacimiento: data.esposa_fecha_nacimiento
        ? format(data.esposa_fecha_nacimiento, 'yyyy-MM-dd')
        : null,
      familyMembers: isFamily ? familyMembers : [],
    }

    onSubmit?.(formattedData)
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Datos del Nuevo Socio
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete el formulario para registrar un nuevo socio. Los campos marcados con * son
            obligatorios.
          </Typography>

          {/* Tipo de Membresía y Número de Socio */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="tipo_membresia"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.tipo_membresia}>
                    <InputLabel id="tipo-membresia-label">Tipo de Membresía</InputLabel>
                    <Select {...field} labelId="tipo-membresia-label" label="Tipo de Membresía">
                      <MenuItem value={MembershipType.INDIVIDUAL}>Individual</MenuItem>
                      <MenuItem value={MembershipType.FAMILY}>Familiar</MenuItem>
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
                    label="Número de Socio"
                    error={!!errors.numero_socio || isDuplicate === true}
                    helperText={
                      errors.numero_socio?.message ||
                      (isDuplicate && 'Este número de socio ya existe') ||
                      (isValidating && 'Verificando...') ||
                      (memberNumberError
                        ? 'Error al obtener el número. Puede introducirlo manualmente.'
                        : 'Puede escribir solo el número (ej: 2) y se formateará automáticamente')
                    }
                    required
                    disabled={loadingMemberNumber}
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
                        validateMemberNumber(formatted).then((isValid) => {
                          if (!isValid) {
                            setError('numero_socio', {
                              type: 'manual',
                              message: 'Este número de socio ya existe',
                            })
                          }
                        })
                      }
                      field.onBlur()
                    }}
                    InputProps={{
                      placeholder: isFamily ? 'ej: 2 → A00002' : 'ej: 2 → B00002',
                    }}
                  />
                )}
              />
            </Grid>

            {/* Datos Personales del Socio Principal */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Datos Personales {isFamily && '(Socio Principal)'}
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
                    label="Nombre"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    required
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
                    label="Apellidos"
                    error={!!errors.apellidos}
                    helperText={errors.apellidos?.message}
                    required
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
                    label="Fecha de Nacimiento"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fecha_nacimiento,
                        helperText: errors.fecha_nacimiento?.message,
                      },
                    }}
                    maxDate={new Date()}
                  />
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
                    label="DNI/NIE"
                    error={
                      !!errors.documento_identidad ||
                      (documentValidation ? !documentValidation.isValid : false)
                    }
                    helperText={
                      errors.documento_identidad?.message ||
                      (documentValidation &&
                        !documentValidation.isValid &&
                        documentValidation.errorMessage) ||
                      (isValidatingDocument && 'Validando...') ||
                      'Introduzca el DNI o NIE'
                    }
                    required
                    onChange={(e) => {
                      field.onChange(e)
                      // Validate document when user types
                      if (e.target.value.length >= 8) {
                        validateDocument(e.target.value)
                      }
                    }}
                    onBlur={(e) => {
                      field.onBlur()
                      // Validate on blur if not already validated
                      if (e.target.value && !documentValidation) {
                        validateDocument(e.target.value).then((result) => {
                          if (
                            result &&
                            result.normalizedValue &&
                            result.normalizedValue !== e.target.value
                          ) {
                            setValue('documento_identidad', result.normalizedValue)
                          }
                          if (result && !result.isValid) {
                            setError('documento_identidad', {
                              type: 'manual',
                              message: result.errorMessage || 'Documento inválido',
                            })
                          } else {
                            clearErrors('documento_identidad')
                          }
                        })
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
                    label="Correo Electrónico"
                    type="email"
                    error={!!errors.correo_electronico}
                    helperText={errors.correo_electronico?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="profesion"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label="Profesión" />}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Dirección
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
                    label="Calle, Número, Piso"
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
                    label="Código Postal"
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
                    label="Población"
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
                    label="Provincia"
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
                    label="País"
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
                render={({ field }) => <TextField {...field} fullWidth label="Nacionalidad" />}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="observaciones"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} label="Observaciones" />
                )}
              />
            </Grid>

            {/* Sección de Familia (solo si tipo_membresia es FAMILY) */}
            {isFamily && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Datos de la Familia
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Para membresías familiares, debe proporcionar los datos del cónyuge y añadir al
                    menos un familiar adicional.
                  </Alert>
                </Grid>

                {/* Datos del Esposo */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Datos del Esposo
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposo_nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre del Esposo"
                        error={!!errors.esposo_nombre}
                        helperText={errors.esposo_nombre?.message}
                        required={isFamily}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="esposo_apellidos"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Apellidos del Esposo"
                        error={!!errors.esposo_apellidos}
                        helperText={errors.esposo_apellidos?.message}
                        required={isFamily}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposo_fecha_nacimiento"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha de Nacimiento"
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

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposo_documento_identidad"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="DNI/NIE del Esposo" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposo_correo_electronico"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Email del Esposo" type="email" />
                    )}
                  />
                </Grid>

                {/* Datos de la Esposa */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                    Datos de la Esposa
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
                        label="Nombre de la Esposa"
                        error={!!errors.esposa_nombre}
                        helperText={errors.esposa_nombre?.message}
                        required={isFamily}
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
                        label="Apellidos de la Esposa"
                        error={!!errors.esposa_apellidos}
                        helperText={errors.esposa_apellidos?.message}
                        required={isFamily}
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
                        label="Fecha de Nacimiento"
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

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposa_documento_identidad"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="DNI/NIE de la Esposa" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="esposa_correo_electronico"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Email de la Esposa" type="email" />
                    )}
                  />
                </Grid>

                {/* Lista de Familiares */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <FamilyMembersList
                    members={familyMembers}
                    onAdd={addFamilyMember}
                    onEdit={editFamilyMember}
                    onRemove={removeFamilyMember}
                  />
                  {familyMembersError && (
                    <FormHelperText error sx={{ mt: 1 }}>
                      {familyMembersError}
                    </FormHelperText>
                  )}
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={onCancel} size="large">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" size="large">
              Continuar
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>
    </Paper>
  )
}
