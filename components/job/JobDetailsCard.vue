<script setup>
  import ItemData from '~/components/job/ItemData.vue';
  import WorkingPermits from '~/components/job/WorkingPermits.vue';
  import useJobActions from '~/composables/useJobActions';
  import {
    userFacingRemoteOptions,
    userFacingSeniorityLevel,
    userFacingWorkType,
  } from '~/features/jobs/transformers';

  const props = defineProps({
    job: {
      type: Object,
      required: true,
    },
  });

  const { data, error } = await useCountries();
  const { jobWorkingPermits } = useJobActions();
</script>

<template>
  <!--  set dynamic padding from property-->

  <div class="p-6 border rounded-xl space-y-5 flex flex-col">
    <h3 class="text-xl font-semibold">About the job</h3>

    <ItemData v-if="props.job.applyBefore" label="Apply Before">
      <template #content>
        <p
          v-date-format="{ date: props.job.applyBefore, format: 'MMM YYYY, D' }"
          class="text-md font-medium"
        ></p>
      </template>
    </ItemData>
    <ItemData label="Posted on">
      <template #content>
        <p
          v-date-format="{ date: props.job.createdAt, format: 'MMM YYYY, D' }"
          class="text-md font-medium"
        ></p>
      </template>
    </ItemData>
    <ItemData :value="userFacingWorkType(props.job?.workType)" label="Job type" />
    <ItemData
      :value="userFacingSeniorityLevel(props.job?.seniorityLevel)"
      label="Experience Level"
    />
    <ItemData :value="userFacingRemoteOptions(props.job?.remoteOptions)" label="Remote options" />
    <ItemData label="Salary range (Monthly)">
      <template #content>
        <div class="inline-flex items-center space-x-2 font-medium text-md">
          <UIcon name="i-heroicons-currency-dollar" />
          <span v-if="props.job.salaryFrom"
            >{{ props.job?.salaryFrom }} to {{ props.job?.salaryTo ?? '-' }}</span
          >
          <span v-else>N/A</span>
        </div>
      </template>
    </ItemData>

    <UDivider class="my-2" />

    <ItemData label="Location requirements">
      <template #content>
        <WorkingPermits :countries="jobWorkingPermits(data?.countries ?? [], props.job)" />
      </template>
    </ItemData>
  </div>
</template>

<style scoped></style>
