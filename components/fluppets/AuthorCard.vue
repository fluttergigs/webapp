<template>
  <div class="glass-card p-2">
    <div class="flex items-center gap-2 mb-3">
      <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z">
          </path>
        </svg>
      </div>
      <h3 class="text-lg font-heading font-semibold dark:text-white">Author</h3>
    </div>
    <div
      class="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors border-gray-600/20 dark:bg-gray-900/30 rounded-lg p-3 border dark:border-gray-300/10">
      <img src="https://fluttergigs.com/ico.webp" alt="Community"
        class="w-10 h-10 rounded-full border border-primary/20" />
      <div>
        <p class="font-medium dark:text-white">
          {{ snippet.user?.username ?? "@fluttergigs" }}
        </p>

        <p class="text-sm">
          Published
          <span class="font-medium" v-date-format="{ date: snippet.updatedAt, format: 'YYYY-MMM D' }"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Snippet } from "~/features/fluppets/fluppets.types";

const props = defineProps({
  snippet: {
    type: Object as PropType<Snippet>,
    required: true,
  },
});

const isCommunityPost = computed(() => props.snippet.user === null);
</script>

<style></style>
