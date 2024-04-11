<!--TODO - check whether min salary is > max salary-->
<!--TODO check whether user has selected at least a work permit-->

<template>
  <JobDescriptionGenerationModal @successful-generation="successfulGeneration"/>
  <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden w-full">
    <div class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
      <div class="flex flex-col gap-y-8 xl:mx-auto w-full">
        <h3
            class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
          Edit your job
        </h3>

        <form class="flex flex-col space-y-8 my-12 w-full">
          <CustomInput placeholder="eg. Senior Flutter Engineer"
                       name="jobTitle"
                       label="Job title *"
                       v-model="jobEditData.title" type="text"/>


          <!--          <LabelledInput label="Job Description *">
                      <UiTipTap @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
                                v-model="jobEditData.description"
                                inside-text="Generate description using AI 🚀"/>
                    </LabelledInput>-->

          <CustomInput @inside-text-clicked="jobStore.showJobDescriptionGenerationModal()"
                       inside-text="Generate description using AI 🚀"
                       name="description"
                       label="Job description *"
                       v-model="jobEditData.description" :is-text-area="true"/>

          <div class="flex space-x-3">
            <!--          job type-->
            <div class="flex flex-col space-y-2 w-full">
              <LabelledInput label="Job type *">
                <USelectMenu
                    clear-search-on-close
                    searchable
                    size="lg"
                    v-model="jobEditData.workType"
                    :options="workTypeOptions"
                    placeholder="Select a work type option"
                    value-attribute="id"
                    option-attribute="label"
                />
              </LabelledInput>
            </div>

            <!--          seniority level-->
            <div class="flex flex-col space-y-2 w-full">
              <LabelledInput label="Seniority level *">
                <USelectMenu
                    clear-search-on-close
                    searchable
                    size="lg"
                    v-model="jobEditData.seniorityLevel"
                    :options="seniorityLevelOptions"
                    placeholder="Select a seniority level"
                    value-attribute="id"
                    option-attribute="label"
                />
              </LabelledInput>
            </div>
          </div>
          <!--          remote options-->
          <div class="flex flex-col space-y-2">
            <LabelledInput label="Remote options *">
              <USelectMenu
                  clear-search-on-close
                  searchable
                  size="lg"
                  v-model="jobEditData.remoteOptions"
                  :options="remoteOptions"
                  placeholder="Select your remote options"
                  value-attribute="id"
                  option-attribute="label"
              />
            </LabelledInput>
          </div>
          <!--          base salary-->
          <div class="flex flex-col space-y-2">
            <LabelledInput label="Monthly Salary range (USD) *">
              <div class="flex space-x-3">
                <CustomInput @keydown="checkDigit"
                             placeholder="2000" name="amount"
                             :show-label="false" label="From"
                             class="w-full"
                             v-model="jobEditData.salaryFrom"/>

                <span class="self-baseline">-</span>

                <CustomInput @keydown="checkDigit" placeholder="8000"
                             name="amount"
                             :show-label="false" label="From"
                             class="w-full"
                             v-model="jobEditData.salaryTo"/>
              </div>
            </LabelledInput>
          </div>

          <!--          apply before-->
          <LabelledInput label="Application closes on *">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton class="w-full" size="xl" color="white"
                       icon="i-heroicons-calendar-days-20-solid"
                       :label="format(new Date(jobEditData.applyBefore!), 'd MMM, yyy')"/>

              <template #panel="{ close }">
                <DatePicker :min-date="new Date()" color="indigo"
                            v-model="jobEditData.applyBefore" @close="close"/>
              </template>
            </UPopover>
          </LabelledInput>

          <LabelledInput label="Working permits *">
            <div class="space-y-4">
              <URadio :ui="{label: 'text-sm font-medium text-black'}"
                      :value="false" v-model="hasWorkPermit"
                      label="No working permits required"/>

              <div class="space-y-3">
                <URadio :ui="{label: 'text-sm font-medium text-black'}"
                        :value="true" v-model="hasWorkPermit"
                        label="Must be eligible to work in"/>
                <WorkPermitSelector @selected-countries="getSelectedCountries"/>
              </div>
            </div>
          </LabelledInput>

          <CustomInput placeholder="eg. https://fluttergigs.com/apply"
                       name="url"
                       label="Application method *"
                       class="w-full"
                       inside-text="Enter an email or application link."
                       v-model="jobEditData.howToApply"/>

          <UButton :loading="jobEdit.isLoading"
                   :disabled="!isSubmitButtonEnabled"
                   @click="()=>editJobOffer(jobEditData)"
                   size="xl"
                   color="indigo"
                   class="bg-indigo-700 flex justify-center items-center"
                   label="Edit job"/>
        </form>
      </div>

      <div class="hidden lg:flex lg:min-w-[280px] lg:w-[380px] h-full">
        <div class="flex flex-col h-full w-full relative">
          <JobCreationPreview :is-cta-visible="false"
                              :job="jobEditData"
                              :work-permit-countries="workPermits"/>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useJobStore} from "~/stores/job";
import CustomInput from "~/components/forms/CustomInput.vue";
import {remoteOptions, seniorityLevelOptions, workTypeOptions} from "~/core/constants";
import {checkDigit} from "~/core/utils";
import 'v-calendar/dist/style.css'
import {format} from "date-fns";
import {DatePicker} from "v-calendar";
import LabelledInput from "~/components/forms/LabelledInput.vue";
import JobDescriptionGenerationModal from "~/components/job/JobDescriptionGenerationModal.vue";
import WorkPermitSelector from "~/components/job/WorkPermitSelector.vue";
import type {Country} from "~/core/shared/types";
import {logDev} from "~/core/helpers/log";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {editJobFormSchema,} from "~/core/validations/job.validations";
import useCompanyActions from "~/composables/useCompanyActions";
import useJobActions from "~/composables/useJobActions";
import {extractCompanyFromJob} from "~/features/jobs/transformers";

definePageMeta({
  layout: 'app-layout',
  middleware: ['auth', 'no-company'],
  function() {
    if (!useJobActions().jobBelongsToCompany(extractCompanyFromJob(useJobStore().jobEditData.company))) {
      return abortNavigation()
    }
  },
})

const jobStore = useJobStore()
const {jobEditData, jobEdit} = storeToRefs(jobStore)
useHead({title: `Flutter Gigs - Edit your job offer: ${jobEditData?.value?.title}`,});

const hasWorkPermit = ref(false)
const workPermits = ref([]);
const {$analytics} = useNuxtApp()
const canEditJob = ref(false)
const {editJobOffer} = useCompanyActions()

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobEditPageEntered,)
})

watch(jobEditData, async () => {
  canEditJob.value = await editJobFormSchema.isValid(jobEditData.value);
}, {deep: true, immediate: true},)

const isSubmitButtonEnabled = computed(() => {
  const canSubmit = canEditJob.value && !jobEdit.value.isLoading;
  return (hasWorkPermit.value && workPermits.value.length === 0)  ? false : canSubmit;
})

watch(jobEditData, () => {
  if (jobEditData.value.salaryTo == "") {
    jobEditData.value.salaryTo = 1
  }

  if (jobEditData.value.salaryFrom == "") {
    jobEditData.value.salaryFrom = 1
  }
}, {deep: true})

watch(hasWorkPermit, (value: boolean) => {
  if (!value) {
    jobEditData.value.workPermits = null
  }
})

const getSelectedCountries = (data: {
  countries: [Country]
}) => {
  logDev('SELECTED COUNTRIES POST', data)

  if (!hasWorkPermit.value) {
    hasWorkPermit.value = true;
  }

  workPermits.value = data.countries.map((country) => country)
  jobEditData.value.workPermits = workPermits.value.map(({iso}: Country) => iso)
}
const successfulGeneration = (result: string) => {
  jobEditData.value.description = result
}
</script>

<style scoped>

</style>