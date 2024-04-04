<script setup lang="ts">
//@ts-ignore
import type {PropType} from "@vue/runtime-core";
import type {Company} from "~/features/companies/company.types";

//@ts-ignore
const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true,
  },
  size: {
    type: String,
    default: 'sm',
  }
})
</script>

<template>
  <UAvatar
      icon="i-heroicons-photo"
      class="border-2 border-white"
      :alt="company.name + ' logo'" :size="size"
      :src="company.logo"
      :text="props.company?.name?.substring(0,1)!"/>
</template>

<style scoped>

</style>