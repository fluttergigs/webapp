<script lang="ts" setup>
import { useForm } from "vee-validate";
import CustomInput from "~/components/forms/CustomInput.vue";
import LabelledInput from "~/components/forms/LabelledInput.vue";
import { useProfile } from "~/composables/useProfile";
import { logDev } from "~/core/helpers/log";
import { addEducationFormSchema } from "~/core/validations";

const { updatedEducationFormData } = useProfile();

// Create computed ref for safe access to form data
const formData = computed(() => updatedEducationFormData.value?.data ?? {
  degree: '',
  field: '',
  school: '',
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  description: '',
  isActive: false,
});

// Create a form context that all fields can access
const { validate } = useForm({
  initialValues: formData.value,
  validationSchema: addEducationFormSchema,
});

// Function to validate the entire form
const validateForm = async () => {
  const result = await validate();
  return result.valid;
};

onMounted(() => {
  logDev("updatedEducationFormData", updatedEducationFormData.value);
});
</script>

<template>
  <div class="flex flex-col gap-4 px-2 py-4">
    <CustomInput v-model="formData.degree" label="Degree *" name="degree"
      placeholder="E.g., Bachelor of Science" />

    <CustomInput v-model="formData.field" label="Field of Study *" name="field"
      placeholder="E.g., Computer Science" />

    <CustomInput v-model="formData.school" label="School/Institution *" name="school"
      placeholder="School name" />

    <LabelledInput :value="formData.isActive" label="Current Education" name="isActive">
      <UCheckbox v-model="formData.isActive" label="I am currently studying here"
        name="isActive" />
    </LabelledInput>

    <div class="flex gap-4 w-full">
      <CustomInput v-model="formData.startYear" label="Start Year *" name="startYear"
        placeholder="E.g., 2018" />

      <CustomInput v-model="formData.endYear" :disabled="formData.isActive"
        :label="`End Year ${formData.isActive ? '' : '*'}`" name="endYear"
        placeholder="E.g., 2022" type="number" :value="formData.endYear ?? ''" />
    </div>

    <CustomInput v-model="formData.description" :is-text-area="true" label="Description *"
      name="description" placeholder="Describe your education, achievements, courses, etc." />
  </div>
</template>
