<script lang="ts" setup>
  import { seniorityLevelOptions } from '~/core/constants';

  const selected = ref(null);

  //@ts-ignore
  const emits = defineEmits(['filterBySeniorityLevel']);
  watch(selected, () => {
    emits('filterBySeniorityLevel', selected.value);
  });
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="seniorityLevelOptions"
    clear-search-on-close
    label-key="label"
    placeholder="Select an experience level"
    searchable
    size="lg"
    value-key="id"
  />
</template>

<style scoped></style>
