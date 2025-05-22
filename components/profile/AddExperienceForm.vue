<script lang="ts" setup>
  import { format } from 'date-fns';
  import { DatePicker } from 'v-calendar';
  import { useForm } from 'vee-validate';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import { useProfile } from '~/composables/useProfile';
  import { workTypeOptions } from '~/core/constants';
  import { addExperienceFormSchema } from '~/core/validations';

  //TODO - make errors reactive

  const { newExperienceFormData } = useProfile();

  // Create a form context that all fields can access
  const { errors, values, validate } = useForm({
    initialValues: newExperienceFormData.value.data,
    validationSchema: addExperienceFormSchema,
  });

  // Function to validate specific fields
  const validateField = async (fieldName: any) => {
    await validate(fieldName);
  };
</script>

<template>
  <div class="flex flex-col gap-4 px-2 py-4">
    <CustomInput
      v-model="newExperienceFormData.data.title"
      label="Job Title *"
      name="title"
      placeholder="Title"
    />

    <LabelledInput label="Job type *">
      <USelectMenu
        v-model="newExperienceFormData.data.type"
        :items="workTypeOptions"
        clear-search-on-close
        label-key="label"
        placeholder="Select the job type"
        searchable
        size="lg"
        value-key="id"
      />
    </LabelledInput>

    <CustomInput
      v-model="newExperienceFormData.data.company"
      label="Company *"
      name="company"
      placeholder="Company name"
    />

    <LabelledInput
      :value="newExperienceFormData.data.isActive"
      label="Current occuption *"
      name="isActive"
    >
      <UCheckbox
        v-model="newExperienceFormData.data.isActive"
        label="Is this your current job?"
        name="isCurrent"
      />
    </LabelledInput>

    <LabelledInput
      :value="newExperienceFormData.data.startDate"
      label="Start Date *"
      name="startDate"
      @validate="validateField"
    >
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          :label="format(new Date(newExperienceFormData.data.startDate), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
          variant="outline"
        />

        <template #content>
          <DatePicker
            v-model="newExperienceFormData.data.startDate"
            :is-range="false"
            :is-required="true"
            color="primary"
          />
        </template>
      </UPopover>
    </LabelledInput>

    <LabelledInput
      :dependencies="['startDate', 'isActive']"
      :label="`End Date ${newExperienceFormData.data.isActive ? '' : '*'}`"
      :validation-errors="errors"
      :value="newExperienceFormData.data.endDate"
      name="endDate"
      @validate="validateField"
    >
      <!--      <template #label>
      
              <p class="text-sm font-medium">
                End Date {{newExperienceFormData.data.isActive ? '' : '*'}}
              </p>
            </template>-->
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          :disabled="newExperienceFormData.data.isActive"
          :label="format(newExperienceFormData.data.endDate ?? new Date(), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
          variant="outline"
        />

        <template #content>
          <DatePicker
            v-model="newExperienceFormData.data.endDate"
            :is-range="false"
            :is-required="true"
            :max-date="new Date()"
            color="primary"
          />
        </template>
      </UPopover>
    </LabelledInput>

    <CustomInput
      v-model="newExperienceFormData.data.description"
      :is-text-area="true"
      label="Description *"
      name="description"
      placeholder="Description"
    />
  </div>
</template>

<style scoped></style>
