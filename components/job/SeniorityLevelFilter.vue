<script setup lang="ts">

import {seniorityLevelOptions} from "~/core/constants";

const selected = ref(seniorityLevelOptions[0].id)

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
      placeholder="Select a seniority level"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>