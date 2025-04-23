<script lang="ts" setup>
  import { format } from 'date-fns';
  import { DatePicker } from 'v-calendar';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import { useProfile } from '~/composables/useProfile';
  import { workTypeOptions } from '~/core/constants';

  const { newExperienceFormData } = useProfile();
</script>

<template>
  <div class="flex flex-col gap-2 px-2 py-4">
    <CustomInput
      v-model="newExperienceFormData.data.title"
      label="Title *"
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

    <CustomInput
      v-model="newExperienceFormData.data.description"
      :is-text-area="true"
      label="Description *"
      name="description"
      placeholder="Description"
    />

    <UCheckbox
      v-model="newExperienceFormData.data.isActive"
      label="Is this your current job?"
      name="isCurrent"
    />

    <LabelledInput label="Start Date">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          :label="format(new Date(newExperienceFormData.data.startDate), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
        />

        <template #content="{ close }">
          <DatePicker
            v-model="newExperienceFormData.data.startDate"
            :is-range="false"
            :is-required="true"
            :min-date="new Date()"
            color="primary"
            @close="close"
            @update:model-value="close"
          />
        </template>
      </UPopover>
    </LabelledInput>

    <LabelledInput label="End Date">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          :label="format(new Date(newExperienceFormData.data.startDate), 'd MMMM, yyy')"
          class="w-full"
          color="neutral"
          icon="i-heroicons-calendar-days-20-solid"
          size="xl"
        />

        <template #content="{ close }">
          <DatePicker
            v-model="newExperienceFormData.data.startDate"
            :is-range="false"
            :is-required="true"
            :min-date="new Date()"
            color="primary"
            @close="close"
            @update:model-value="close"
          />
        </template>
      </UPopover>
    </LabelledInput>
  </div>
</template>

<style scoped></style>
