<script lang="ts" setup>
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import type { Company } from '~/features/companies/company.types';
  import LinkedinIcon from '~/components/icons/LinkedinIcon.vue';
  import ItemData from '~/components/job/ItemData.vue';
  import { userFacingCompanySize } from '~/features/companies/transformers';
  import TwitterIcon from '~/components/icons/TwitterIcon.vue';
  import { useFeatureFlags } from '~/composables/useFeatureFlags';
  import { AvailableFlags } from '~/services/feature-flag/available_flags';

  //@ts-ignore
  const props = defineProps({
      company: {
        type: Object as PropType<Company>,
        required: true,
      },
      showViewProfileButton: {
        type: Boolean,
        default: () => true,
      },
    },
  );

  const isCompanyFeatureEnabled = ref(false);

  onMounted(() => {
    isCompanyFeatureEnabled.value = useFeatureFlags().isEnabled(AvailableFlags.companiesList);
  });
</script>

<template>
  <div v-if="isCompanyFeatureEnabled" class="p-6 border rounded-xl space-y-5 flex flex-col" style="height: fit-content">
    <div class="flex space-x-2 items-center">
      <CompanyLogo :company="company as Company" />
      <span class="text-lg text-gray-900 font-medium">
            {{ props.company?.name }}
          </span>
    </div>

    <ItemData label="Company Size">
      <template #content>
        <div class="flex items-center space-x-1">
          <UIcon class="text-gray-600" name="i-heroicons-building-office" />
          <span class="text-black font-medium">
            {{ userFacingCompanySize(props.company?.size) }}
          </span>
        </div>

      </template>
    </ItemData>
    <ItemData v-if="useCompanyActions().hasSocialMedia(props.company as Company)" label="Social Media">
      <template #content>
        <div class="flex items-center space-x-2">
          <a v-if="!!props.company?.linkedin" :href="props.company?.linkedin" class="p-2 border rounded-md"
             target="_blank">
            <LinkedinIcon class="w-4 h-4" />
          </a>
          <a v-if="!!props.company?.twitter"
             :href="props.company?.twitter" class="p-2 border rounded-md"
             target="_blank">
            <TwitterIcon class="w-4 h-4" />
          </a>
        </div>
      </template>
    </ItemData>

    <UButton v-if="showViewProfileButton"
             :class="['bg-indigo-700','w-full text-center flex justify-center items-center']"
             :to="AppRoutes.companyPage(props.company?.slug!)"
             label="View company profile"
             size="lg" square
             variant="solid" />

    <UButton :class="['w-full text-center flex justify-center items-center']" :label="`Visit my website`"
             :to="props.company?.website"
             color="white"
             size="lg"
             square
             target="_blank"
             variant="solid" />
  </div>
</template>

<style scoped>

</style>