<!--TODO - check whether min salary is > max salary-->
<!--TODO check whether user has selected at least a work permit-->

<template>
  <JobDescriptionGenerationModal/>
  <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden w-full">
    <div class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
      <div class="flex flex-col gap-y-8 xl:mx-auto w-full">
        <h3
            class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
          Post your job
        </h3>

        <form class="flex flex-col space-y-8 my-12 w-full">
          <CustomInput v-model="jobCreationData.title"
                       label="Job title *"
                       name="jobTitle"
                       placeholder="eg. Senior Flutter Engineer" type="text"/>


          <!--          <LabelledInput label="Job Description *">
                      <UiTipTap @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
                                v-model="jobCreationData.description"
                                inside-text="Generate description using AI 🚀"/>
                    </LabelledInput>-->

          <CustomInput v-model="jobCreationData.description"
                       :is-text-area="true"
                       inside-text="Generate description using AI 🚀"
                       label="Job description *"
                       name="description" @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"/>

          <div class="flex space-x-3">
            <!--          job type-->
            <div class="flex flex-col space-y-2 w-full">
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
            <div class="flex flex-col space-y-2 w-full">
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
                <CustomInput v-model="jobCreationData.salaryFrom"
                             :show-label="false" class="w-full"
                             label="From" name="amount"
                             placeholder="2000"
                             @keydown="checkDigit"/>

                <span class="self-baseline">-</span>

                <CustomInput v-model="jobCreationData.salaryTo" :show-label="false"
                             class="w-full"
                             label="From" name="amount"
                             placeholder="8000"
                             @keydown="checkDigit"/>
              </div>
            </LabelledInput>
          </div>

          <!--          apply before-->
          <LabelledInput label="Application closes on *">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton :label="format(parseISO(jobCreationData.applyBefore, ), 'd MMM, yyy')" class="w-full"
                       color="white"
                       icon="i-heroicons-calendar-days-20-solid"
                       size="xl"/>

              <template #panel="{ close }">
                <DatePicker v-model="jobCreationData.applyBefore" :min-date="new Date()"
                            color="indigo" @close="close"/>
              </template>
            </UPopover>
          </LabelledInput>

          <LabelledInput label="Working permits *">
            <div class="flex flex-col gap-4">
              <URadio v-model="hasWorkPermit"
                      :ui="{label: 'text-sm font-medium text-black'}" :value="false"
                      label="No working permits required"/>

              <div class="flex flex-col gap-3">
                <URadio v-model="hasWorkPermit"
                        :ui="{label: 'text-sm font-medium text-black'}" :value="true"
                        label="Must be eligible to work in"/>
                <WorkPermitSelector @selected-countries="getSelectedCountries"/>
              </div>
            </div>
          </LabelledInput>

          <CustomInput v-model="jobCreationData.howToApply"
                       class="w-full"
                       inside-text="Enter an email or application link."
                       label="Application method *"
                       name="url"
                       placeholder="eg. https://fluttergigs.com/apply"/>

          <UButton :disabled="!isSubmitButtonEnabled"
                   :loading="jobCreation.isLoading"
                   class="bg-indigo-700 flex justify-center items-center"
                   color="indigo"
                   label="Post your Job for $20"
                   size="xl"
                   @click="handleJobPosting"/>
        </form>
      </div>

      <div class="hidden lg:flex lg:min-w-[300px] lg:w-[380px] h-full">
        <div class="flex flex-col h-full w-full relative">
          <JobCreationPreview :is-cta-enabled="isSubmitButtonEnabled"
                              :job="jobCreationData"
                              :work-permit-countries="workPermits"/>
        </div>
      </div>
    </div>
  </section>

</template>

<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useJobStore} from "~/stores/job";
import CustomInput from "~/components/forms/CustomInput.vue";
import {remoteOptions, seniorityLevelOptions, workTypeOptions} from "~/core/constants";
import {checkDigit} from "~/core/utils";
import 'v-calendar/dist/style.css'
import {format, parseISO} from "date-fns";
import {DatePicker} from "v-calendar";
import LabelledInput from "~/components/forms/LabelledInput.vue";
import JobDescriptionGenerationModal from "~/components/job/JobDescriptionGenerationModal.vue";
import WorkPermitSelector from "~/components/job/WorkPermitSelector.vue";
import type {Country} from "~/core/shared/types";
import {logDev} from "~/core/helpers/log";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {postJobFormSchema} from "~/core/validations/job.validations";
import useCompanyActions from "~/composables/useCompanyActions";

definePageMeta({
  layout: 'app-layout',
  middleware: ['auth', 'no-company'],
  title: 'Post your job',
})

const jobStore = useJobStore()
const {jobCreationData, jobCreation} = storeToRefs(jobStore)
const hasWorkPermit = ref(false)
const workPermits = ref([]);
const {$analytics} = useNuxtApp()
const canPostJob = ref(false)
const {handleJobPosting} = useCompanyActions()

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobPostPageEntered,)


})

watch(jobCreationData, async () => {
  canPostJob.value = await postJobFormSchema.isValid(jobCreationData.value);
}, {deep: true, immediate: true},)

watch(jobCreationData, () => {
  if (jobCreationData.value.salaryTo == "") {
    jobCreationData.value.salaryTo = 1
  }

  if (jobCreationData.value.salaryFrom == "") {
    jobCreationData.value.salaryFrom = 1
  }
}, {deep: true,})

watch(hasWorkPermit, (value: boolean) => {
  if (!value) {
    jobCreationData.value.workPermits = null
  }
})

const isSubmitButtonEnabled = computed(() => canPostJob.value && !jobCreation.value.isLoading)

const getSelectedCountries = (data: {
  countries: [Country]
}) => {
  logDev('SELECTED COUNTRIES POST', data)

  if (!hasWorkPermit.value) {
    hasWorkPermit.value = true;
  }

  workPermits.value = data.countries.map((country) => country)
  jobCreationData.value.workPermits = workPermits.value.map(({iso}: Country) => iso)
}
</script>

<style scoped>

</style>