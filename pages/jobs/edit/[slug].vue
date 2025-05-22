<!--TODO - check whether min salary is > max salary-->
<!--TODO check whether user has selected at least a work permit-->

<template>
  <main>
    <JobDescriptionGenerationModal @successful-generation="successfulGeneration" />
    <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden w-full">
      <div class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
        <div class="flex flex-col gap-y-8 xl:mx-auto w-full">
          <h3 class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
            Edit your job
          </h3>

          <form class="flex flex-col space-y-8 my-12 w-full">
            <CustomInput
              v-model="jobEditData.title"
              is-disabled
              label="Job title *"
              name="jobTitle"
              placeholder="eg. Senior Flutter Engineer"
              type="text"
            />

            <!--          <LabelledInput label="Job Description *">
                        <UiTipTap @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
                                  v-model="jobEditData.description"
                                  inside-text="Generate description using AI 🚀"/>
                      </LabelledInput>-->

            <CustomInput
              v-model="jobEditData.description"
              :is-text-area="true"
              inside-text="Generate description using AI 🚀"
              label="Job description *"
              name="description"
              @inside-text-clicked="jobStore.showJobDescriptionGenerationModal"
            />

            <div class="flex space-x-3">
              <!--          job type-->
              <div class="flex flex-col space-y-2 w-full">
                <LabelledInput label="Job type *">
                  <USelectMenu
                    v-model="jobEditData.workType"
                    :items="workTypeOptions"
                    clear-search-on-close
                    label-key="label"
                    placeholder="Select a work type option"
                    searchable
                    size="lg"
                    value-key="id"
                  />
                </LabelledInput>
              </div>

              <!--          seniority level-->
              <div class="flex flex-col space-y-2 w-full">
                <LabelledInput label="Seniority level *">
                  <USelectMenu
                    v-model="jobEditData.seniorityLevel"
                    :items="seniorityLevelOptions"
                    clear-search-on-close
                    label-key="label"
                    placeholder="Select a seniority level"
                    searchable
                    size="lg"
                    value-key="id"
                  />
                </LabelledInput>
              </div>
            </div>
            <!--          remote options-->
            <div class="flex flex-col space-y-2">
              <LabelledInput label="Remote options *">
                <USelectMenu
                  v-model="jobEditData.remoteOptions"
                  :items="remoteOptions"
                  clear-search-on-close
                  label-key="label"
                  placeholder="Select your remote options"
                  searchable
                  size="lg"
                  value-key="id"
                />
              </LabelledInput>
            </div>
            <!--          base salary-->
            <div class="flex flex-col space-y-2">
              <LabelledInput label="Monthly Salary range (USD) *">
                <div class="flex space-x-3">
                  <CustomInput
                    v-model="jobEditData.salaryFrom"
                    :show-label="false"
                    class="w-full"
                    label="From"
                    name="amount"
                    placeholder="2000"
                    @keydown="checkDigit"
                  />

                  <span class="self-baseline">-</span>

                  <CustomInput
                    v-model="jobEditData.salaryTo"
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
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  :label="format(new Date(jobEditData.applyBefore), 'd MMM, yyy')"
                  class="w-full"
                  color="white"
                  icon="i-heroicons-calendar-days-20-solid"
                  size="xl"
                />

                <template #content="{ close }">
                  <DatePicker
                    v-model="jobEditData.applyBefore"
                    :min-date="new Date()"
                    color="primary"
                    @close="close"
                  />
                </template>
              </UPopover>
            </LabelledInput>

            <LabelledInput label="Working permits *">
              <div class="space-y-4">
                <URadio
                  v-model="hasWorkPermit"
                  :ui="{ label: 'text-sm font-medium text-black' }"
                  :value="false"
                  label="No working permits required"
                />

                <div class="space-y-3">
                  <URadio
                    v-model="hasWorkPermit"
                    :ui="{ label: 'text-sm font-medium text-black' }"
                    :value="true"
                    label="Must be eligible to work in"
                  />
                  <WorkPermitSelector @selected-countries="getSelectedCountries" />
                </div>
              </div>
            </LabelledInput>

            <CustomInput
              v-model="jobEditData.howToApply"
              class="w-full"
              inside-text="Enter an email or application link."
              label="Application method *"
              name="url"
              placeholder="eg. https://fluttergigs.com/apply"
            />

            <UButton
              :disabled="!isSubmitButtonEnabled || jobEdit.isLoading"
              :loading="jobEdit.isLoading"
              class="bg-indigo-700 flex justify-center items-center"
              color="primary"
              label="Save changes"
              size="xl"
              @click="() => editJobOffer(jobEditData)"
            />
          </form>
        </div>

        <div class="hidden lg:flex lg:min-w-[280px] lg:w-[380px] h-full">
          <div class="flex flex-col h-full w-full relative">
            <JobCreationPreview
              :is-cta-visible="false"
              :job="jobEditData"
              :work-permit-countries="workPermits"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
  import { format } from 'date-fns';
  import { storeToRefs } from 'pinia';
  import { DatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LabelledInput from '~/components/forms/LabelledInput.vue';
  import JobDescriptionGenerationModal from '~/components/job/JobDescriptionGenerationModal.vue';
  import WorkPermitSelector from '~/components/job/WorkPermitSelector.vue';
  import useCompanyActions from '~/composables/useCompanyActions';
  import useJobActions from '~/composables/useJobActions';
  import { remoteOptions, seniorityLevelOptions, workTypeOptions } from '~/core/constants';
  import { logDev } from '~/core/helpers/log';
  import { checkDigit } from '~/core/utils';
  import { editJobFormSchema } from '~/core/validations/job.validations';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useJobStore } from '~/stores/job';

  definePageMeta({
    layout: 'app-layout',
    middleware: ['auth', 'no-company'],
    function() {
      if (!useJobActions().jobBelongsToCompany(useJobStore().jobEditData.company)) {
        return abortNavigation();
      }
    },
  });

  const jobStore = useJobStore();
  const { jobEditData, jobEdit } = storeToRefs(jobStore);

  const hasWorkPermit = ref(false);
  const workPermits = ref([]);
  const { $analytics } = useNuxtApp();
  const canEditJob = ref(false);
  const { editJobOffer } = useCompanyActions();

  onMounted(() => {
    $analytics.capture(AnalyticsEvent.jobEditPageEntered);
    useHead({ title: `Flutter Gigs - Edit your job offer: ${jobEditData?.value?.title}` });
  });

  watch(
    jobEditData,
    async () => {
      canEditJob.value = await editJobFormSchema.isValid(jobEditData.value);
    },
    { deep: true, immediate: true },
  );

  const isSubmitButtonEnabled = computed(() => {
    const canSubmit = canEditJob.value && !jobEdit.value.isLoading;
    return hasWorkPermit.value && workPermits.value.length === 0 ? false : canSubmit;
  });

  watch(
    jobEditData,
    () => {
      if (jobEditData.value.salaryTo == '') {
        jobEditData.value.salaryTo = 1;
      }

      if (jobEditData.value.salaryFrom == '') {
        jobEditData.value.salaryFrom = 1;
      }
    },
    { deep: true },
  );

  watch(hasWorkPermit, (value) => {
    if (!value) {
      jobEditData.value.workPermits = null;
    }
  });

  const getSelectedCountries = (data) => {
    logDev('SELECTED COUNTRIES POST', data);

    if (!hasWorkPermit.value) {
      hasWorkPermit.value = true;
    }

    workPermits.value = data.countries.map((country) => country);
    jobEditData.value.workPermits = workPermits.value.map(({ iso }) => iso);
  };

  const successfulGeneration = (result) => {
    jobEditData.value.description = result;
  };
</script>

<style scoped></style>
