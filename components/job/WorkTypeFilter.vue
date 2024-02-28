<script setup lang="ts">
import {workTypeOptions} from "~/core/constants";

const selected = ref(null)

//@ts-ignore
const emits = defineEmits(['filterByWorkType'])
watch(selected, ()=>{
  emits('filterByWorkType', selected.value)
},)
</script>


<template>
  <USelectMenu
      clear-search-on-close
      searchable
      size="lg"
      v-model="selected"
      :options="workTypeOptions"
      placeholder="Select a work type option"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>