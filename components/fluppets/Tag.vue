<script lang="ts" setup>
  import { useFluppets } from '~/composables/useFluppets';
  import type { Tag } from '~/features/fluppets/fluppets.types';

  const { selectedTags } = useFluppets();

  const props = defineProps({
    tag: {
      type: Object as PropType<Tag>,
      required: true,
    },
    showHashtag: {
      type: Boolean,
      default: false,
    },
    showCount: {
      type: Boolean,
      default: true,
    },
  });

  const isSelected = computed(() => selectedTags.value?.includes(props.tag));

  const emit = defineEmits(['tag-click']);
</script>

<template>
  <div
    :class="[
      isSelected
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white',
    ]"
    class="cursor-pointer text-sm md:text-md font-bold rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:text-white p-2"
    @click="emit('tag-click', tag)"
  >
    <span v-if="showHashtag" class="mr-1">#</span>
    {{ tag.name }}
    <span v-if="showCount" class="ml-1">({{ tag.snippets?.length ?? 0 }})</span>
  </div>
</template>

<style scoped></style>
