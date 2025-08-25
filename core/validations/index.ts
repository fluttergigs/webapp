import { loginFormSchema, registerFormSchema } from '~/core/validations/auth.validations';
import { postJobFormSchema } from '~/core/validations/job.validations';
import {
  addEducationFormSchema,
  addExperienceFormSchema,
  updateEducationFormSchema,
  updateExperienceFormSchema,
} from '~/core/validations/profile.validations';
import { createSnippetFormSchema, editSnippetFormSchema } from '~/core/validations/snippet.validations';

export {
  loginFormSchema,
  registerFormSchema,
  postJobFormSchema,
  addEducationFormSchema,
  addExperienceFormSchema,
  updateExperienceFormSchema,
  updateEducationFormSchema,
  createSnippetFormSchema,
  editSnippetFormSchema,
};
