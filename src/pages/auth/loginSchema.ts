import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup
    .string()
    .required('El nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
