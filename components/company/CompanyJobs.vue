<script setup lang="ts">

//@ts-ignore
import type {PropType} from "@vue/runtime-core";
import type {Company} from "~/features/companies/company.types";
import JobOffersList from "~/components/job/JobOffersList.vue";
import {storeToRefs} from "pinia";
import {useCompanyStore} from "~/stores/company";

//@ts-ignore
const props = defineProps({
      company: {
        type: Object as PropType<Company>,
        required: true,
      },
    }
)

const {viewedCompanyJobs, viewedCompanyJobsResponse} = storeToRefs(useCompanyStore())

</script>

<template>
  <div class="flex flex-col gap-x-16 lg:flex-row">
    <div class="flex-shrink-0 lg:w-[50rem]">

      <div class="flex flex-col space-y-4">
        <h3 class="mb-4 text-2xl font-medium text-gray-900 md:mb-5">
          {{ viewedCompanyJobs?.length }} jobs at
          {{ company.name }}</h3>

        <JobOffersList :jobs="viewedCompanyJobs"
                       :jobs-response="viewedCompanyJobsResponse"/>
      </div>

    </div>
    <CompanyInfoCard :show-view-profile-button="false"
                     class="w-full" :company="company"/>
  </div>
</template>

<style scoped>

</style>