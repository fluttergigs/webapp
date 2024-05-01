<script setup lang="ts">
import {companySizeOptions} from "~/core/constants";

const selected = ref(null)

//@ts-ignore
const emits = defineEmits(['filterBySize'])
watch(selected, ()=>{
  emits('filterBySize', selected.value)
},)
</script>


<template>
  <USelectMenu
      clear-search-on-close
      searchable
      :required="false"
      size="lg"
      v-model="selected"
      :options="companySizeOptions"
      placeholder="Select a company size option"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>