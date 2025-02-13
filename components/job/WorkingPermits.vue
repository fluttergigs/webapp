<script setup>
//@ts-ignore

//@ts-ignore
const props = defineProps({
  countries: Array,
})
</script>

<template>
  <div v-if="!!countries && countries?.length > 0"
       class="inline-flex items-center border
            rounded-md font-medium w-max rounded-l-2xl
            text-sm pr-2 pl-0.5 py-0.5"
       style="width: fit-content">
    <img :src="countries?.[0].flag.src" alt="Flag" class="rounded-full w-5 h-5 mr-1.5"/>
    <span>{{ useJobActions().userFacingWorkingPermits(countries) }}</span>
  </div>
</template>

<style scoped>

</style>