<script setup>


import {Direction} from "~/core/shared/types";

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
  company: {
    type: Object,
    required: true,
  },
  layoutDirection: {
    type: Direction,
    default: Direction.horizontal,
  }
})
</script>

<template>
  <section class="bg-blueGray-100 px-4 py-6 md:mt-4 rounded-xl">
    <div
        :class="['flex justify-between items-start', props.layoutDirection=== Direction.vertical? 'flex-col space-y-6':'']">
      <div class="space-y-2">
        <h3 class="text-xl font-semibold">Apply now</h3>
        <p>
          Please let {{ props.company?.name }} know you found this job on <b>FlutterGigs</b>. This helps us grow!
        </p>
      </div>

      <UButton :to="props.job?.howToApply" target="_blank" size="lg"
               :class="['bg-indigo-700',props.layoutDirection=== Direction.vertical?'w-full text-center flex justify-center items-center':'' ]"
               square label="Apply now" color="primary"
               variant="solid"/>
    </div>
  </section>

</template>

<style scoped>

</style>

