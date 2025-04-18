<script lang="ts" setup>

  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import type { Company } from '~/features/companies/company.types';
  import { AppRoutes } from '~/core/routes';
  import { userFacingCompanySize } from '~/features/companies/transformers';
  import ItemData from '~/components/job/ItemData.vue';
  //@ts-ignore
  import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

  //@ts-ignore
  const props = defineProps({
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
  });
</script>

<template>
  <UCard :class="['transition-all duration-300 ease-in-out cursor-pointer']"
         @click="navigateTo(AppRoutes.companyPage(company.slug))">

    <div class="flex flex-col items-baseline space-y-3 md:flex-row md:space-x-3 p-2">

      <div class="flex space-between gap-4 items-center md:gap-0 md:items-start">
        <CompanyLogo :company="company as Company" size="xl" />

        <div v-if="useBreakpoints(breakpointsTailwind).isSmallerOrEqual('md')"
             class="visible md:invisible">
          {{ company.jobOffers.length }} jobs
        </div>
      </div>

      <div class="flex-grow flex-wrap flex flex-col text-gray-600 space-y-2">
        <h3 class="text-xl font-medium primary-gradient">{{ company.name }}</h3>
        <ItemData :show-label="false" label="Company Size">
          <template #content>
            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-building-office" />
              <span class="text-black text-xl">{{ userFacingCompanySize(company?.size) }}</span>
            </div>
          </template>
        </ItemData>
        <p class="line-clamp-[10] overflow-ellipsis">{{ company.description }}</p>
      </div>

      <div class="invisible md:visible">{{ company.jobOffers.length }} jobs</div>
    </div>
  </UCard>

</template>

<style scoped>

</style>