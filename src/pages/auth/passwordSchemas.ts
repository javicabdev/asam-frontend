import * as yup from 'yup';

// Schema para solicitar reset de contraseña
export const requestPasswordResetSchema = yup.object({
  email: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
});

export type RequestPasswordResetFormData = yup.InferType<typeof requestPasswordResetSchema>;

// Schema para resetear contraseña con token
export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
  confirmPassword: yup
    .string()
    .required('Debes confirmar la contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});

export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
