<script lang="ts" setup>
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import type { Company } from '~/features/companies/company.types';

  //@ts-ignore
  const props = defineProps({
      company: {
        type: Object as PropType<Company>,
        required: true,
      },
    },
  );
</script>

<template>

  <div class="flex flex-col gap-x-16 lg:flex-row">
    <div class="flex-shrink-0 lg:w-[70rem]">
      <div class="flex flex-col space-y-4 mb-12">
        <h3 class="mb-4 text-2xl font-medium text-gray-900 md:mb-5">About {{ company?.name }}</h3>

        <article class="mb-8 md:mb-12 md:text-lg">
          <p>{{ company?.description }}</p>

        </article>
      </div>
    </div>

    <CompanyInfoCard :company="company"
                     :show-view-profile-button="false" class="w-full" />
  </div>
</template>

<style scoped>

</style>