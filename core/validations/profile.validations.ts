import * as yup from 'yup';

export const addExperienceFormSchema = yup.object({
  title: yup.string().required().min(8).max(30).label('Title'),
  company: yup.string().required().min(3).max(30).label('Company'),
  startDate: yup.date().required().label('Start date'),
  isActive: yup.boolean().optional().label('Still working there'),
  endDate: yup
    .date()
    .when('isActive', (isActive, schema) => {
      if (!isActive) {
        return schema
          .required('End date is required')
          .min(yup.ref('startDate'), 'End date must be after start date');
      }
      return schema
        .min(yup.ref('startDate'), 'End date must be after start date')
        .nullable()
        .optional();
    })
    .label('End date'),

  description: yup.string().required().min(30).max(5000).label('Description'),
});

export const updateExperienceFormSchema = addExperienceFormSchema;

export const addEducationFormSchema = yup.object({
  degree: yup.string().required().min(3).max(50).label('Degree'),
  field: yup.string().required().min(3).max(50).label('Field'),
  title: yup.string().required().min(3).max(50).label('Title'),
  school: yup.string().required().min(3).max(50).label('School'),
  hasGraduated: yup.boolean().optional().label('Has graduated'),
  startYear: yup.number().required().label('Start year'),
  endYear: yup
    .number()
    .when('hasGraduated', (hasGraduated, schema) => {
      if (!hasGraduated) {
        return schema
          .required('End year is required')
          .min(yup.ref('startYear'), 'End year must be after start year');
      }
      return schema
        .min(yup.ref('startYear'), 'End year must be after start year')
        .nullable()
        .optional();
    })
    .label('End year'),

  description: yup.string().required().min(30).max(5000).label('Description'),
});

export const updateEducationFormSchema = addEducationFormSchema;
