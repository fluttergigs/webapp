<script setup lang="ts">

</script>

<template>
  <div class="rounded-full border-indigo absolute top-8 left-8 cursor-pointer"
       @click="useRouter().go(-1)">

    <UButton
        icon="i-heroicons-x-circle"
        color="indigo" variant="ghost"
        size="2xl"
    />
  </div>

</template>

<style scoped>

</style>