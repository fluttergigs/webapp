<script lang="ts" setup>
  import { remoteOptions } from '~/core/constants';

  const selected = ref(null);
  //@ts-ignore
  const emits = defineEmits(['filterByRemoteOptions']);
  watch(selected, () => {
    emits('filterByRemoteOptions', selected.value);
  });
</script>

<template>
  <USelectMenu
    v-model="selected"
    :items="remoteOptions"
    clear-search-on-close
    label-key="label"
    placeholder="Select your remote options"
    searchable
    size="lg"
    value-key="id"
  />
</template>

<style scoped></style>
