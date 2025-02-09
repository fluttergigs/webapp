<script lang="ts" setup>
//@ts-ignore

import type {JobOffer} from "~/features/jobs/job.types";
import OgPreview from "~/components/job/OgPreview.vue";

const jobOffer = defineProps<Partial<JobOffer>>()

</script>

<template>
  <div class="relative">
    <OgPreview/>
    <p class="absolute top-[80px] left-[300px] text-5xl font-bold leading-4 max-w-sm text-white">
      {{ jobOffer.title }}
    </p>
  </div>
</template>