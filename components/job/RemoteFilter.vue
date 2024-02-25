<script setup lang="ts">

import {remoteOptions} from "~/core/constants";

const selected = ref(remoteOptions[0].id)

</script>

<template>
  <USelectMenu
      clear-search-on-close
      searchable
      v-model="selected"
      multiple
      :options="remoteOptions"
      placeholder="Select your remote options"
      value-attribute="id"
      option-attribute="name"
  />
</template>

<style scoped>

</style>