<script lang="ts" setup>
  //@ts-ignore
  import OgPreview from '~/components/job/OgPreview.vue';
  import type { JobOffer } from '~/features/jobs/job.types';

  const jobOffer = defineProps<Partial<JobOffer>>();

  const jobOfferTitle = computed(() =>
    jobOffer.title
      ? jobOffer.title.length > 85
        ? `${jobOffer.title.substring(0, 85)}...`
        : jobOffer.title
      : 'Untitled Job',
  );
</script>

<template>
  <div class="relative">
    <OgPreview />
    <div class="max-w-2xl h-[270px] absolute top-[80px] left-[305px]">
      <p class="text-7xl font-bold !leading-[32px] text-white">
        {{ jobOfferTitle }}
      </p>
    </div>
  </div>
</template>
