//@ts-ignore
import * as yup from 'yup';

export const companyCreationFormSchema = yup.object({
  email: yup.string().required().email().label('email'),
  name: yup.string().required().min(2).label('name'),
  website: yup.string().optional().url().label('website'),
  logo: yup.string().url().label('logo'),
  description: yup.string().required().min(30).max(2000).label('description'),
});

export const companyUpdateFormSchema = companyCreationFormSchema;

export const companyDescriptionSchema = yup.object({
  description: yup.string().required().min(30),
});
