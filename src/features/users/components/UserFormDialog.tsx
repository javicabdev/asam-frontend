import React, { useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  FormHelperText,
} from '@mui/material'
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from '@apollo/client'
import { CREATE_USER, UPDATE_USER, LIST_USERS } from '../api/userQueries'
import { MemberAutocomplete } from '@/features/users'
import type { User, UserRole, Member } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'

// Alineación de tipos
interface UserFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  isActive: boolean
  member: Member | null | undefined
}

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  user?: User | null
  onSuccess?: () => void
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const { t } = useTranslation('users')
  const isEditMode = !!user
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation schema
  const validationSchema = useMemo(() => {
    const baseSchema = {
      username: yup
        .string()
        .required(t('form.validation.usernameRequired'))
        .min(3, t('form.validation.usernameMin', { min: 3 }))
        .matches(/^[a-zA-Z0-9_]+$/, t('form.validation.usernamePattern')),
      email: yup
        .string()
        .required(t('form.validation.emailRequired'))
        .email(t('form.validation.emailInvalid')),
      role: yup
        .mixed<UserRole>()
        .oneOf(['admin', 'user'] as const)
        .required(t('form.validation.roleRequired')),
      isActive: yup.boolean().required(),
      // Campo member - usa lazy para evitar conflictos de tipos
      member: yup.lazy((value) => 
        value === null || value === undefined 
          ? yup.mixed().nullable().optional()
          : yup.object().nullable().optional()
      ),
    }

    if (isEditMode) {
      return yup.object().shape({
        ...baseSchema,
        password: yup.string(),
        confirmPassword: yup.string(),
      })
    }

    return yup.object().shape({
      ...baseSchema,
      password: yup
        .string()
        .required(t('form.validation.passwordRequired'))
        .min(8, t('form.validation.passwordMin', { min: 8 })),
      confirmPassword: yup
        .string()
        .required(t('form.validation.confirmPasswordRequired'))
        .oneOf([yup.ref('password')], t('form.validation.passwordsNotMatch')),
    })
  }, [isEditMode, t])

  // useForm con cast de tipos para el resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UserFormData>({
     
    resolver: yupResolver(validationSchema) as never,  // Cast temporal para resolver conflicto de tipos
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user' as UserRole,
      isActive: true,
      member: null,
    },
  })

  const watchRole = watch('role')

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
        role: user.role,
        isActive: user.isActive,
        member: user.member || null,
      })
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' as UserRole,
        isActive: true,
        member: null,
      })
    }
  }, [user, reset])

  // Mutations
  const [createUser, { loading: createLoading, error: createError }] = useMutation(
    CREATE_USER,
    {
      refetchQueries: [{ query: LIST_USERS }],
      onCompleted: () => {
        onSuccess?.()
        handleClose()
      },
    }
  )

  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_USER,
    {
      refetchQueries: [{ query: LIST_USERS }],
      onCompleted: () => {
        onSuccess?.()
        handleClose()
      },
    }
  )

  const loading = createLoading || updateLoading
  const error = createError || updateError

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: UserFormData) => {
    if (isEditMode) {
      // Update user
      void updateUser({
        variables: {
          input: {
            id: user.id,
            username: data.username,
            email: data.email,
            ...(data.password && { password: data.password }),
            role: data.role,
            isActive: data.isActive,
            memberId: data.member?.miembro_id || null,
          },
        },
      })
    } else {
      // Create user
      void createUser({
        variables: {
          input: {
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role,
            memberId: data.member?.miembro_id || null,
          },
        },
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit),
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isEditMode ? t('form.edit.title') : t('form.create.title')}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Username */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('form.fields.username')}
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={loading}
                required
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('form.fields.email')}
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
                required
              />
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('form.fields.password')}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={
                  errors.password?.message ||
                  (isEditMode && t('form.passwordHint'))
                }
                disabled={loading}
                required={!isEditMode}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('form.fields.confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={loading}
                required={!isEditMode}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Role */}
          <FormControl component="fieldset" error={!!errors.role}>
            <FormLabel component="legend">{t('form.fields.role')}</FormLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="admin"
                    control={<Radio />}
                    label={t('table.roles.admin')}
                    disabled={loading}
                  />
                  <FormControlLabel
                    value="user"
                    control={<Radio />}
                    label={t('table.roles.user')}
                    disabled={loading}
                  />
                </RadioGroup>
              )}
            />
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>

          {/* Member Association (only for user role) */}
          {watchRole === 'user' && (
            <Controller
              name="member"
              control={control}
              render={({ field }) => (
                <MemberAutocomplete
                  value={field.value || null}
                  onChange={field.onChange}
                  error={!!errors.member}
                  helperText={errors.member?.message}
                  disabled={loading}
                  label={t('form.fields.associatedMember')}
                />
              )}
            />
          )}

          {/* Active Status */}
          <FormControl>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  }
                  label={t('form.fields.isActive')}
                />
              )}
            />
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('form.cancel', { ns: 'common' })}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || isSubmitting}
        >
          {isEditMode ? t('form.edit.submit') : t('form.create.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
