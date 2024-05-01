<script setup lang="ts">

import {storeToRefs} from "pinia";
//@ts-ignore
import {watchDebounced} from "@vueuse/core";
import SizeFilter from "~/components/company/SizeFilter.vue";

const companyStore = useCompanyStore()
const {searchFilters} = storeToRefs(companyStore)

watchDebounced(
    searchFilters,
    async () => {
      await companyStore.filterCompanies()
    },
    {debounce: 800, maxWait: 2000, rejectOnCancel: true},
)

</script>

<template>
  <section>
    <p class="mb-4 text-lg text-gray-900 font-semibold">
      Company Filters
    </p>
    <div class="flex flex-col space-y-6">
      <CompanyKeywordFilter @filterByKeyword="(value)=> companyStore.setJobSearchFilters({keyword: value})"/>
      <SizeFilter @filterBySize="(value)=> companyStore.setJobSearchFilters({size: value})"/>
    </div>
  </section>
</template>

<style scoped>

</style>