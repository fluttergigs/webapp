<script lang="ts" setup>
  import { format } from 'date-fns';
  import { DatePicker } from 'v-calendar';
  import { useForm } from 'vee-validate';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import { useProfile } from '~/composables/useProfile';
  import { workTypeOptions } from '~/core/constants';
  import { updateExperienceFormSchema } from '~/core/validations';

  //TODO - make errors reactive

  const { updatedExperienceFormData } = useProfile();

  // Create a form context that all fields can access
  const { errors, values, validate } = useForm({
    initialValues: updatedExperienceFormData.value?.data ?? {},
    validationSchema: updateExperienceFormSchema,
  });

  // Function to validate specific fields
  const validateField = async (fieldName: any) => {
    await validate(fieldName);
  };
</script>

<template>
  <div class="flex flex-col gap-4 px-2 py-4">
    <CustomInput
      v-model="updatedExperienceFormData!.data.title"
      label="Job Title *"
      name="title"
      placeholder="Title"
    />

    <LabelledInput label="Job type *">
      <USelectMenu
        v-model="updatedExperienceFormData!.data.type"
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
      v-model="updatedExperienceFormData!.data.company"
      label="Company *"
      name="company"
      placeholder="Company name"
    />

    <LabelledInput
      :value="updatedExperienceFormData!.data.isActive"
      label="Current occuption *"
      name="isActive"
    >
      <UCheckbox
        v-model="updatedExperienceFormData!.data.isActive"
        label="Is this your current job?"
        name="isCurrent"
      />
    </LabelledInput>

    <LabelledInput
      :value="updatedExperienceFormData!.data.startDate"
      label="Start Date *"
      name="startDate"
      @validate="validateField"
    >
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          :label="format(new Date(updatedExperienceFormData!.data.startDate), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
          variant="outline"
        />

        <template #content>
          <DatePicker
            v-model="updatedExperienceFormData!.data.startDate"
            :is-range="false"
            :is-required="true"
            color="primary"
          />
        </template>
      </UPopover>
    </LabelledInput>

    <LabelledInput
      :dependencies="['startDate', 'isActive']"
      :label="`End Date ${updatedExperienceFormData!.data.isActive ? '' : '*'}`"
      :validation-errors="errors"
      :value="updatedExperienceFormData!.data.endDate"
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
          :disabled="updatedExperienceFormData!.data.isActive"
          :label="format(updatedExperienceFormData!.data.endDate ?? new Date(), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
          variant="outline"
        />

        <template #content>
          <DatePicker
            v-model="updatedExperienceFormData!.data.endDate"
            :is-range="false"
            :is-required="true"
            :max-date="new Date()"
            color="primary"
          />
        </template>
      </UPopover>
    </LabelledInput>

    <CustomInput
      v-model="updatedExperienceFormData!.data.description"
      :is-text-area="true"
      label="Description *"
      name="description"
      placeholder="Description"
    />
  </div>
</template>

<style scoped></style>
