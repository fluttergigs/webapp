<script lang="ts" setup>

  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import type { Wrapper } from '~/core/wrapper';
  import type { MultiApiResponse } from '~/core/shared/types';
  import type { Company } from '~/features/companies/company.types';

  const companyStore = useCompanyStore();
  //@ts-ignore
  const props = defineProps({
    companies: {
      type: Array,
      default: () => [],
    },
    companiesResponse: {
      type: Object as PropType<Wrapper<MultiApiResponse<Company>>>,
      required: true,
    },
  });
</script>

<template>
  <div class="flex flex-col space-y-4">
    <client-only>
      <template v-if="companiesResponse.isFailure">
        <div class="flex flex-col items-center justify-center">
          <slot name="error">
            <div class="flex flex-col items-center space-y-2">
              <p>Unable to fetch companies in the list</p>
              <img alt="Empty job results" class="w-96 h-96" src="@/assets/images/emptyJobFiltersResult.svg" />
            </div>
          </slot>
          <slot name="ctaError">
          </slot>
        </div>

      </template>
      <template v-else-if="companiesResponse.isSuccess">

        <div v-if="companies.length <= 0" class="flex flex-col items-center justify-center">
          <slot name="noData">
            <div class="flex flex-col items-center space-y-2">
              <p>No companies found in the list</p>
              <img alt="Empty job results" class="w-96 h-96" src="@/assets/images/emptyJobFiltersResult.svg" />
            </div>
          </slot>
          <slot name="cta">
          </slot>
        </div>

        <template v-else>
          <slot v-for="company in props.companies" :key="company.slug" :job="company">
            <CompanyCard :key="company.slug" :company="company" />
          </slot>
        </template>
      </template>
      <div v-else-if="companiesResponse.isLoading">
        <slot name="loader">
          <div v-for="_ in defaultShimmerListItemsCount">
            <USkeleton class="flex h-[180px] w-full mb-3" />
          </div>
        </slot>
      </div>
    </client-only>
  </div>
</template>
