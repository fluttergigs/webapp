<script lang="ts" setup>
  import { workTypeOptions } from '~/core/constants';

  const selected = ref(null);

  //@ts-ignore
  const emits = defineEmits(['filterByWorkType']);
  watch(selected, () => {
    emits('filterByWorkType', selected.value);
  });
</script>

<template>
  <USelectMenu
    v-model="selected"
    :items="workTypeOptions"
    :required="false"
    clear-search-on-close
    option-attribute="label"
    placeholder="Select a work type option"
    searchable
    size="lg"
    value-attribute="id"
  />
</template>

<style scoped></style>
