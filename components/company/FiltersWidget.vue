<script lang="ts" setup>

  import { storeToRefs } from 'pinia';
  //@ts-ignore
  import { watchDebounced } from '@vueuse/core';
  import SizeFilter from '~/components/company/SizeFilter.vue';

  const companyStore = useCompanyStore();
  const { searchFilters } = storeToRefs(companyStore);

  const handleSizeFilter = (value: string) => {
    companyStore.setCompanySearchFilters({ size: value });
  };

  const handleKeywordFilter = (value: string) => {
    companyStore.setCompanySearchFilters({ keyword: value });
  };

  watchDebounced(
    searchFilters,
    async () => {
      await companyStore.filterCompanies();
    },
    { debounce: 800, maxWait: 2000, rejectOnCancel: true },
  );

</script>

<template>
  <section>
    <p class="mb-4 text-lg text-gray-900 font-semibold">
      Company Filters
    </p>
    <div class="flex flex-col space-y-6">
      <CompanyKeywordFilter @filterByKeyword="handleKeywordFilter" />
      <SizeFilter @filterBySize="(value)=> handleSizeFilter(value)" />
    </div>
  </section>
</template>

<style scoped>

</style>