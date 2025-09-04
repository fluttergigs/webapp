<template>
  <div class="flex w-full items-center justify-center">
    <div class="flex justify-center items-center h-full w-full" v-if="isLoading">
      <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-indigo-600" />
    </div>

    <div v-else-if="list.length === 0" class="flex justify-center items-center h-full w-full">
      <div class="flex flex-col items-center justify-center py-16">
        <UIcon name="i-lucide-search-x" class="w-16 h-16 text-gray-300 mb-4" />
        <h2 class="text-xl font-semibold text-gray-700 mb-2">No snippets found</h2>
        <p class="text-gray-500 mb-6 text-center max-w-sm">
          We couldn't find any snippets matching your criteria. Try adjusting your filters.
        </p>
        <UButton label="Reset Filters" size="lg" variant="subtle" @click="emit('reset-filters')" />
      </div>
    </div>

    <div v-else class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
      <SnippetCard
        v-for="fluppet in list"
        :key="fluppet.documentId"
        :snippet="fluppet"
        v-memo="[fluppet]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  //@ts-ignore
  import SnippetCard from '~/components/fluppets/SnippetCard.vue';
  import type { Snippet } from '~/features/fluppets/fluppets.types';

  defineProps({
    isLoading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array as PropType<Snippet[]>,
      required: true,
    },
  });

  const emit = defineEmits(['reset-filters']);
</script>

<style lang="scss" scoped></style>
