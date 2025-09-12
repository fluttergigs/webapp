<script lang="ts" setup>
import { computed } from 'vue'
import OgPreview from '~/components/job/OgPreview.vue'
import type { JobOffer } from '~/features/jobs/job.types'

interface Props extends /* @vue-ignore */ Partial<JobOffer> {}

const props = defineProps<Props>()
const title = props.title ?? 'FlutterGigs Job offer'

const jobOfferTitle = computed(() =>
  title.length > 85 ? `${title.substring(0, 85)}...` : title
)
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
