<script lang="ts" setup>
  import { useFluppets } from '~/composables/useFluppets';
  import type { Tag } from '~/features/fluppets/fluppets.types';

  const { selectedTags, handleTagClick } = useFluppets();

  const props = defineProps({
    tag: {
      type: Object as PropType<Tag>,
      required: true,
    },
  });

  const isSelected = computed(() => selectedTags.value?.includes(props.tag));
</script>

<template>
  <div
    :class="[
      isSelected
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white',
    ]"
    class="cursor-pointer text-sm md:text-md font-bold rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:text-white p-2"
    @click="handleTagClick(tag)"
  >
    {{ tag.name }}
  </div>
</template>

<style scoped></style>
