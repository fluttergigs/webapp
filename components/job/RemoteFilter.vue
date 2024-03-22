<script setup lang="ts">

import {remoteOptions} from "~/core/constants";

const selected = ref(null)
//@ts-ignore
const emits = defineEmits(['filterByRemoteOptions'])
watch(selected, ()=>{
  emits('filterByRemoteOptions', selected.value)
},)

</script>

<template>
  <USelectMenu
      clear-search-on-close
      searchable
      v-model="selected"
      size="lg"
      :options="remoteOptions"
      placeholder="Select your remote options"
      value-attribute="id"
      option-attribute="label"
  />
</template>

<style scoped>

</style>