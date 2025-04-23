import * as yup from 'yup';

export const addExperienceFormSchema = yup.object({
  title: yup.string().required().min(8).max(30).label('Title'),
  company: yup.string().required().min(3).max(50).label('Company'),
  startDate: yup.date().required().label('Start date'),
  endDate: yup.date().optional().label('End date'),
  description: yup.string().required().min(30).max(5000).label('Description'),
  isActive: yup.boolean().required().label('Still working there'),
});

export const updateExperienceFormSchema = addExperienceFormSchema;

export const addEducationFormSchema = yup.object({
  degree: yup.string().required().min(3).max(50).label('Degree'),
  field: yup.string().required().min(3).max(50).label('Field'),
  title: yup.string().required().min(3).max(50).label('Title'),
  school: yup.string().required().min(3).max(50).label('School'),
  startYear: yup.date().required().label('Start year'),
  endYear: yup.date().optional().label('End year'),
  description: yup.string().required().min(30).max(5000).label('Description'),
  hasGraduated: yup.boolean().required().label('Has graduated'),
});

export const updateEducationFormSchema = addEducationFormSchema;
