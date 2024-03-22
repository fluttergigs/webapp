//@ts-ignore
import * as yup from "yup";

export const companyCreationFormSchema = yup.object({
    email: yup.string().required().email().label('email'),
    name: yup.string().required().min(2).label('name'),
    website: yup.string().required().url().label('website'),
    logo: yup.string().required().url().min(2).label('logo'),
    description: yup.string().required().min(10).max(200).label('description'),
});

export const companyUpdateFormSchema = companyCreationFormSchema