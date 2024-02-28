<script setup lang="ts">
import {workTypeOptions} from "~/core/constants";

const selected = ref(workTypeOptions[0].id)

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
      v-model="selected"
      :options="workTypeOptions"
      placeholder="Select a work type option"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>