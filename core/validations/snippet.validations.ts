//@ts-ignore
import * as yup from 'yup';

export const createSnippetFormSchema = yup.object({
  title: yup.string().required().min(5).max(100).label('Title'),
  description: yup.string().required().min(10).max(500).label('Description'),
  code: yup.string().required().min(10).max(10000).label('Code'),
  language: yup.string().required().label('Language'),
  tags: yup.array().of(yup.string()).max(5).label('Tags').optional(),
});

export const editSnippetFormSchema = createSnippetFormSchema;