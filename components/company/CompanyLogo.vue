<script lang="ts" setup>
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
      :alt="props.company?.name + ' logo'"
      :size="size"
      :src="company?.logo" :text="props.company?.name?.substring(0,1)!"
      class="border-2 border-white"
      icon="i-heroicons-photo"/>
</template>

<style scoped>

</style>