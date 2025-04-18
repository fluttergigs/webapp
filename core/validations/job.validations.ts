//@ts-ignore
import * as yup from 'yup';

export const postJobFormSchema = yup.object({
  title: yup.string().required().min(8).max(30).label('Title'),
  applyBefore: yup.date().required().label('Apply before'),
  howToApply: yup.string().required().url().label('How to apply'),
  description: yup.string().required().min(30).max(5000).label('description'),
  salaryFrom: yup.number().required().min(1).label('Salary from'),
  salaryTo: yup.number().required().min(1).label('Salary to'),
});

export const editJobFormSchema = postJobFormSchema;

export const jobDescriptionSchema = yup.object({
  description: yup.string().required().min(30),
});