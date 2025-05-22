<script setup>
  //@ts-ignore

  //@ts-ignore
  const props = defineProps({
    countries: Array,
  });
</script>

<template>
  <div class="text-md font-medium">
    <div
      v-if="!!countries && countries?.length > 0"
      class="inline-flex items-center border border-gray-200 rounded-md w-max rounded-l-2xl text-[12px] pr-2 pl-0.5 py-0.5"
      style="width: fit-content"
    >
      <img :src="countries?.[0].flag.src" alt="Flag" class="rounded-full w-5 h-5 mr-1.5" />
      <span>{{ useJobActions().userFacingWorkingPermits(countries) }}</span>
    </div>
    <div v-else>
      <span>N/A</span>
    </div>
  </div>
</template>

<style scoped></style>
