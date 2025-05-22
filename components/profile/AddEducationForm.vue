<script lang="ts" setup>
  import { useForm } from 'vee-validate';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import { useProfile } from '~/composables/useProfile';
  import { addEducationFormSchema } from '~/core/validations';

  const { newEducationFormData } = useProfile();

  // Create a form context that all fields can access
  const { errors, values, validate } = useForm({
    initialValues: newEducationFormData.value.data,
    validationSchema: addEducationFormSchema,
  });

  // Function to validate specific fields
  const validateField = async (fieldName: any) => {
    await validate(fieldName);
  };
</script>

<template>
  <div class="flex flex-col gap-4 px-2 py-4">
    <CustomInput
      v-model="newEducationFormData.data.degree"
      label="Degree *"
      name="degree"
      placeholder="E.g., Bachelor of Science"
    />

    <CustomInput
      v-model="newEducationFormData.data.field"
      label="Field of Study *"
      name="field"
      placeholder="E.g., Computer Science"
    />

    <CustomInput
      v-model="newEducationFormData.data.school"
      label="School/Institution *"
      name="school"
      placeholder="School name"
    />

    <LabelledInput
      :value="newEducationFormData.data.isActive"
      label="Current Education"
      name="isActive"
    >
      <UCheckbox
        v-model="newEducationFormData.data.isActive"
        label="I am currently studying here"
        name="isActive"
      />
    </LabelledInput>

    <div class="flex gap-4 w-full">
      <CustomInput
        v-model="newEducationFormData.data.startYear"
        label="Start Year *"
        name="startYear"
        placeholder="E.g., 2018"
      />

      <CustomInput
        v-model="newEducationFormData.data.endYear"
        :disabled="newEducationFormData.data.isActive"
        :label="`End Year ${newEducationFormData.data.isActive ? '' : '*'}`"
        name="endYear"
        placeholder="E.g., 2022"
      />
    </div>

    <CustomInput
      v-model="newEducationFormData.data.description"
      :is-text-area="true"
      label="Description *"
      name="description"
      placeholder="Describe your education, achievements, courses, etc."
    />
  </div>
</template>
