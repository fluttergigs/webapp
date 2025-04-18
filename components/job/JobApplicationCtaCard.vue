<script lang="ts" setup>


  import { Direction } from '~/core/shared/types';
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
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
    },
  });

  const { handleJobApply } = useJobActions();
</script>

<template>
  <section class="bg-blueGray-100 px-4 py-6 mt-2 md:mt-4 rounded-xl">
    <div
      :class="['flex justify-between items-start', props.layoutDirection=== Direction.vertical? 'flex-col space-y-6':'']">
      <div class="space-y-2">
        <h3 class="text-xl font-semibold">Apply now</h3>
        <p>
          Please let {{ props.company?.name }} know you found this job on <b>FlutterGigs</b>. This helps us grow!
        </p>
      </div>

      <UButton
        :class="['bg-indigo-700',props.layoutDirection=== Direction.vertical?'w-full text-center flex justify-center items-center':'' ]"
        color="primary"
        label="Get the opportunity"
        size="xl" square variant="solid"
        @click="handleJobApply(props.job)" />
    </div>
  </section>

</template>

<style scoped>

</style>

