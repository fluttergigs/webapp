<template>
  <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden w-full">
    <div class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
      <div class="flex flex-col gap-y-8 xl:mx-auto w-full">
        <h3
            class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
          Post your job
        </h3>

        <form class="flex flex-col space-y-8 my-12 w-full">
          <CustomInput placeholder="eg. Senior Flutter Engineer" name="jobTitle" label="Job title *"
                       v-model="jobCreationData.title" type="text"/>

          <CustomInput inside-text="Generate description using AI 🚀" name="description" label="Job description *"
                       v-model="jobCreationData.description" :is-text-area="true"/>


          <div class="flex space-x-3">
            <!--          job type-->
            <div class="flex flex-col space-y-2 w-full">
              <LabelledInput label="Job type *">
                <USelectMenu
                    clear-search-on-close
                    searchable
                    size="lg"
                    v-model="jobCreationData.workType"
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
                    v-model="jobCreationData.seniorityLevel"
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
                  v-model="jobCreationData.remoteOptions"
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
                <CustomInput @keydown="checkDigit" placeholder="2000" name="amount" :show-label="false" label="From"
                             class="w-full"
                             v-model="jobCreationData.salaryFrom"/>

                <span class="self-baseline">-</span>

                <CustomInput @keydown="checkDigit" placeholder="8000" name="amount" :show-label="false" label="From"
                             class="w-full"
                             v-model="jobCreationData.salaryTo"/>

              </div>
            </LabelledInput>
          </div>

          <!--          apply before-->
          <LabelledInput label="Application closes on *">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton class="w-full" size="xl" color="white" icon="i-heroicons-calendar-days-20-solid"
                       :label="format(jobCreationData.applyBefore, 'd MMM, yyy')"/>

              <template #panel="{ close }">
                <DatePicker color="bg-indigo-700" v-model="jobCreationData.applyBefore" @close="close"/>
              </template>

            </UPopover>
          </LabelledInput>

          <CustomInput name="url" label="Application method *"
                       class="w-full" inside-text="Enter an email or application link."
                       v-model="jobCreationData.salaryTo"/>

        </form>
      </div>

      <div class="hidden xl:flex xl:min-w-[300px] xl:w-[380px]">
        <JobCreationPreview :job="jobCreationData"/>
      </div>
    </div>
  </section>

</template>

<script setup>
import {storeToRefs} from "pinia";
import {useJobStore} from "~/stores/job";
import CustomInput from "~/components/forms/CustomInput.vue";
import {remoteOptions, seniorityLevelOptions, workTypeOptions} from "~/core/constants";
import {checkDigit} from "~/core/utils";
import 'v-calendar/dist/style.css'
import {format} from "date-fns";
import {DatePicker} from "v-calendar";
import LabelledInput from "~/components/forms/LabelledInput.vue";

definePageMeta({layout: 'app-layout', middleware: ['auth', 'no-company'],})

const {jobCreationData} = storeToRefs(useJobStore())

watch(jobCreationData, () => {
  if (jobCreationData.value.salaryTo === "") {
    jobCreationData.value.salaryTo = 1
  }

  if (jobCreationData.value.salaryFrom === "") {
    jobCreationData.value.salaryFrom = 1
  }

}, {deep: true,})
</script>

<style scoped>

</style>