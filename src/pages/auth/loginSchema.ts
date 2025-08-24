import * as yup from 'yup';
import { TFunction } from 'i18next';

// Create the schema with translated messages
export const createLoginSchema = (t: TFunction) => yup.object({
  username: yup
    .string()
    .required(t('auth:login.validation.usernameRequired'))
    .min(3, t('auth:login.validation.usernameMin', { min: 3 })),
  password: yup
    .string()
    .required(t('auth:login.validation.passwordRequired'))
    .min(6, t('auth:login.validation.passwordMin', { min: 6 })),
});

// Static schema for type inference (without translations)
export const loginSchema = yup.object({
  username: yup.string().required().min(3),
  password: yup.string().required().min(6),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
