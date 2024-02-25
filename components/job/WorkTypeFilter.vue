<script setup lang="ts">
import {workTypeOptions} from "~/core/constants";

const selected = ref(workTypeOptions[0].id)
</script>


<template>
  <USelectMenu
      clear-search-on-close
      searchable
      v-model="selected"
      :options="workTypeOptions"
      placeholder="Select a work type option"
      value-attribute="id"
      option-attribute="name"
  />
</template>

<style scoped>

</style>