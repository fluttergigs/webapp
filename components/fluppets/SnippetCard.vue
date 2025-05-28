<template>
  <div
    @click="useFluppets().handleSnippetClick(snippet)"
    class="text-gray-700 flex flex-col gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 w-full mx-auto transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:-translate-y-2"
  >
    <div class="flex items-center gap-3 mb-2">
      <span
        :class="badgeColor"
        class="px-3 py-1 rounded-lg text-xs font-semibold capitalize"
      >
        {{ snippet.language }}
      </span>

      <div class="flex justify-center gap-1">
        <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-500" />
        <span
          v-date-format="{ date: snippet.updatedAt, format: 'YYYY-MMM D' }"
          class="text-xs"
        ></span>
      </div>
    </div>
    <USeparator />
    <h2 class="text-xl text-gray-900 font-bold mb-1">
      {{ userFacingTitle }}
    </h2>
    <p class="text-gray-600 text-md mb-4 text-ellipsis">
      {{ userFacingDescription }}
    </p>
    <div class="flex justify-between">
      <div class="flex justify-center items-center space-x-2 text-sm">
        <UIcon name="i-lucide-circle-user" class="w-6 h-6 text-indigo-700" />
        <span>{{ snippet.user?.username || "@Community" }}</span>
      </div>
    </div>

    <UiCodeBlock
      @contextmenu.prevent
      :code="snippet.code"
      :language="snippet.language"
      @copy="useCopyGate().copy(snippet)"
      @share="useFluppets().handleFluppetsShare(snippet)"
    />

    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in snippet.tags"
        :key="tag.documentId"
        class="bg-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs font-medium"
      >
        #{{ tag.slug }}
      </span>
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

const userFacingTitle = computed(() =>
  props.snippet.title.length > 50
    ? props.snippet.title.slice(0, 50) + "..."
    : props.snippet.title
);

const userFacingDescription = computed(() =>
  props.snippet.description.length > 100
    ? props.snippet.description.slice(0, 100) + "..."
    : props.snippet.description
);

// Dynamic badge color by language
const badgeColor = computed(() => {
  switch (props.snippet.language.toLowerCase()) {
    case "javascript":
      return "bg-yellow-100 text-yellow-800";
    case "dart":
      return "bg-blue-100 text-blue-800";
    case "python":
      return "bg-cyan-100 text-cyan-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});
</script>
