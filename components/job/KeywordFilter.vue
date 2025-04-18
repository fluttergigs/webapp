<script lang="ts" setup>

  const searchKeyword = ref('');
  //@ts-ignore
  const emits = defineEmits(['filterByKeyword']);
  watch(searchKeyword, () => {
    emits('filterByKeyword', searchKeyword.value);
  });

</script>

<template>
  <UInput v-model="searchKeyword"
          :trailing="false"
          color="white"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search..."
          size="md"
          variant="outline" />
</template>

<style scoped>

</style>