<script setup lang="ts">
//@ts-ignore
import type {PropType} from "@vue/runtime-core";
import type {Company} from "~/features/companies/company.types";
import LinkedinIcon from "~/components/icons/LinkedinIcon.vue";
import ItemData from "~/components/job/ItemData.vue";
import {userFacingCompanySize} from "~/features/companies/transformers";
import TwitterIcon from "~/components/icons/TwitterIcon.vue";

//@ts-ignore
const props = defineProps({
      company: {
        type: Object as PropType<Company>,
        required: true,
      },
      showViewProfileButton: {
        type: Boolean,
        default: () => true,
      }
    }
)
</script>

<template>
  <div class="p-6 border rounded-xl space-y-5 flex flex-col">

    <div class="flex space-x-2 items-center">
      <CompanyLogo :company="company as Company"/>
      <span class="text-lg text-gray-900 font-medium">
            {{ props.company?.name }}
          </span>
    </div>

    <ItemData label="Company Size">
      <template #content>
        <div class="flex items-center space-x-1">
          <UIcon class="text-gray-600" name="i-heroicons-building-office"/>
          <span class="text-black font-medium">
            {{ userFacingCompanySize(props.company?.size) }}
          </span>
        </div>

      </template>
    </ItemData>
    <ItemData label="Social Media" v-if="useCompanyActions().hasSocialMedia(props.company as Company)">
      <template #content>
        <div class="flex items-center space-x-2">
          <a v-if="!!props.company?.linkedin" :href="props.company?.linkedin" target="_blank"
             class="p-2 border rounded-md">
            <LinkedinIcon class="w-4 h-4"/>
          </a>
          <a v-if="!!props.company?.twitter" :href="props.company?.twitter" target="_blank"
             class="p-2 border rounded-md">
            <TwitterIcon class="w-4 h-4"/>
          </a>
        </div>

      </template>
    </ItemData>

    <UButton v-if="showViewProfileButton" :to="AppRoutes.companyPage(props.company?.slug!)" target="_blank" size="lg"
             :class="['bg-indigo-700','w-full text-center flex justify-center items-center']"
             square label="View company profile"
             variant="solid"/>

    <UButton :to="props.company?.website" target="_blank" size="lg"
             :class="['w-full text-center flex justify-center items-center']"
             square
             :label="`Visit ${props.company?.website}`"
             color="white"
             variant="solid"/>
  </div>
</template>

<style scoped>

</style>