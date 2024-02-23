import * as yup from "yup";

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

export const updateUserFormSchema = yup.object({
    email: yup.string().required().email().label('email'),
    username: yup.string().required().label('username'),
    firstName: yup.string().required().min(2).label('First name'),
    lastName: yup.string().required().min(2).label('Last name'),
    bio: yup.string().min(15).max(200).notRequired().label('Bio'),
});


export const changePasswordFormSchema = yup.object({
    password: yup.string().required().min(8).label('password'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
});