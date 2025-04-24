<script lang="ts" setup>
  //@ts-ignore
  import { XCircleIcon } from '@heroicons/vue/24/outline';
  import ArrowBackIcon from '~/components/icons/ArrowBackIcon.vue';
  import ConfirmJobDeleteModal from '~/components/job/ConfirmJobDeleteModal.vue';
  import JobSalaryBox from '~/components/job/JobSalaryBox.vue';
  import SaveJobIconButton from '~/components/job/SaveJobIconButton.vue';
  import WorkingPermits from '~/components/job/WorkingPermits.vue';
  import useJobActions from '~/composables/useJobActions';
  import { AppRoutes } from '~/core/routes';
  import { userFacingCompanySize } from '~/features/companies/transformers';
  import type { JobOffer } from '~/features/jobs/job.types';
  import { RemoteOptions } from '~/features/jobs/job.types';
  import { userFacingRemoteOptions, userFacingWorkType } from '~/features/jobs/transformers';

  const { data, error } = await useCountries();
  const { jobWorkingPermits } = useJobActions();

  const overlay = useOverlay();

  //@ts-ignore
  const props = defineProps({
    job: {
      type: Object as PropType<JobOffer>,
    },
  });

  const isJobSidePanelOpen = ref(false);

  const company = computed(() => ({
    ...props.job.company,
  }));

  const isActionItemsOpen = ref(false);

  const toggleJobActionItems = () => {
    isActionItemsOpen.value = !isActionItemsOpen.value;
  };
  const showConfirmJobDeleteModal = async () => {
    const modal = overlay.create(ConfirmJobDeleteModal, {
      //@ts-ignore
      job: props.job,
    });

    await modal.open();
  };

  const jobActionItems = [
    [
      {
        label: 'Share',
        onClick: () => {
          useJobActions().shareJobOffer(props.job);
        },
      },
    ],
    [
      {
        label: 'Edit',
        onClick: () => {
          useCompanyActions().handleJobEdit(props.job);
        },
      },
    ],
    [
      {
        label: 'Duplicate',
        onClick: () => {
          useCompanyActions().handleJobDuplicate(props.job);
        },
      },
    ],
    [
      {
        label: 'View',
        onClick: () => {
          navigateTo(AppRoutes.jobDetail(props.job.slug));
        },
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        onClick: () => {
          showConfirmJobDeleteModal();
        },
      },
    ],
  ];
</script>

<!--TODO remove deleted job offer from saved jobs-->
<template>
  <!--  @click.stop="useJobActions().viewDetails(props.job)"-->
  <div class="relative cursor-pointer" @click.self.prevent>
    <div
      v-if="useJobActions().jobBelongsToCompany(company)"
      class="absolute right-[29px] top-[12px]"
      @click.self.capture="toggleJobActionItems"
    >
      <UDropdownMenu
        v-model:open="isActionItemsOpen"
        :items="jobActionItems"
        :popper="{ placement: 'bottom-start' }"
      >
        <div class="flex items-center justify-center">
          <UIcon class="ml-5 text-2xl" name="i-heroicons-ellipsis-horizontal" />
        </div>
      </UDropdownMenu>
    </div>

    <UCard
      :class="[
        'cursor-pointer transition-all duration-300 ease-in-out',
        useJobActions().jobBelongsToCompany(company) ? '' : 'hover:translate-x-1.5',
      ]"
      @click="useJobActions().viewDetails(props.job)"
    >
      <div class="relative flex items-center justify-between">
        <div class="absolute bottom-[-15px] right-[1px]">
          <SaveJobIconButton :company="company" :job="job" />
        </div>
        <div class="flex flex-grow flex-col space-y-1.5">
          <div class="flex w-full justify-between">
            <h3 class="flex-grow text-lg font-semibold">
              {{ job?.title }}
            </h3>
          </div>
          <div class="flex space-x-3 text-sm">
            <h4
              class="text-sm font-medium text-gray-900"
              @click="() => navigateTo(AppRoutes.companyPage(company.slug))"
            >
              {{ company?.name }}
            </h4>

            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-user-group" />
              <span class="font-medium text-black">
                {{ userFacingCompanySize(company?.size) }}
              </span>
            </div>
          </div>

          <!--        options-->
          <div class="flex items-center space-x-3 text-sm">
            <WorkingPermits
              :countries="jobWorkingPermits(data?.countries ?? [], job as JobOffer)"
            />

            <span class="rounded-full border border-gray-500/30 px-3 py-0.5 text-xs">
              {{ userFacingRemoteOptions(job?.remoteOptions as RemoteOptions) }}
            </span>

            <!--            <span>•</span>-->
            <span class="rounded-full border border-gray-500/30 px-3 py-0.5 text-xs">
              {{ userFacingWorkType(job?.workType) }}
            </span>

            <!--            <span>•</span>-->

            <JobSalaryBox :job="job" />
          </div>
        </div>
        <div class="flex flex-col">
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center self-end justify-self-end rounded-full bg-indigo-600"
            @click.capture.stop="isJobSidePanelOpen = true"
          >
            <ArrowBackIcon class="h-3 rotate-180 text-white shadow-lg" />
          </div>
        </div>
      </div>
    </UCard>
  </div>

  <USlideover
    v-model:open="isJobSidePanelOpen"
    :title="job.title"
    :ui="{ overlay: { background: 'bg-gray-200/60 dark:bg-gray-800/75' } }"
    description="Job Details"
  >
    <template #body>
      <div class="my-4 flex-1 p-4">
        <JobDetailsCard :job="job" />
      </div>
    </template>
  </USlideover>
</template>

<style scoped></style>
