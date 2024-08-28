<script setup lang="ts">


import {Direction} from "~/core/shared/types";
//@ts-ignore
import type {PropType} from "@vue/runtime-core";
//@ts-ignore
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
    type: Object as PropType<Direction>,
    default: Direction.horizontal,
  }
})

const {handleJobApply} = useJobActions()
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

      <UButton @click="handleJobApply(props.job)" size="lg"
               :class="['bg-indigo-700',props.layoutDirection=== Direction.vertical?'w-full text-center flex justify-center items-center':'' ]"
               square label="Apply now" color="primary"
               variant="solid"/>
    </div>
  </section>

</template>

<style scoped>

</style>

