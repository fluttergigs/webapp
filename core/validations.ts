import * as yup from 'yup';

export const registerFormSchema = yup.object({
    email: yup.string().required().email().label('email'),
    firstName: yup.string().required().min(2),
    lastName: yup.string().required().min(2),
    password: yup.string().required().min(5).label('password'),
});

export const loginFormSchema = yup.object({
    email: yup.string().required().email().label('password'),
    password: yup.string().required().min(5).label('password'),
});

export const postJobFormSchema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(5),
});