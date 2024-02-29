<template>
  <div class="flex flex-col w-full">
    <section class="py-8 px-2 md:py-16 xl:pb-56 bg-white overflow-hidden">

      <div class="flex justify-between items-center">
        <h3
            class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
          Your job postings
        </h3>

        <UButton :padded=false :to="AppRoutes.postJob"
                 icon="i-heroicons-plus"
                 :class="['bg-indigo-700 px-2 py-1 sm:px-4 md:py-3']"
                 square label="Post a job"
                 variant="solid"/>
      </div>


      <JobOffersList :jobs="myJobPostings"
                     :jobs-response="companyJobsResponse"
                     class="my-10"/>
    </section>

  </div>

</template>

<script setup>
import {useAuthStore} from "~/stores/auth";
import {useCompanyStore} from "~/stores/company";
import {storeToRefs} from "pinia";
import {AppRoutes} from "~/core/routes";

definePageMeta({layout: 'app-layout', middleware: ['auth']})

useHead({title: "Flutter Gigs - My job postings"});

const authStore = useAuthStore()
const companyStore = useCompanyStore()

onBeforeMount(() => {
  companyStore.fetchMyJobs()
})

const {myJobPostings, companyJobsResponse} = storeToRefs(useCompanyStore())
</script>

<style scoped>

</style>