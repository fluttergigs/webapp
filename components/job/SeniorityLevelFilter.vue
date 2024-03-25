<script setup lang="ts">

import {seniorityLevelOptions} from "~/core/constants";

const selected = ref(null)

//@ts-ignore
const emits = defineEmits(['filterBySeniorityLevel'])
watch(selected, ()=>{
  emits('filterBySeniorityLevel', selected.value)
},)
</script>

<template>
  <USelectMenu
      clear-search-on-close
      searchable
      size="lg"
      v-model="selected"
      :options="seniorityLevelOptions"
      placeholder="Select an experience level"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>