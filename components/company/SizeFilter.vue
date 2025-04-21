<script lang="ts" setup>
  import { companySizeOptions } from '~/core/constants';

  const selected = ref(null);

  //@ts-ignore
  const emits = defineEmits(['filterBySize']);
  watch(selected, () => {
    emits('filterBySize', selected.value);
  });
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="companySizeOptions"
    :required="false"
    clear-search-on-close
    option-attribute="label"
    placeholder="Select a company size option"
    searchable
    size="lg"
    value-attribute="id"
  />
</template>

<style scoped></style>
