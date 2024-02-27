<script setup lang="ts">

const searchKeyword = ref('')
</script>

<template>
  <UInput color="white"
          v-model="searchKeyword"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="md"
          :trailing="false"
          variant="outline"
          placeholder="Search..."/>
</template>

<style scoped>

</style>