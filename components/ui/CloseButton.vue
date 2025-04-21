<script lang="ts" setup></script>

<template>
  <div
    class="rounded-full border-indigo absolute top-8 left-8 cursor-pointer"
    @click="useRouter().go(-1)"
  >
    <UButton color="indigo" icon="i-heroicons-x-circle" size="2xl" variant="ghost" />
  </div>
</template>

<style scoped></style>
