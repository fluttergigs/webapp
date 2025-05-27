<template>
  <UCollapsible class="flex flex-col gap-2">
    <UButton
      v-model:open="isDescriptionPanelOpen"
      label="Explain this snippet"
      icon="i-lucide-chevron-down"
      variant="outline"
      color="neutral"
      size="lg"
    />

    <template #content>
      <div
        class="glass-card px-3 py-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md"
      >
        <p class="font-medium text-sm sm:text-md text-gray-700 dark:text-gray-400">
          {{ snippet.description }}
        </p>
      </div>
    </template>
  </UCollapsible>
</template>

<script lang="ts" setup>
import type { Snippet } from "~/features/fluppets/fluppets.types";
import { AnalyticsEvent } from "~/services/analytics/events";

const props = defineProps({
  snippet: {
    type: Object as PropType<Snippet>,
    required: true,
  },
});

const isDescriptionPanelOpen = ref(false);
//watch description panel state to track analytics
watch(isDescriptionPanelOpen, () => {
  if (isDescriptionPanelOpen.value) {
    useAnalytics().capture(AnalyticsEvent.fluppetsDescriptionPanelClicked, {
      snippet: props.snippet,
    });
  }
});
</script>

<style></style>
