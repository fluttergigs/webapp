//@ts-ignore
import * as yup from "yup";

export const postJobFormSchema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(5),
});

export const jobDescriptionSchema = yup.object({
    description: yup.string().required().min(10)
});