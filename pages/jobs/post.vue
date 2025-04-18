<!--TODO - check whether min salary is > max salary-->
<!--TODO check whether user has selected at least a work permit-->

<template>

  <main>

    <JobDescriptionGenerationModal
      @successful-generation="handleJobDescriptionGenerated"
    />
    <section class="w-full overflow-hidden bg-white px-2 py-8 md:py-12 xl:pb-56">
      <div class="my-4 flex flex-col gap-x-16 font-normal md:flex-row">
        <div class="flex w-full flex-col gap-y-8 xl:mx-auto">
          <h3
            class="tracking-px-n mb-4 text-2xl font-semibold leading-tight md:text-4xl"
          >
            Post your job
          </h3>

          <form class="my-12 flex w-full flex-col space-y-8">
            <CustomInput
              v-model="jobCreationData.title"
              label="Job title *"
              name="jobTitle"
              placeholder="eg. Senior Flutter Engineer"
              type="text"
            />

            <!--          <LabelledInput label="Job Description *">
                        <UiTipTap @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
                                  v-model="jobCreationData.description"
                                  inside-text="Generate description using AI 🚀"/>
                      </LabelledInput>-->

            <LabelledInput
              inside-text="Generate description using AI 🚀"
              label="Job Description *"
              @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
            >
              <client-only>
                <QuillEditorWrapper
                  v-model="jobCreationData.description"
                  placeholder="Write your awesome job description"
                  @ready="onEditorReady"
                />
              </client-only>
            </LabelledInput>

            <!--          <CustomInput v-model="jobCreationData.description"
                                   :is-text-area="true"
                                   inside-text="Generate description using AI 🚀"
                                   label="Job description *"
                                   name="description" @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"/>-->

            <div class="flex space-x-3">
              <!--          job type-->
              <div class="flex w-full flex-col space-y-2">
                <LabelledInput label="Job type *">
                  <USelectMenu
                    v-model="jobCreationData.workType"
                    :options="workTypeOptions"
                    clear-search-on-close
                    option-attribute="label"
                    placeholder="Select a work type option"
                    searchable
                    size="lg"
                    value-attribute="id"
                  />
                </LabelledInput>
              </div>

              <!--          seniority level-->
              <div class="flex w-full flex-col space-y-2">
                <LabelledInput label="Seniority level *">
                  <USelectMenu
                    v-model="jobCreationData.seniorityLevel"
                    :options="seniorityLevelOptions"
                    clear-search-on-close
                    option-attribute="label"
                    placeholder="Select a seniority level"
                    searchable
                    size="lg"
                    value-attribute="id"
                  />
                </LabelledInput>
              </div>
            </div>
            <!--          remote options-->
            <div class="flex flex-col space-y-2">
              <LabelledInput label="Remote options *">
                <USelectMenu
                  v-model="jobCreationData.remoteOptions"
                  :options="remoteOptions"
                  clear-search-on-close
                  option-attribute="label"
                  placeholder="Select your remote options"
                  searchable
                  size="lg"
                  value-attribute="id"
                />
              </LabelledInput>
            </div>
            <!--          base salary-->
            <div class="flex flex-col space-y-2">
              <LabelledInput label="Monthly Salary range (USD) *">
                <div class="flex space-x-3">
                  <CustomInput
                    v-model="jobCreationData.salaryFrom"
                    :show-label="false"
                    class="w-full"
                    label="From"
                    name="amount"
                    placeholder="2000"
                    @keydown="checkDigit"
                  />

                  <span class="self-baseline">-</span>

                  <CustomInput
                    v-model="jobCreationData.salaryTo"
                    :show-label="false"
                    class="w-full"
                    label="From"
                    name="amount"
                    placeholder="8000"
                    @keydown="checkDigit"
                  />
                </div>
              </LabelledInput>
            </div>

            <!--          apply before-->
            <LabelledInput label="Application closes on *">
              <UPopover :popper="{ placement: 'bottom-start', }">
                <UButton
                  :label="format(new Date(jobCreationData.applyBefore), 'd MMMM, yyy')"
                  class="w-full"
                  color="white"
                  icon="i-heroicons-calendar-days-20-solid"
                  size="xl"
                />

                <template #panel="{ close }">
                  <DatePicker
                    v-model="jobCreationData.applyBefore"
                    :is-range="false"
                    :is-required="true"
                    :min-date="new Date()"
                    color="indigo"
                    @close="close"
                    @update:model-value="close"
                  />
                </template>
              </UPopover>
            </LabelledInput>

            <LabelledInput label="Working permits *">
              <div class="flex flex-col gap-4">
                <URadio
                  v-model="hasWorkPermit"
                  :ui="{ label: 'text-sm font-medium text-black' }"
                  :value="false"
                  label="No working permits required"
                />

                <div class="flex flex-col gap-3">
                  <URadio
                    v-model="hasWorkPermit"
                    :ui="{ label: 'text-sm font-medium text-black' }"
                    :value="true"
                    label="Must be eligible to work in"
                  />
                  <WorkPermitSelector
                    @selected-countries="getSelectedCountries"
                  />
                </div>
              </div>
            </LabelledInput>

            <CustomInput
              v-model="jobCreationData.howToApply"
              class="w-full"
              inside-text="Enter an email or application link."
              label="Application method *"
              name="url"
              placeholder="eg. https://fluttergigs.com/apply"
            />

            <UButton
              :disabled="!isSubmitButtonEnabled"
              :label="useJobPost().jobPostCtaLabel"
              :loading="jobCreation.isLoading"
              class="flex items-center justify-center bg-indigo-700"
              color="indigo"
              size="xl"
              @click="handleJobPosting"
            />
          </form>
        </div>

        <div class="hidden h-full lg:flex lg:w-[380px] lg:min-w-[300px]">
          <div class="relative flex h-full w-full flex-col">
            <JobCreationPreview
              :is-cta-enabled="isSubmitButtonEnabled"
              :job="jobCreationData"
              :work-permit-countries="workPermits"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useJobStore } from '~/stores/job';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { remoteOptions, seniorityLevelOptions, workTypeOptions } from '~/core/constants';
  import { checkDigit } from '~/core/utils';
  import 'v-calendar/dist/style.css';
  import { format } from 'date-fns';
  import { DatePicker } from 'v-calendar';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import JobDescriptionGenerationModal from '~/components/job/JobDescriptionGenerationModal.vue';
  import WorkPermitSelector from '~/components/job/WorkPermitSelector.vue';
  import type { Country } from '~/core/shared/types';
  import { logDev } from '~/core/helpers/log';
  import { AppAnalyticsProvider } from '~/services/analytics/app_analytics_provider';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { postJobFormSchema } from '~/core/validations/job.validations';
  import useCompanyActions from '~/composables/useCompanyActions';
  import QuillEditorWrapper from '~/components/forms/QuillEditorWrapper.vue';
  import { useJobPost } from '~/composables/useJobPost';

  definePageMeta({
    layout: 'app-layout',
    middleware: ['auth', 'no-company'],
    title: 'Post your job',
  });

  const jobStore = useJobStore();
  const { jobCreationData, jobCreation } = storeToRefs(jobStore);
  const hasWorkPermit = ref(false);
  const workPermits = ref([]);
  const { $analytics } = useNuxtApp();
  const canPostJob = ref(false);
  const { handleJobPosting, handleJobDescriptionGenerated } = useCompanyActions();

  onMounted(() => {
    ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.jobPostPageEntered,
    );
  });

  watch(
    jobCreationData,
    async () => {
      canPostJob.value = await postJobFormSchema.isValid(jobCreationData.value);
    },
    { deep: true, immediate: true },
  );

  watch(
    jobCreationData,
    () => {
      if (jobCreationData.value.salaryTo == '') {
        jobCreationData.value.salaryTo = 1;
      }

      if (jobCreationData.value.salaryFrom == '') {
        jobCreationData.value.salaryFrom = 1;
      }
    },
    { deep: true },
  );

  watch(hasWorkPermit, (value: boolean) => {
    if (!value) {
      jobCreationData.value.workPermits = null;
    }
  });

  const onEditorReady = () => {
    logDev('EDITOR READY');
  };

  const isSubmitButtonEnabled = computed(
    () => canPostJob.value && !jobCreation.value.isLoading,
  );

  const getSelectedCountries = (data: { countries: [Country] }) => {
    logDev('SELECTED COUNTRIES POST', data);

    if (!hasWorkPermit.value) {
      hasWorkPermit.value = true;
    }

    workPermits.value = data.countries.map((country) => country);
    jobCreationData.value.workPermits = workPermits.value.map(
      ({ iso }: Country) => iso,
    );
  };
</script>

<style scoped></style>
