import * as yup from 'yup'
import i18n from '@/lib/i18n'

// Schema para solicitar reset de contraseña
export const requestPasswordResetSchema = yup.object({
  email: yup
    .string()
    .required(() => i18n.t('auth:forgotPassword.validation.emailRequired'))
    .email(() => i18n.t('auth:forgotPassword.validation.emailInvalid')),
})

export type RequestPasswordResetFormData = yup.InferType<typeof requestPasswordResetSchema>

// Schema para resetear contraseña con token
export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required(() => i18n.t('auth:resetPassword.validation.passwordRequired'))
    .min(6, () => i18n.t('auth:resetPassword.validation.passwordMin'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      () => i18n.t('auth:resetPassword.validation.passwordFormat')
    ),
  confirmPassword: yup
    .string()
    .required(() => i18n.t('auth:resetPassword.validation.confirmPasswordRequired'))
    .oneOf([yup.ref('newPassword')], () => i18n.t('auth:resetPassword.validation.passwordsMismatch')),
})

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>
