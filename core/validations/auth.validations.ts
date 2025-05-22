//@ts-ignore
import * as yup from 'yup';

export const registerFormSchema = yup.object({
  email: yup.string().required().email().label('email'),
  firstName: yup.string().nullable().optional(),
  lastName: yup.string().nullable().optional(),
  password: yup.string().required().min(5).label('password'),
});

export const loginFormSchema = yup.object({
  email: yup.string().required().email().label('password'),
  password: yup.string().required().min(5).label('password'),
});

export const passwordForgetSchema = yup.object({
  email: yup.string().required().email().label('email'),
});

export const passwordResetSchema = yup.object({
  password: yup.string().required().min(8).label('password'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  code: yup.string().required().label('code'),
});

export const updateUserFormSchema = yup.object({
  email: yup.string().required().email().label('email'),
  username: yup.string().required().label('username'),
  firstName: yup.string().required().min(2).label('First name'),
  lastName: yup.string().required().min(2).label('Last name'),
  bio: yup.string().min(15).max(200).notRequired().label('Bio'),
});

export const changePasswordFormSchema = yup.object({
  password: yup.string().required().min(8).label('password'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});
