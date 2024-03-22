<script setup>
//@ts-ignore

//@ts-ignore
const props = defineProps({
  countries: Array,
})
</script>

<template>
  <div style="width: fit-content"
      class="inline-flex items-center border
            rounded-md font-medium w-max rounded-l-2xl
            text-xs pr-2 pl-0.5 py-0.5"
      v-if="!!countries && countries?.length > 0">
    <img alt="Flag" class="rounded-full w-4 h-4 mr-1.5" :src="countries?.[0].flag.src"/>
    <span>{{ useJobActions().userFacingWorkingPermits(countries) }}</span>
  </div>
</template>

<style scoped>

</style>